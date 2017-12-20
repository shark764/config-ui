'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthInterceptor', ['$q', 'Session', 'apiHostname', '$injector',
    function($q, Session, apiHostname, $injector) {
      /*global localStorage: false */
      var Interceptor = function() {
        this.request = function(request) {
          if (request.url.indexOf(apiHostname) >= 0 && Session.token) {
            if (Session.token && Session.token.indexOf('Token') >= 0) {
              //Don't prepend Token if we're using an API session token E.g. from an invite
              request.headers.Authorization = Session.token;
            } else {
              request.headers.Authorization = 'Token ' + Session.token;
            }
          }

          return request;
        };

        this.responseError = function(response) {
          $injector.invoke(function ($state, $stateParams, $location, $document, AuthService, jwtHelper) {
            // upon a 401 (Unauthorized) error, check to make see whether or not
            // the the token's expiration time is up

            if (
              localStorage.getItem('TOKEN-EXPIRATION-DEBUG') ||
              (response.status === 401 &&
              jwtHelper.isTokenExpired(Session.token))
            ) {
              // ...and since the token expiration time has passed,
              // go back to the login screen...
              AuthService.setResumeSession(true);
              $state.go('login', {
                messageKey: 'user.details.login.token.expired',
                sso: Session.isSso ? 'isSso' : null
              })
              .then(function () {
                // ...and now get rid of any modal windows as well as
                // the "token expired" toast alert so that it doesn't
                // show up if user refreshes the login page
                $document.find('modal').remove();
                $stateParams.messageKey = null;
                $location.search('messageKey', null);
              });
            }
          });

          if (Session.token && Session.token.indexOf('Token') >= 0 && response.status === 401 && response.config.url !== apiHostname + '/v1/tenants/null/users') {
            //If an invite token is invalid, remove the token so the invalid auth header isn't used again
            Session.setToken(null);
          }

          return $q.reject(response);
        };
      };

      return new Interceptor();
    }
  ])
  .config(function($httpProvider) {
    // queue the interceptor
    $httpProvider.interceptors.push('AuthInterceptor');
  });
