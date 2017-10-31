'use strict';
angular.module('liveopsConfigPanel')
  .service('AuthService', ['$http', '$q', 'Session', 'apiHostname', 'User', '$state', '$location', 'Token', 'CxEngageConfig',
    function ($http, $q, Session, apiHostname, User, $state, $location, Token, CxEngageConfig) {
      /*globals CxEngage */
      var self = this;
      var loginFunctionFromController;

      // gets us the full functionality and dependencies
      // of the login controller, which we'll need when we're
      // triggering the entire login process w/out using the login UI
      this.getLoginFunction = function (loginFunction) {
        loginFunctionFromController = loginFunction;
      };

      this.generateToken = function (username, password, TokenService, alternateToken) {
        if (alternateToken) {
          return alternateToken;
        } else {
          var token = new TokenService({
            username: username,
            password: password
          });

          return token.save().then(function (response) {
            return response.token;
          });
        }
      };

      this.login = function(username, password, alternateToken) {
        var newToken;
        Session.token = null; //Destroy any previous token so that the AuthInterceptor doesn't trigger

        if (alternateToken) {
          newToken = alternateToken;
        } else {
          newToken = self.generateToken(username, password, Token, alternateToken);
        }

        return $q.when(newToken).then(function(tokenVal) {
          // the default CxEngage token comes back as an object, while
          // tokens from other IDP's may just come back as a string
          if (newToken.hasOwnProperty('token')) {
            tokenVal = tokenVal.token;
          }

          var request = self.fetchUserInfo(tokenVal);

          return request.then(function(response) {
            var user = new User({
              id: response.data.result.userId,
              email: response.data.result.username,
              firstName: response.data.result.firstName,
              lastName: response.data.result.lastName
            });

            var tenants = response.data.result.tenants;
            var platformPermissions = response.data.result.platformPermissions;

            Session.set(user, tenants, tokenVal, platformPermissions);
            return response;
          }, function(response) {
            return $q.reject(response);
          });
        });
      };

      // for SSO logins which depend on the CxEngage Javascript SDK
      this.idpLogin = function (identifier) {
        var urlParams = $location.search();
        var authInfoParams = {};
        switch (identifier.toLowerCase()) {
          case 'username':
            authInfoParams = {
              username: urlParams.username
            };
            break;
          case 'tenantid':
            authInfoParams = {
              tenantId: urlParams.tenantId
            };
            break;
        }

        // First, initializing the SDK using a constant from env.js
        CxEngage.initialize(CxEngageConfig);

        // now polling for/subscribing to the auth Token
        CxEngage.authentication.getAuthInfo(
          authInfoParams,
          function () {
            CxEngage.authentication.popIdentityPage();
            if (CxEngage.subscribe) {
              var subId = CxEngage.subscribe(
                'cxengage/authentication',
                function (authError, authTopic, authResponse) {
                  if (authError) {
                    // TODO: make something happen here
                  } else {
                    switch (authTopic) {
                      case 'cxengage/authentication/cognito-auth-response': {
                        if (authResponse) {
                          CxEngage.unsubscribe(subId);
                          loginFunctionFromController(authResponse);
                        }
                        break;
                      }
                      default: {
                        // Do Nothing
                        break;
                      }
                    }
                  }
                }
              );
            }
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
