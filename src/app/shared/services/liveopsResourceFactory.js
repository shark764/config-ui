'use strict';

angular.module('liveopsConfigPanel')
  .factory('LiveopsResourceFactory', ['$http', '$resource', 'apiHostname', 'Session', 'SaveInterceptor', 'UpdateInterceptor',
    function ($http, $resource, apiHostname, Session, SaveInterceptor, UpdateInterceptor) {

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
        create: function (endpoint, setCreatedBy, setUpdatedBy, updateFields) {
          setUpdatedBy = typeof setUpdatedBy !== 'undefined' ? setUpdatedBy : true;
          setCreatedBy = typeof setCreatedBy !== 'undefined' ? setCreatedBy : true;

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
              interceptor: UpdateInterceptor,
              transformRequest: function (data) {
                if (setUpdatedBy) {
                  data.updatedBy = Session.id;
                }

                if (updateFields) {
                  var newData = {};

                  for (var i = 0; i < updateFields.length; i++) {
                    var fieldName = updateFields[i];
                    newData[fieldName] = data[fieldName];
                  }

                  data = newData;
                }

                return JSON.stringify(data);
              },

              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              })
            },
            save: {
              method: 'POST',
              interceptor: SaveInterceptor,
              transformRequest: function (data) {

                if (setCreatedBy) {
                  data.createdBy = Session.id;
                }

                return JSON.stringify(data);
              },

              transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
                return getResult(value);
              })
            }
          });

          Resource.prototype.save = function (params, success, failure) {
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