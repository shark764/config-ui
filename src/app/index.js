'use strict';

angular.module('liveopsConfigPanel', ['ngRoute', 'ngResource', 'ngLodash'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'app/components/users/userList/userList.html',
      controller: 'UserListController',
      secure: true
    })
    .when('/login', {
      templateUrl: 'app/components/login/login.html',
      controller: 'LoginController'
    })
    .otherwise('/users');
  })
;
