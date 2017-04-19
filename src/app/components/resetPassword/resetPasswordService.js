'use strict';

angular.module('liveopsConfigPanel')
  .service('ResetPassword', ['$http', 'apiHostname', '$location', function($http, apiHostname, $location) {
    var service = {};

    service.initiateReset = function(userId) {
      return $http({
        method: 'PUT',
        url: apiHostname + '/v1/users/' + userId,
        data: {
          'resetPassword': true
        }
      });
    };

    service.setNewPassword = function(userId, newPass) {
      return $http({
        method: 'PUT',
        headers: {
          'Authorization': 'Token ' + $location.search().token
        },
        url: apiHostname + '/v1/users/' + userId,
        data: {
          'password': newPass
        }
      });
    };

    service.userInitiateReset = function(email) {
      return $http({
        method: 'PUT',
        url: apiHostname + '/v1/request-password-reset',
        data: {
          'email': email
        }
      });
    };

    return service;
  }]);
