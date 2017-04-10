'use strict';

angular.module('liveopsConfigPanel', [
    'liveopsConfigPanel.config',
    'liveopsConfigPanel.shared',
    'liveopsConfigPanel.permissions',
    'liveopsConfigPanel.flags',
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
    'momentPicker',
    'ngFileUpload',
    'dndLists',
    'angular-momentjs',
    'agent-toolbar',
    'ui.sortable',
    'ui.codemirror',
    'ngAnimate',
    'color.picker'
  ])
  .config(['$translateProvider', 'toastrConfig', '$qProvider', '$locationProvider',
    function($translateProvider, toastrConfig, qProvider, $locationProvider) {
      angular.extend(toastrConfig, {
        closeButton: true,
        timeout: 10000,
        maxOpened: 3,
        positionClass: 'toast-top-right',
        preventOpenDuplicates: true,
        newestOnTop: true
      });

      $translateProvider
        .useSanitizeValueStrategy('escaped')
        .useLocalStorage()
        .preferredLanguage('en');

      qProvider.errorOnUnhandledRejections(false);

      $locationProvider.hashPrefix('');
    }
  ])
  .run(['queryCache', '$rootScope', '$state', '$animate', 'Branding', '$location', function(queryCache, $rootScope, $state, $animate, Branding, $location) {

    // --- Mitel Temp Info ---
    var mitelUrl = 'mitel-config';

    var mockBrandingData = {
      active: true,
      favicon: '23f10080-faaa-11e6-b856-36051d50f3bf/caa3bd20-1bd2-11e7-b8ec-b883f2d63b7b.ico',
      logo: '23f10080-faaa-11e6-b856-36051d50f3bf/757eb280-1df5-11e7-b8ec-b883f2d63b7b.png',
      styles: {
        productName: 'Mitel',
        accentColor: '#FF7300',
        accentHoverColor: '#E3F3FF',
        navbar: '#15325F',
        navbarText: '#FFFFFF',
        primaryColor: '#00A1F4'
      }
    };

    $rootScope.$on('$stateChangeStart', function(e, toState) {
      if (toState.name === 'login' || toState.name === 'forgot-password') {
        if ($location.absUrl().indexOf(mitelUrl) !== -1) {
          Branding.apply(mockBrandingData);
        } else {
          Branding.apply({});
        }
      }
    });
    $rootScope.$on('$stateChangeSuccess', function() {
      queryCache.removeAll();
      $rootScope.title = $state.current.title + ' | ' + $rootScope.productName;
    });
    $rootScope.$on('$stateChangeError', function() {
      console.error('State change error!');
      console.log(arguments);
    });
    $rootScope.$on('$stateNotFound', function() {
      console.error('State not found!');
      console.log(arguments);
    });
    $animate.enabled(false);
  }]);
