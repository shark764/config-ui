'use strict';

angular.module('liveopsConfigPanel')

  .factory('ServiceFactory', ['$resource', 'apiHostname', 'Session', function ($resource, apiHostname, Session) {
    return {
      create : function(endpoint){
        return $resource(apiHostname + endpoint, {}, {
          query: {
            method: 'GET',
            isArray: false
          },
          update: {
            method: 'PUT',
            transformRequest: function (data, headers){
              data.updatedBy = Session.id;
              return JSON.stringify(data);
            }
          },
          save: {
            method: "POST",
            transformRequest: function (data, headers) {
              data.createdBy = Session.id;
              return JSON.stringify(data);
            }
          }
        });
      }
    }
  }]);

