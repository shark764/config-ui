'use strict';
angular.module('liveopsConfigPanel')
  .service('AuthService', ['$http', '$q', '$translate', 'Session', 'apiHostname', 'User', '$state', '$location', 'Token', 'CxEngageConfig', '$stateParams', '$timeout',
    function ($http, $q, $translate, Session, apiHostname, User, $state, $location, Token, CxEngageConfig, $stateParams, $timeout) {
      /* globals localStorage */
      var self = this;
      var loginFunctionFromController;
      var errorMessageFunctionFromController;
      var subId;
      var resuming = false;
      var loggingOut = false;
      var tenantReAuth = false;
      var cxEngageEnabled = typeof CxEngage === 'object' &&
      angular.isFunction(CxEngage.initialize);

      // Initializing the SDK to allow for SSO
      if (cxEngageEnabled) {
        CxEngage.initialize(CxEngageConfig);

        if (Session.token && Session.user) {
          CxEngage.session.setToken(Session.token);
          CxEngage.session.setUserIdentity(Session.user.id);
          CxEngage.session.setActiveTenant({ tenantId: Session.tenant.tenantId, noSession: true });
        }
      }

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
          Session.setIsSso(true);
        } else {
          newToken = self.generateToken(username, password, Token, alternateToken);
          Session.setIsSso(false);
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

            if (cxEngageEnabled) {
              CxEngage.session.setToken(tokenVal);
              CxEngage.session.setUserIdentity(user.id);
            }

            var tenants = response.data.result.tenants;
            var platformPermissions = response.data.result.platformPermissions;

            Session.set(user, tenants, tokenVal, platformPermissions);
            return response;
          }, function(response) {
            return $q.reject(response);
          });
        });
      };

      this.generateAuthParams = function (urlParams) {
        var urlParamsToLowerCase =  _.mapKeys(urlParams, function (v, k) {
          return k.toLowerCase();
        });
        var authInfoParams = {};
        if (urlParamsToLowerCase.tenantid) {
          authInfoParams.tenantId = urlParamsToLowerCase.tenantid;
          if (urlParamsToLowerCase.idp) {
            authInfoParams.idp = urlParamsToLowerCase.idp;
          }
        } else if (urlParamsToLowerCase.username) {
          authInfoParams.username = urlParamsToLowerCase.username;
        }

        return authInfoParams;
      };

      // for SSO logins which depend on the CxEngage Javascript SDK
      this.idpLogin = function (authInfoParams) {
        if (!cxEngageEnabled) {
          errorMessageFunctionFromController($translate.instant('login.unexpected.error'));
          return;
        }

        // We have to open this window in the onClick handler to prevent it from being a blocked popup
        // SDK proceeds to use this window with the name "cxengageSsoWindow"
        var ssoWindow = window.open(
          '',
          'cxengageSsoWindow',
          'width=500,height=500'
        );

        // now polling for/subscribing to the auth Token
        CxEngage.authentication.getAuthInfo(
          authInfoParams,
          function (error) {
            if (!error) {
              CxEngage.authentication.popIdentityPage();
            } else {
              ssoWindow.close();
              if (subId) {
                CxEngage.unsubscribe(subId);
              }

              var urlParams = $location.search();
              if (urlParams.tenantid) {
                tenantReAuth = true;
                $state.go('login', {
                  sso: false
                });
              }
            }
        });

        if (CxEngage.subscribe) {
          subId = CxEngage.subscribe(
            'cxengage/authentication',
            function (authError, authTopic, authResponse) {
              if (authError && errorMessageFunctionFromController && !tenantReAuth) {
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
        var savedSsoMode = Session.isSso;
        resuming = false;
        // this sets a flag which makes sure not to destroy the Session
        // properties yet and cause JS errors upon return to the login page
        self.setLogoutFlag();
        Session.setIsSso(savedSsoMode);
        self.setResumeSession(false);
        localStorage.setItem('IS_SSO_OVERRIDE', Session.isSso);
        $state.go('login', {
          sso: savedSsoMode ? 'true' : null
        });
        if (cxEngageEnabled) {
          CxEngage.session.setToken(); // Sets their token to null
        }
        $stateParams.sso = savedSsoMode ? 'true' : null;
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

      this.setResumeSession = function (resume) {
        resuming = resume;
      };

      this.getResumeSession = function () {
        return resuming;
      };

      // this is being used to set the flag that tells the login page that
      // that we are logging out and need to destroy the Session object
      this.setLogoutFlag = function () {
        loggingOut = true;
      };

      // destroy the Session object if this is true!
      this.getLogoutFlag = function () {
        return loggingOut;
      };

      // determines which version of the login page to display, as well
      // as making sure that sso logins keep "sso" in the query string
      // after logging out
      this.setSsoMode = function(toState) {
        if (toState === 'login') {
          // If "sso=true" is in the URL
          if ($location.absUrl().indexOf('sso=true') !== -1) {
            Session.setIsSso(true);
          // if there is NOT "sso=true" in the URL...
          } else {
            // if for whatever reason (ie: a page refresh), we cannot rely on the url to
            // properly determine the isSso value, then we can refer to a value stored in
            // local storage to force the isSso value,
            // unless otherwise specified in the URL with "sso=false"
            if (localStorage.getItem('IS_SSO_OVERRIDE') == 'true' && $location.absUrl().indexOf('sso=false') === -1) { // jshint ignore:line
              Session.setIsSso(true);
              $location.search('sso', 'true');
              // ...if the "isSso" value in the Session was set to true, set the session's
              // isSso value to null and remove the sso paramter from the url
            } else if (Session.isSso == 'true') { // jshint ignore:line
              $location.search('sso', null);
              Session.setIsSso(false);
            } else {
              Session.setIsSso(false);
            }

            $timeout(function () {
              // clear out this value so it doesn't incorrectly override the isSso value
              localStorage.removeItem('IS_SSO_OVERRIDE');
            });
          }
        }
      };
    }
  ]);
