'use strict';

angular.module('liveopsConfigPanel', ['ngRoute', 'ngResource', 'liveopsConfigPanel.config'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'app/components/main/main.html',
      controller: 'MainController'
    })
    .when('/users', {
      templateUrl: 'app/components/users/userList/userList.html',
      controller: 'UserListController'
    })
    .otherwise('/');
  })
;
