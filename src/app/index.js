'use strict';

angular.module('liveopsConfigPanel', [
    'liveopsConfigPanel.config',
    'liveopsConfigPanel.shared',
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
    'ngFileUpload',
    'dndLists'
  ])
  .config(['$translateProvider', 'toastrConfig',
  function ($translateProvider, toastrConfig) {
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
  }]);