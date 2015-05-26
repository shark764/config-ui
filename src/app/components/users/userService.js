'use strict';

angular.module('liveopsConfigPanel')
.factory('UserService', ['$resource', 'apiHostname', 'Session', function ($resource, apiHostname, Session) {
  return $resource('http://' + apiHostname + '/v1/users/:id', {}, {
    //API response is always an object, but Resource expects an array in response to query(). This config overrides.
    query: { method: 'GET', isArray: false },
    update: { method: 'PUT',
      transformRequest: function (data, headers){
        data.updatedBy = Session.id;
        return JSON.stringify(data);
      }
    },
    save: { method: "POST",
      transformRequest: function (data, headers) {
        data.createdBy = Session.id;
        return JSON.stringify(data);
      }
    }
  });
}]);

