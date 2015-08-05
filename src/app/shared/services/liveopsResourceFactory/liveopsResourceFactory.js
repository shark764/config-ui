'use strict';

angular.module('liveopsConfigPanel')
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'apiHostname', 'Session', 'SaveInterceptor', 'DeleteInterceptor', 'queryCache',
    function ($http, $resource, $q, apiHostname, Session, SaveInterceptor, DeleteInterceptor, queryCache) {
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

      return {
        create: function (endpoint, resourceName, updateFields, requestUrlFields) {
          requestUrlFields = typeof requestUrlFields !== 'undefined' ? requestUrlFields : {
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
                values = getResult(values);

                return values;
              })
            },
            get: {
              method: 'GET',
              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                value = getResult(value);

                return value;
              })
            },
            update: {
              method: 'PUT',
              interceptor: SaveInterceptor,
              transformRequest: function (data) {
                var newData = {};

                if (updateFields) {
                  for (var i = 0; i < updateFields.length; i++) {
                    var fieldName = updateFields[i].name;

                    if (data[fieldName] !== null || !updateFields[i].optional) {
                      newData[fieldName] = data[fieldName];
                    }

                  }
                }

                return JSON.stringify(newData);
              },

              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              })
            },
            save: {
              method: 'POST',
              interceptor: SaveInterceptor,
              transformRequest: function (data) {
                if (data && angular.isDefined(data.$busy)) {
                  delete data.$busy;
                }

                return JSON.stringify(data);
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

          Resource.prototype.save = function (success, failure) {
            var self = this,
              action = this.isNew() ? this.$save : this.$update,
              preEvent = self.isNew() ? self.preCreate : self.preUpdate,
              postEvent = self.isNew() ? self.postCreate : self.postUpdate,
              postEventFail = self.isNew() ? self.postCreateError : self.postUpdateError;

            self.$busy = true;

            //TODO find out why preEvent didn't work in the chain
            preEvent.call(self);
            self.preSave();

            return action.call(self)
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
