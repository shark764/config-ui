'use strict';

angular.module('liveopsConfigPanel', ['ngRoute', 'ngResource', 'liveopsConfigPanel.config'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'app/components/users/users.html',
      controller: 'UsersController',
      secure: true
    })
    .when('/login', {
      templateUrl: 'app/components/login/login.html',
      controller: 'LoginController'
    })
    .otherwise('/');
  })
;
