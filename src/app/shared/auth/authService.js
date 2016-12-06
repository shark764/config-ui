'use strict';

angular.module('liveopsConfigPanel')
  .service('AuthService', ['$http', '$q', 'Session', 'apiHostname', 'User', '$state', 'Token',
    function ($http, $q, Session, apiHostname, User, $state, Token) {
      var self = this;

      this.generateToken = function (username, password, TokenService) {
        var token = new TokenService({
          username: username,
          password: password
        });

        return token.save().then(function (response) {
          return response;
        });
      };

      this.login = function (username, password) {
        Session.token = null; //Destroy any previous token so that the AuthInterceptor doesn't trigger

        var newToken = self.generateToken(username, password, Token);

        return $q.when(newToken)
        .then(function (tokenVal) {
          var request = self.fetchUserInfo(tokenVal.token);

          return request.then(function (response) {
            var user = new User({
              id: response.data.result.userId,
              email: response.data.result.username,
              firstName: response.data.result.firstName,
              lastName: response.data.result.lastName
            });

            var tenants = response.data.result.tenants;
            var platformPermissions = response.data.result.platformPermissions;

            Session.set(user, tenants, tokenVal.token, platformPermissions);
            return response;
          }, function (response) {
            return $q.reject(response);
          });
        });

      };

      this.refreshTenants = function () {
        return self.fetchUserInfo(Session.token).then(function (response) {
          Session.setTenants(response.data.result.tenants);
        });
      };

      this.logout = function () {
        Session.destroy();
        $state.transitionTo('login');
      };

      this.fetchUserInfo = function (token) {
        return $http({
          method: 'POST',
          url: apiHostname + '/v1/login',
          headers: {
            Authorization: 'Token ' + token
          }
        });
      };
    }
  ]);
