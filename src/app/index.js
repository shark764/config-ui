'use strict';

angular.module('liveopsConfigPanel', ['ngRoute', 'ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'app/components/main/main.html',
      controller: 'MainController'
    })
    .when('/users', {
      templateUrl: 'app/components/users/userList.html',
      controller: 'UserListController'
    })
    .otherwise('/');
  })
;
