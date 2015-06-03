'use strict';

angular.module('liveopsConfigPanel', ['ngRoute', 'ngResource', 'liveopsConfigPanel.config', 'pascalprecht.translate', 'ngCookies'])
  .config(['$routeProvider', '$translateProvider', function ($routeProvider, $translateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/users/users.html',
        controller: 'UsersController',
        reloadOnSearch: false,
        secure: true
      })
      .when('/tenants', {
        templateUrl: 'app/components/tenants/tenants.html',
        controller: 'TenantsController',
        reloadOnSearch: false,
        secure: true
      })
      .when('/flows', {
        templateUrl: 'app/components/flows/flows.html',
        controller: 'FlowsController',
        reloadOnSearch: false,
        secure: true
      })
      .when('/login', {
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginController'
      })
      .otherwise('/');

    $translateProvider
      .useSanitizeValueStrategy('escaped')
      .useLocalStorage()
      .preferredLanguage('en');
  }]);