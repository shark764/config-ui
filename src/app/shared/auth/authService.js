'use strict';

/* global  window: false */

angular.module('liveopsConfigPanel')
  .service('AuthService', ['$resource', 'Session', 'UserService', 'apiHostname',
    function ($resource, Session, UserService, apiHostname) {
      // localStorage should not be used to store passwords in production
      // this is a temporary solution until Tao gets back to me on the ability to get
      // a token back from the API to store instead.

      // if this is NOT possible, we will need to setup a slim backend server to manage
      // session information using redis or memcache

      // this will suffice in beta however.
      this.login = function (username, password) {
        var token = this.generateToken(username, password);

        var resource = $resource(apiHostname + '/v1/users', null, {
          query: {
            method: 'GET',
            headers: {
              Authorization: 'Basic ' + token
            }
          }
        });

        var promise = resource.query().$promise;
        promise = promise.then(function (response) {
          angular.forEach(response.result, function (user) {
            if (user.email === username) {
              response = {
                token: token,
                user: user
              };
            }
          });

          if (!response.user) {
            throw new UserNotFoundException();
          }

          return response;
        })

        return promise;
      };

      this.logout = function () {
        Session.destroy();
      };

      this.generateToken = function (username, password) {
        return window.btoa(username + ':' + password);
      };
    }
  ]);

function UserNotFoundException() {
  this.name = 'UserNotFoundException';
  this.message = 'Username was not found under /v1/users';
}
UserNotFoundException.prototype = new Error();
UserNotFoundException.prototype.constructor = UserNotFoundException;