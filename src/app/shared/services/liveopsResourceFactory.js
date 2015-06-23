'use strict';

angular.module('liveopsConfigPanel')
  .factory('LiveopsResourceFactory', ['$http', '$resource', 'apiHostname', 'Session', 'SaveInterceptor',
    function ($http, $resource, apiHostname, Session, SaveInterceptor) {

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
        create: function (endpoint, setCreatedBy, setUpdatedBy, updateFields, requestUrlFields) {
          setUpdatedBy = typeof setUpdatedBy !== 'undefined' ? setUpdatedBy : true;
          setCreatedBy = typeof setCreatedBy !== 'undefined' ? setCreatedBy : true;
          requestUrlFields = typeof requestUrlFields !== 'undefined' ? requestUrlFields : {
            id : '@id',
            tenantId : '@tenantId',
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
                    
                    if(data[fieldName] !== null || !updateFields[i].optional){
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
            var isFunction = typeof(params) === 'function';

            if (this.id || this.added) {
              return isFunction ? this.$update(params, success) : this.$update(params, success, failure);
            }

            return isFunction ? this.$save(params, success) : this.$save(params, success, failure);
          };

          return Resource;
        }
      };
    }
  ]);
