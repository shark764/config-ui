'use strict';

angular.module('liveopsConfigPanel')
  .factory('ErrorInterceptor', ['$rootScope', '$q', '$injector', 'Alert', 'apiHostname', '$translate',
    function ($rootScope, $q, $injector, Alert, apiHostname, $translate) {

      return {
       'responseError': function(rejection) {

          //Only issue toasts if the user is logged in; we get no response from the API or a 500 and greater; and if the call was to the API endpoint
          if((rejection.status === 0 || rejection.status >= 500) && rejection.config.url.indexOf(apiHostname) > -1){
            Alert.error($translate.instant('api.error'));
          }

          return $q.reject(rejection);
        }
      };
    }

  ])
  .config(function ($httpProvider) {
    // queue the interceptor
    $httpProvider.interceptors.push('ErrorInterceptor');
  });
