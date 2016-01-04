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
    '720kb.datepicker',
    'jkuri.timepicker',
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

  }]);
