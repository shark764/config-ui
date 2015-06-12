'use strict';

angular.module('liveopsConfigPanel')
  .factory('ErrorInterceptor', ['$rootScope', '$q', '$injector', 'toastr', 'apiHostname', 'Session',
    function ($rootScope, $q, $injector, toastr, apiHostname, Session) {

      return {
       'responseError': function(rejection) {

          //Only issue toasts if the user is logged in; we get no response from the API or a 500 and greater; and if the call was to the API endpoint
          if(Session.isAuthenticated() && (rejection.status === 0 || rejection.status >= 500) && rejection.config.url.indexOf(apiHostname) > -1){
            toastr.error('The API could not be contacted. Please reload the page to try again. If this error persists, please contact your systems administrator');
          }

          return $q.reject(rejection);
        }
      }
    }

  ])
  .config(function ($httpProvider) {
    // queue the interceptor
    $httpProvider.interceptors.push('ErrorInterceptor');
  });
