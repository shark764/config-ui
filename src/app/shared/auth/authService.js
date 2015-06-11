'use strict';

/* global  window: false */

function UserNotFoundException() {
  this.name = 'UserNotFoundException';
  this.message = 'Username was not found under /v1/users';
}
UserNotFoundException.prototype = new Error();
UserNotFoundException.prototype.constructor = UserNotFoundException;

angular.module('liveopsConfigPanel')
  .service('AuthService', ['$resource', '$http', '$q', 'Session', 'apiHostname',
    function ($resource, $http, $q, Session, apiHostname) {
      // localStorage should not be used to store passwords in production
      // this is a temporary solution until Tao gets back to me on the ability to get
      // a token back from the API to store instead.

      // if this is NOT possible, we will need to setup a slim backend server to manage
      // session information using redis or memcache

      // this will suffice in beta however.
      this.login = function (username, password) {
        var token = this.generateToken(username, password);
        var request = $http.get(apiHostname + '/v1/users', {
          headers: {
            Authorization: 'Basic ' + token
          }
        });

        return request.then(function(response) {
          angular.forEach(response.data.result, function (user) {
            if (user.email === username) {
              response = {
                token: token,
                user: user
              };
            }
          });

          if (!response.user) {
            return $q.reject(new UserNotFoundException());
          }

          Session.set(response.user, response.token);

          return response;
        }, function(response) {
          return response;
        });
      };

      this.logout = function () {
        Session.destroyAll();
      };

      this.generateToken = function (username, password) {
        return window.btoa(username + ':' + password);
      };
    }
  ]);
