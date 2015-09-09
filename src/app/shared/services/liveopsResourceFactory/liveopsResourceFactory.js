'use strict';

angular.module('liveopsConfigPanel')
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'apiHostname', 'Session', 'queryCache', 'lodash',
    function ($http, $resource, $q, apiHostname, Session, queryCache, _) {
      function appendTransform(defaults, transform) {
        // We can't guarantee that the default transformation is an array
        defaults = angular.isArray(defaults) ? defaults : [defaults];

        // Append the new transformation to the defaults
        return defaults.concat(transform);
      }

      function getResult(value) {
        if (value.result) {
          return value.result;
        }

        return value;
      }

      function createJsonReplacer(key, value) {
        if(_.startsWith(key, '$')) {
          return undefined;
        } else {
          return value;
        }
      }
      
      function getInterceptor(interceptorParam){
        if (angular.isArray(interceptorParam)){
          var interceptorFunc = function(response){
            angular.forEach(interceptorParam, function(interceptor){
              interceptor.response(response);
            });
            
            return response.resource;
          };
          
          var interceptor = {
              response: interceptorFunc
          }
          
          return interceptor;
        } else {
          return interceptorParam;
        }
      }

      return {
        create: function (params) {

          var updateJsonReplacer = function  (key, value) {

            // if the key starts with a $ then its a private field
            // and should NOT be passed to the API
            if (_.startsWith(key, '$')){
              return undefined;
            }

            return value;
          };
          
          var cleanUpdateFields = function(data){
            var cleanedData = angular.copy(data);
            angular.forEach(cleanedData, function(value, key){
              var i = _.findIndex(params.updateFields, {'name' : key});
              if (i < 0 || (value === null && params.updateFields[i].optional)){
                delete cleanedData[key];
              }
            });
            
            return cleanedData;
          }

          params.requestUrlFields = angular.isDefined(params.requestUrlFields) ? params.requestUrlFields : {
            id: '@id',
            tenantId: '@tenantId',
            groupId: '@groupId',
            flowId: '@flowId',
            queueId: '@queueId',
            userId: '@userId',
            memberId: '@memberId'
          };
          
          var Resource = $resource(apiHostname + params.endpoint, params.requestUrlFields, {
            query: {
              method: 'GET',
              isArray: true,
              transformResponse: appendTransform($http.defaults.transformResponse, function (values) {
                return getResult(values);
              }),
              interceptor: params.queryInterceptor
            },
            get: {
              method: 'GET',
              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              }),
              interceptor: params.getInterceptor
            },
            update: {
              method: 'PUT',
              interceptor: getInterceptor(params.updateInterceptor),
              transformRequest: function (data) {
                var validUpdateFields = cleanUpdateFields(data);
                return JSON.stringify(validUpdateFields, updateJsonReplacer);
              },

              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              })
            },
            save: {
              method: 'POST',
              interceptor: getInterceptor(params.saveInterceptor),
              transformRequest: function (data) {
                return JSON.stringify(data, createJsonReplacer);
              },
              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              })
            },

            delete: {
              method: 'DELETE',
              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              }),
              interceptor: params.deleteInterceptor
            }
          });

          Resource.prototype.resourceName = params.resourceName;

          var proxyGet = Resource.get;

          Resource.get = function(params, success, failure) {
            var getResponse = proxyGet.call(this, params, success, failure);

            getResponse.$promise.then(function(result) {
              result.$original = angular.copy(result);
              return result;
            });

            return getResponse;
          };

          var proxyQuery = Resource.query;

          Resource.query = function(params, success, failure) {
            var getAllResponse = proxyQuery.call(this, params, success, failure);

            getAllResponse.$promise.then(function(results) {
              angular.forEach(results, function(result) {
                result.$original = angular.copy(result);
              });

              return results;
            });

            return getAllResponse;
          };

          var proxySave = Resource.prototype.$save;
          Resource.prototype.$save = function(params, success, failure) {
            var promise = proxySave.call(this, params, success, failure);

            promise.then(function(result) {
              result.$original = angular.copy(result);
              return result;
            });

            return promise;
          };

          var proxyUpdate = Resource.prototype.$update;
          Resource.prototype.$update = function(params, success, failure) {
            var promise = proxyUpdate.call(this, params, success, failure);

            promise.then(function(result) {
              result.$original = angular.copy(result);
              return result;
            });

            return promise;
          };

          Resource.cachedGet = function(params, cacheKey, invalidate) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;

            var cache = queryCache.get(key);

            if(!cache || invalidate) {
              queryCache.put(key, []);
              cache = queryCache.get(key);
            }

            var item = _.find(cache, params);
              
            if(!item) {
              item = this.get(params);
              
              for(var index in params) {
                item[index] = params[index];
              }
              
              cache.push(item);
            }
            
            return item;
          };

          Resource.cachedQuery = function(params, cacheKey, invalidate) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;
            if(!queryCache.get(key) || invalidate) {
              var items = this.query(params);
              queryCache.put(key, items);
              return items;
            }

            return queryCache.get(key);
          };

          Resource.prototype.save = function (params, success, failure) {
            var self = this,
              action = this.isNew() ? this.$save : this.$update,
              preEvent = self.isNew() ? self.preCreate : self.preUpdate,
              postEvent = self.isNew() ? self.postCreate : self.postUpdate,
              postEventFail = self.isNew() ? self.postCreateError : self.postUpdateError;

            //TODO find out why preEvent didn't work in the chain
            preEvent.call(self);
            self.preSave();

            self.$busy = true;

            return action.call(self, params, success, failure)
              .then(function (result) {
                return postEvent.call(self, result);
              }, function (error) {
                postEventFail.call(self, error);
                return $q.reject(error);
              })
              .then(function (result) {
                return self.postSave.call(self, result);
              }, function (error) {
                self.postSaveError.call(self, error);
                return $q.reject(error);
              })
              .then(function (result) {
                self.$original = angular.copy(result);

                return result;
              }).finally(function () {
                self.$busy = false;
              });
          };

          Resource.prototype.reset = function () {
            for(var prop in this.$original) {
              if(prop.match(/^\$.*/g) ||
                angular.isFunction(this.$original[prop])) {
                continue;
              }
              this[prop] = this.$original[prop];
            }
          };

          Resource.prototype.preCreate = function () {
            return {};
          };

          Resource.prototype.postCreate = function (resource) {
            return resource;
          };
          Resource.prototype.postCreateError = function (errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          };

          Resource.prototype.preUpdate = function () {
            return {};
          };

          Resource.prototype.postUpdate = function (resource) {
            return resource;
          };
          Resource.prototype.postUpdateError = function (errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          };

          Resource.prototype.preSave = function (params) {
            return params;
          };
          Resource.prototype.postSave = function (resource) {
            return resource;
          };
          Resource.prototype.postSaveError = function (errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          };

          Resource.prototype.getDisplay = function () {
            return this.toString();
          };

          Resource.prototype.isNew = function () {
            return !(this.hasOwnProperty('created') || angular.isDefined(this.id));
          };

          Resource.prototype.$busy = false;

          return Resource;
        }
      };
    }
  ]);
