'use strict';

angular.module('liveopsConfigPanel')
  .factory('ServiceFactory', ['$resource', 'apiHostname', 'Session', function ($resource, apiHostname, Session) {
    return {
      create: function (endpoint, setCreatedBy, setUpdatedBy) {
        setUpdatedBy = typeof setUpdatedBy !== 'undefined' ? setUpdatedBy : true;
        setCreatedBy = typeof setCreatedBy !== 'undefined' ? setCreatedBy : true;

        return $resource(apiHostname + endpoint, {}, {
          query: {
            method: 'GET',
            isArray: false
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