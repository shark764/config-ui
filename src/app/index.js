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
  .run(['queryCache', '$rootScope','$state', '$animate', 'Branding', 'Session', function(queryCache, $rootScope, $state, $animate, Branding, Session) {
    $rootScope.$on('$stateChangeSuccess', function() {
      queryCache.removeAll();
      $rootScope.title = $state.current.title + ' | CxEngage';
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

    var defaultUrl = 'cxengage.net';
    // --- test data --------------------------------------
    var currentUrl = 'mitel.cxengage.net';
    var mockBrandingData = {
      active: true,
      favicon: '23f10080-faaa-11e6-b856-36051d50f3bf/36f8f370-1b09-11e7-9873-1b92cd79a0c3.png',
      logo: '23f10080-faaa-11e6-b856-36051d50f3bf/36ac3300-1b09-11e7-9873-1b92cd79a0c3.png',
      styles: {
        accentColor: '#2610CE',
        accentHoverColor: '#FFD5D5',
        navbar: '#FA1986',
        navbarText: '#981CBD',
        primaryColor: '#CC0A7E'
      },
      tenantId: '23f10080-faaa-11e6-b856-36051d50f3bf'
    };
    // ----------------------------------------------------
    if (currentUrl === defaultUrl && typeof Session.tenant === 'object' && typeof Session.user === 'object') {
      // --- Initialize Tenant Branding ---
      Branding.get({
        tenantId: Session.tenant.tenantId
      }, function(responce){
        if (responce.active) {
          Branding.apply(responce);
        }
      }, function(error){
        Branding.apply();
        if (error.status !== 404 || error.status !== 401) {
          console.log('Branding Styles Error:', error);
        }
      });
    } else {
      Branding.apply(mockBrandingData);
    }

  }]);
