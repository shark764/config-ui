'use strict';

angular.module('liveopsConfigPanel', [
    'liveopsConfigPanel.config',
    'liveopsConfigPanel.shared',
    'liveopsConfigPanel.permissions',
    'liveOps.flowDesigner',
    'ui.router',
    'ngResource',
    'pascalprecht.translate',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'toastr',
    'ngLodash',
    'teljs',
    'realtime-dashboards',
    'moment-picker',
    'ngFileUpload',
    'dndLists',
    'angular-momentjs'
  ])
  .config(['$translateProvider', 'toastrConfig',
    function($translateProvider, toastrConfig) {
      angular.extend(toastrConfig, {
        closeButton: true,
        timeout: 10000,
        maxOpened: 3,
        positionClass: 'toast-top-right',
        preventOpenDuplicates: true,
        newestOnTop: true,
      });

      $translateProvider
        .useSanitizeValueStrategy('escaped')
        .useLocalStorage()
        .preferredLanguage('en');
    }
  ])
  .run(['queryCache', '$rootScope', function(queryCache, $rootScope) {
    $rootScope.$on('$stateChangeSuccess', function() {
      queryCache.removeAll();
    });
    $rootScope.$on('$stateChangeError', function() {
      console.error('State change error!');
    });
    $rootScope.$on('$stateNotFound', function() {
      console.error('State not found!');
    });
  }]);
