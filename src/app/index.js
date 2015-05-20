'use strict';

angular.module('liveopsConfigPanel', ['ngResource', 'ui.router', 'ngLodash'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('users', {
        url: '/',
        templateUrl: 'app/components/main/main.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginController'
      }) ;

    $urlRouterProvider.otherwise('/');
  })
;
