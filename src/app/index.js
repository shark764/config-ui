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

    Branding.get({
      tenantId: Session.tenant.tenantId
    }, function(responce){
      if (responce.active) {
        $rootScope.branding = responce;
      }
    }, function(error){
      $rootScope.brandingForm = {};
      if (error.status !== 404) {
        console.log('Branding Styles Error:', error);
      }
    });

    // Testing Only ----------------------------------

    // var testData = {
    //   'formColors': {
    //     'navbar': '#ABFFFF'
    //   },
    //   'navbar': {
    //     'background-color': '#ABFFFF'
    //   }
    // };
    //
    // Branding.update({
    //   tenantId: Session.tenant.tenantId,
    //   styles: JSON.stringify(testData)
    // }, function(responce){
    //   if (responce.tenantId === Session.tenant.tenantId) {
    //     $rootScope.branding = responce;
    //   }
    // }, function(errors){
    //   console.log(errors);
    // });

    // Testing data only ----------------------------

    // $rootScope.branding = {
    //   'logo': 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwjSxcrji__SAhXpy4MKHfUMBu4QjRwIBw&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AGoogle_2015_logo.svg&psig=AFQjCNEILna0mm_0cKmaO5MayBKnl1Pfgg&ust=1490992968226623',
    //   'updated': '2016-09-15T16:59:26Z',
    //   'favicon': 'http://www.google.com/s2/favicons?domain_url=http%3A%2F%2Fwww.google.de%2F',
    //   'updatedBy': '939d4610-656c-11e6-b1b9-ca81484488df',
    //   'active': true,
    //   'styles': {
    //     'navbar': {
    //       'background-color': '#F84545'
    //     },
    //     'navbarText': '#0739FF',
    //     'window': '#1EDA79',
    //     'windowText': '#660DDA'
    //   },
    //   'tenantId': '23f10080-faaa-11e6-b856-36051d50f3bf'
    // };

    // ----------------------------------------------
  }]);
