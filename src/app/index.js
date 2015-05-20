'use strict';

angular.module('liveopsConfigPanel', ['ngResource', 'ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('users', {
        url: '/users',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('flow', {
        url: '/flow',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('campaigns', {
        url: '/campaigns',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('reporting', {
        url: '/reporting',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('configuration', {
        url: '/configuration',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      }) ;

    $urlRouterProvider.otherwise('/');
  })
;
