'use strict';

angular.module('liveopsConfigPanel')
  .factory('ServiceFactory', ['$http', '$resource', 'apiHostname', 'Session', function ($http, $resource, apiHostname, Session) {
    function appendTransform(defaults, transform) {

      // We can't guarantee that the default transformation is an array
      defaults = angular.isArray(defaults) ? defaults : [defaults];

      // Append the new transformation to the defaults
      return defaults.concat(transform);
    }


    return {
      create: function (endpoint, setCreatedBy, setUpdatedBy) {
        setUpdatedBy = typeof setUpdatedBy !== 'undefined' ? setUpdatedBy : true;
        setCreatedBy = typeof setCreatedBy !== 'undefined' ? setCreatedBy : true;

        return $resource(apiHostname + endpoint, {}, {
          query: {
            method: 'GET',

            isArray: true,

            transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
                return value.result;
            })
          },
          get: {
            method: 'GET',

            transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
                return value.result;
            })
          },
          update: {
            method: 'PUT',
            transformRequest: function (data) {
              if (setUpdatedBy) {
                data.updatedBy = Session.id;
              }

              return JSON.stringify(data);
            }
          },
          save: {
            method: 'POST',
            transformRequest: function (data) {
              if (setCreatedBy) {
                data.createdBy = Session.id;
              }

              return JSON.stringify(data);
            }
          }
        });
      }
    };
  }]);