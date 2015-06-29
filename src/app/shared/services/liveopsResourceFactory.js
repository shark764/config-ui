'use strict';

angular.module('liveopsConfigPanel')
  .factory('LiveopsResourceFactory', ['$http', '$resource', '$q', 'apiHostname', 'Session', 'SaveInterceptor',
    function ($http, $resource, $q, apiHostname, Session, SaveInterceptor) {

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
        create: function (endpoint, updateFields, requestUrlFields) {
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
              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
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
            }
          });

          /**
            Params can be a function or object.

            If it is a function

          **/
          Resource.prototype.save = function (params, success, failure) {
            this.$busy = true;

            var me = this;

            var isFunction = typeof (params) === 'function';
            var saveFun = this.isNew() ? this.$save : this.$update;
            var preFun = this.isNew() ? this.preCreate : this.preUpdate;
            var postFun = this.isNew() ? this.postCreate : this.postUpdate;

            var promise;
            if (this.isNew()) {
              if (isFunction) {

              } else {
                promise = $q.when(this.preUpdate(params));
                return promise.then(function (params) {
                    return me.$save(params);
                  })
                  .then(me.postCreate, me.postCreateError)
                  .then(me.postSave, me.postSaveError)
                  .finally(function () {
                    me.$busy = false;
                  });
              }
            } else {
              if (isFunction) {

              } else {
                promise = $q.when(this.preUpdate(params));
                return promise.then(function (params) {
                    return me.$update(params);
                  })
                  .then(me.postUpdate, me.postUpdateError)
                  .then(me.postSave, me.postSaveError)
                  .finally(function () {
                    me.$busy = false;
                  });
              }
            }
          };

          Resource.prototype.preCreate = function (params) {
            return params;
          }
          Resource.prototype.postCreate = function (resource, headers) {
            return resource;
          }
          Resource.prototype.postCreateError = function (errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          }

          Resource.prototype.preUpdate = function (params) {
            return params;
          }
          Resource.prototype.postUpdate = function (resource) {
            return resource;
          }
          Resource.prototype.postUpdateError = function (errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          }

          Resource.prototype.preSave = function (params) {
            return params;
          }
          Resource.prototype.postSave = function (resource) {
            return resource;
          }
          Resource.prototype.postSaveError = function (errors) {
            var d = $q.defer();
            d.reject(errors);
            return d.promise;
          }

          Resource.prototype.isNew = function () {
            return !this.id;
          }

          Resource.prototype.$busy = false;

          return Resource;
        }
      };
    }
  ]);