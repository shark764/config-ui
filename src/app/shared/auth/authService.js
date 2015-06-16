'use strict';

/* global  window: false */

angular.module('liveopsConfigPanel')
  .service('AuthService', ['$resource', '$http', '$q', 'Session', 'apiHostname',
    function ($resource, $http, $q, Session, apiHostname) {

      var self = this;

      // localStorage should not be used to store passwords in production
      // this is a temporary solution until Tao gets back to me on the ability to get
      // a token back from the API to store instead.

      // if this is NOT possible, we will need to setup a slim backend server to manage
      // session information using redis or memcache

      // this will suffice in beta however.
      this.login = function (username, password) {
        var token = this.generateToken(username, password);
        var request = this.fetchUserInfo(token);

        return request.then(function(response) {

          var user = response.data.result.user;
          var tenants = response.data.result.tenants;
          Session.set(user, tenants, token);

          return response;
        }, function(response) {
          return response;
        });
      };

      this.refreshTenants = function () {
        self.fetchUserInfo(Session.token).then( function (response ) {
          Session.setTenants(response.data.result.tenants);
        });
      };

      this.logout = function () {
        Session.destroy();
      };

      this.fetchUserInfo = function (token) {
        return $http.post(apiHostname + '/v1/login', {}, {
          headers: {
            Authorization: 'Basic ' + token
          }
        });
      };

      this.generateToken = function (username, password) {
        return window.btoa(username + ':' + password);
      };
    }
  ]);
