'use strict';

angular.module('liveopsConfigPanel', ['ngRoute', 'ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl'
    })
    .when('/users', {
      templateUrl: 'app/users/userList.html',
      controller: 'UserListCtrl'
    })
    .otherwise('/');
  })
;
