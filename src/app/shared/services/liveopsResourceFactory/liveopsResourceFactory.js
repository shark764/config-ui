'use strict';

angular.module('liveopsConfigPanel')
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'apiHostname', 'Session', 'queryCache', 'lodash',
    function($http, $resource, $q, apiHostname, Session, queryCache, _) {
      function parseResponseResultTransformer(value) {
        if (value.result) {
          return value.result;
        }

        return value;
      }

      function createJsonReplacer(key, value) {
        if (_.startsWith(key, '$')) {
          return undefined;
        } else {
          return value;
        }
      }

      function getInterceptor(interceptorParam) {
        if (angular.isArray(interceptorParam)) {
          var interceptorFunc = function(response) {
            angular.forEach(interceptorParam, function(interceptor) {
              interceptor.response(response);
            });

            return response.resource;
          };

          var interceptor = {
            response: interceptorFunc
          };

          return interceptor;
        } else {
          return interceptorParam;
        }
      }

      function updateJsonReplacer(key, value) {
        // if the key starts with a $ then its a private field
        // and should NOT be passed to the API
        if (_.startsWith(key, '$')) {
          return undefined;
        }

        return value;
      }

      return {
        create: function(params) {
          function filterUpdateFieldTransformer(data) {
            var cleanedData = angular.copy(data);
            angular.forEach(cleanedData, function(value, key) {
              var i = _.findIndex(params.updateFields, {
                'name': key
              });
              if (i < 0 || (value === null && params.updateFields[i].optional)) {
                delete cleanedData[key];
              }
            });

            return cleanedData;
          }

          function defaultUpdateRequestTransformer(data) {
            var validUpdateFields = filterUpdateFieldTransformer(data);
            return JSON.stringify(validUpdateFields, updateJsonReplacer);
          }

          function defaultSaveRequestTransformer(data) {
            return JSON.stringify(data, createJsonReplacer);
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
          
          var defaultResponseTransformer =
            Array.prototype.concat($http.defaults.transformResponse, parseResponseResultTransformer);
          
          var getRequestTransformer = params.getRequestTransformer;
          var getResponseTransformer = params.getResponseTransformer ?
            Array.prototype.concat(params.getResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;
            
          var queryRequestTransformer = params.queryRequestTransformer;
          var queryResponseTransformer = params.queryResponseTransformer ?
            Array.prototype.concat(params.queryResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;
            
          var putRequestTransformer = params.putRequestTransformer ?
            Array.prototype.concat(params.putRequestTransformer, defaultUpdateRequestTransformer) :
            defaultUpdateRequestTransformer;
          var putResponseTransformer = params.putResponseTransformer ?
            Array.prototype.concat(params.putRequestTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;
            
          var postRequestTransformer = params.postRequestTransformer ?
            Array.prototype.concat(params.postRequestTransformer, defaultSaveRequestTransformer) :
            defaultSaveRequestTransformer;
          var postResponseTransformer = params.postResponseTransformer ?
            Array.prototype.concat(params.postResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;
            
          var deleteRequestTransformer = params.deleteRequestTransformer;
          var deleteResponseTransformer = params.deleteResponseTransformer ?
            Array.prototype.concat(params.deleteResponseTransformer, defaultResponseTransformer) :
            defaultResponseTransformer;
          
          var defaultHeaders = {
            'Content-Type': 'application/json'
          };
          
          var Resource = $resource(apiHostname + params.endpoint, params.requestUrlFields, {
            query: {
              method: 'GET',
              isArray: true,
              headers: defaultHeaders,
              transformRequest: queryRequestTransformer,
              transformResponse: queryResponseTransformer,
              interceptor: getInterceptor(params.queryInterceptor)
            },
            
            get: {
              method: 'GET',
              headers: defaultHeaders,
              transformRequest: getRequestTransformer,
              transformResponse: getResponseTransformer,
              interceptor: getInterceptor(params.getInterceptor)
            },

            update: {
              method: 'PUT',
              headers: defaultHeaders,
              transformRequest: putRequestTransformer,
              transformResponse: putResponseTransformer,
              interceptor: getInterceptor(params.updateInterceptor),
            },

            save: {
              method: 'POST',
              headers: defaultHeaders,
              transformRequest: postRequestTransformer,
              transformResponse: postResponseTransformer,
              interceptor: getInterceptor(params.saveInterceptor),
            },

            delete: {
              method: 'DELETE',
              headers: defaultHeaders,
              transformRequest: deleteRequestTransformer,
              transformResponse: deleteResponseTransformer,
              interceptor: getInterceptor(params.saveInterceptor)
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
          Resource.prototype.$update = function(queryParams, success, failure) {
            var promise = proxyUpdate.call(this, queryParams, success, failure);
            
            var backup = {};
            angular.forEach(this, function(value, key) {
              if (key.match(/^\$[^$].*/g) &&
                !angular.isFunction(value) &&
                (['$original', '$busy', '$resolved'].indexOf(key) < 0)) {
                backup[key] = value;
              }
            });
            
            promise.then(function(result) {
              result.$original = angular.copy(result);
              angular.extend(result, backup);
              return result;
            });

            return promise;
          };

          Resource.cachedGet = function(params, cacheKey, invalidate) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;

            var cache = queryCache.get(key);

            if (!cache || invalidate) {
              queryCache.put(key, []);
              cache = queryCache.get(key);
            }

            var item = _.find(cache, params);

            if (!item) {
              item = this.get(params);

              for (var index in params) {
                item[index] = params[index];
              }

              cache.push(item);
            }

            return item;
          };

          Resource.cachedQuery = function(params, cacheKey, invalidate) {
            var key = cacheKey ? cacheKey : this.prototype.resourceName;
            if (!queryCache.get(key) || invalidate) {
              var items = this.query(params);
              queryCache.put(key, items);
              return items;
            }

            return queryCache.get(key);
          };

          Resource.prototype.save = function(params, success, failure) {
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
              .then(function(result) {
                return postEvent.call(self, result);
              }, function(error) {
                postEventFail.call(self, error);
                return $q.reject(error);
              })
              .then(function(result) {
                return self.postSave.call(self, result);
              }, function(error) {
                self.postSaveError.call(self, error);
                return $q.reject(error);
              })
              .then(function(result) {
                self.$original = angular.copy(result);
                if(self.$original && self.$original.$original) {
                  delete self.$original.$original; //Prevent the object from keeping a history, if $original is present on result
                }
                
                return result;
              }).finally(function() {
                self.$busy = false;
              });
          };

          Resource.prototype.reset = function() {
            for (var prop in this.$original) {
              if (prop.match(/^\$.*/g) ||
                angular.isFunction(this.$original[prop])) {
                continue;
              }
              this[prop] = angular.copy(this.$original[prop]);
            }
          };

          Resource.prototype.preCreate = function() {
            return {};
          };

          Resource.prototype.postCreate = function(resource) {
            return resource;
          };
          Resource.prototype.postCreateError = function(errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          };

          Resource.prototype.preUpdate = function() {
            return {};
          };

          Resource.prototype.postUpdate = function(resource) {
            return resource;
          };
          Resource.prototype.postUpdateError = function(errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          };

          Resource.prototype.preSave = function(params) {
            return params;
          };
          Resource.prototype.postSave = function(resource) {
            return resource;
          };
          Resource.prototype.postSaveError = function(errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          };

          Resource.prototype.getDisplay = function() {
            return this.toString();
          };

          Resource.prototype.isNew = function() {
            return !(this.hasOwnProperty('created') || angular.isDefined(this.id));
          };

          Resource.prototype.$busy = false;

          return Resource;
        }
      };
    }
  ]);
