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
          requestUrlFields = typeof requestUrlFields !== 'undefined' ? requestUrlFields : [ 'id', 'tenantId' ];

          var Resource = $resource(apiHostname + endpoint, {}, {
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
                    if(updateFields[i].optional && !data[fieldName]){
                      newData[fieldName] = '';
                    } else {
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

          Resource.prototype.save = function (params, success, failure) {
            if (requestUrlFields){
              var newParams = {};
              for (var i = 0; i < requestUrlFields.length; i++) {
                var fieldName = requestUrlFields[i];
                newParams[fieldName] = params[fieldName];
              }

              params = newParams;
            }

            if (this.id) {
              return this.$update(params, success, failure);
            }

            return this.$save(params, success, failure);
          };

          return Resource;
        }
      };
    }
  ]);
