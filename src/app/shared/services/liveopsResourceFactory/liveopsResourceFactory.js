'use strict';

angular.module('liveopsConfigPanel')
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'apiHostname', 'Session', 'SaveInterceptor', 'DeleteInterceptor', 'queryCache', 'lodash',
    function ($http, $resource, $q, apiHostname, Session, SaveInterceptor, DeleteInterceptor, queryCache, _) {
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
        if(_.startsWith(key, '$')) return undefined
        else return value;
      }

      return {
        create: function (endpoint, resourceName, updateFields, requestUrlFields) {

          var updateJsonReplacer = function  (key, value) {

            // if the key starts with a $ then its a private field
            // and should NOT be passed to the API
            if (_.startsWith(key, '$')){
              return undefined;
            }

            // empty string indicates that its verifying if it should
            // check any part; always return the value
            if(key === ''){
              return value;
            }

            var i = _.findIndex(updateFields, {'name' : key});

            if(i >= 0 && (value !== null || !updateFields[i].optional)){
              return value;
            }

            return undefined;
          };

          var requestUrlFields = typeof requestUrlFields !== 'undefined' ? requestUrlFields : {
            id: '@id',
            tenantId: '@tenantId',
            groupId: '@groupId',
            flowId: '@flowId',
            queueId: '@queueId',
            userId: '@userId',
            memberId: '@memberId'
          };

          var Resource = $resource(apiHostname + endpoint, requestUrlFields, {
            query: {
              method: 'GET',
              isArray: true,
              transformResponse: appendTransform($http.defaults.transformResponse, function (values) {
                return getResult(values);
              })
            },
            get: {
              method: 'GET',
              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              })
            },
            update: {
              method: 'PUT',
              interceptor: SaveInterceptor,
              transformRequest: function (data) {
                return JSON.stringify(data, updateJsonReplacer);
              },

              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              })
            },
            save: {
              method: 'POST',
              interceptor: SaveInterceptor,
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
              interceptor: DeleteInterceptor
            }
          });

          Resource.prototype.resourceName = resourceName;

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
            
            
            if(angular.isFunction(params)) {
              success = params;
              failure = success;
            }
            
            //TODO find out why preEvent didn't work in the chain
            preEvent.call(self);
            self.preSave();

            self.$busy = true;

            return action.call(self, params)
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

                if (success) {
                  return success.call(self, result);
                }

                return result;
              }, function (error) {
                if (failure) {
                  return failure.call(self, error);
                }

                return $q.reject(error);
              }).finally(function () {
                self.$busy = false;
              });
          };

          Resource.prototype.reset = function () {
            for(var prop in this.$original) {
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
            return !this.id;
          };

          Resource.prototype.$busy = false;

          return Resource;
        }
      };
    }
  ]);
