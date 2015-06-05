'use strict';

angular.module('liveopsConfigPanel', ['ngRoute', 'ngResource', 'liveopsConfigPanel.config', 'pascalprecht.translate', 'ngCookies', 'ngMessages'])
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
      .when('/queues', {
        templateUrl: 'app/components/queues/queues.html',
        controller: 'QueueController',
        secure: true
      })
      .when('/userprofile', {
        templateUrl: 'app/components/userProfile/userProfile.html',
        controller: 'UserProfileController',
        secure: true
      })
      .when('/invites', {
        templateUrl: 'app/components/invites/invites.html',
        controller: 'InvitesController',
        secure: true
      })
      .when('/users', {
        templateUrl: 'app/components/users/users.html',
        controller: 'UsersController',
        reloadOnSearch: false,
        secure: true
      })
      .otherwise('/');

    $translateProvider
      .useSanitizeValueStrategy('escaped')
      .useLocalStorage()
      .preferredLanguage('en');
  }]);