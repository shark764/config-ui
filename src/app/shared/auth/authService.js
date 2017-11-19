'use strict';
angular.module('liveopsConfigPanel')
  .service('AuthService', ['$http', '$q', '$translate', 'Session', 'apiHostname', 'User', '$state', '$location', 'Token', 'CxEngageConfig',
    function ($http, $q, $translate, Session, apiHostname, User, $state, $location, Token, CxEngageConfig) {
      /*globals CxEngage */
      var self = this;
      var loginFunctionFromController;
      var errorMessageFunctionFromController;
      var subId;
      var isSso = false;
      var cxEngageEnabled = typeof CxEngage === 'object' &&
      angular.isFunction(CxEngage.initialize);

      // Initializing the SDK to allow for SSO
      if (cxEngageEnabled) {
        CxEngage.initialize(CxEngageConfig);
      }

      this.setSso = function (isSsoBool) {
        isSso = isSsoBool;
      };

      this.getSso = function () {
        return isSso;
      };



      // gets us the full functionality and dependencies
      // of the login controller, which we'll need when we're
      // triggering the entire login process w/out using the login UI
      this.getLoginFunction = function (loginFunction) {
        loginFunctionFromController = loginFunction;
      };

      // allows us to get an error message in any controller
      this.getErrorMessageFunction = function (errorMsgFunction) {
        errorMessageFunctionFromController = errorMsgFunction;
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
          $state.params.sso = true;
        } else {
          newToken = self.generateToken(username, password, Token, alternateToken);
          $state.params.sso = false;
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

      this.generateAuthParams = function (identifier) {
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

        return authInfoParams;
      };

      // for SSO logins which depend on the CxEngage Javascript SDK
      this.idpLogin = function (authInfoParams) {
        if (!cxEngageEnabled) {
          errorMessageFunctionFromController($translate.instant('login.unexpected.error'));
          return;
        }



        // now polling for/subscribing to the auth Token
        CxEngage.authentication.getAuthInfo(
          authInfoParams,
          function (error) {
            if (!error) {
              CxEngage.authentication.popIdentityPage();
            } else {
              if (subId) {
                CxEngage.unsubscribe(subId);
              }
            }
        });

        if (CxEngage.subscribe) {
          subId = CxEngage.subscribe(
            'cxengage/authentication',
            function (authError, authTopic, authResponse) {
              if (authError && errorMessageFunctionFromController) {
                errorMessageFunctionFromController($translate.instant('login.ssoError'));
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
      };

      this.refreshTenants = function () {
        return self.fetchUserInfo(Session.token).then(function (response) {
          Session.setTenants(response.data.result.tenants);
        });
      };

      this.logout = function () {
        Session.destroy();
        $state.transitionTo('login', {
          sso: $state.params.sso
        });
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

      // determines which version of the login page to display, as well
      // as making sure that sso logins keep "sso" in the query string
      // after logging out
      this.setSsoMode = function(toStateName, isSso, stateObj, locationObj) {
        if (toStateName === 'login') {
          stateObj.params.sso = isSso || $location.absUrl().indexOf('sso') !== -1;

          if (stateObj.params.sso) {
            locationObj.search('sso', 'isSso');
          } else {
            locationObj.search('sso', null);
          }
        }
      };
    }
  ]);
