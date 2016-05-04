'use strict';

angular.module('liveopsConfigPanel')
  .service('ResetPassword', ['$http', 'apiHostname', function($http, apiHostname) {
    var service = {};

    service.initiateReset = function(userId) {
      return $http({
        method: 'PUT',
        url: apiHostname + '/v1/users/' + userId,
        data: {
          "resetPassword": true
        }
      });
    };

    service.setNewPassword = function(userId, newPass) {
      return $http({
        method: 'PUT',
        url: apiHostname + '/v1/users/' + userId,
        data: {
          "password": newPass
        }
      });
    };

    return service;
  }]);
