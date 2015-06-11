'use strict';

angular.module('liveopsConfigPanel', ['ui.router', 'ngResource', 'liveopsConfigPanel.config', 'pascalprecht.translate', 'ngCookies', 'ngMessages', 'ngSanitize'])
  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $urlRouterProvider.otherwise('/management/users');

    $stateProvider
      .state('management', {
        abstract: true,
        url: '/management',
        templateUrl: 'app/components/management/management.html',
        controller: 'ManagementController'
      })
      .state('management.users', {
        url: '/users',
        templateUrl: 'app/components/management/users/users.html',
        controller: 'UsersController',
        reloadOnSearch: false
      })
      .state('management.skills', {
        url: '/skills',
        templateUrl: 'app/components/management/skills/skills.html',
        controller: 'SkillsController',
        reloadOnSearch: false
      })
      .state('management.groups', {
        url: '/groups',
        templateUrl: 'app/components/management/groups/groups.html',
        controller: 'GroupsController',
        reloadOnSearch: false
      })
      .state('configuration', {
        abstract: true,
        url: '/configuration',
        templateUrl: 'app/components/configuration/configuration.html',
        controller: 'ConfigurationController'
      })
      .state('configuration.tenants', {
        url: '/tenants',
        templateUrl: 'app/components/configuration/tenants/tenants.html',
        controller: 'TenantsController',
        reloadOnSearch: false
      })
      .state('designer', {
        abstract: true,
        url: '/designer',
        templateUrl: 'app/components/designer/designer.html',
        controller: 'DesignerController'
      })
      .state('designer.flows', {
        url: '/flows',
        templateUrl: 'app/components/designer/flows/flows.html',
        controller: 'FlowsController',
        reloadOnSearch: false
      })
      .state('designer.queues', {
        url: '/queues',
        templateUrl: 'app/components/designer/queues/queues.html',
        controller: 'QueueController'
      })
      .state('designer.media', {
        url: '/media',
        templateUrl: 'app/components/designer/media/media.html',
        controller: 'MediaController',
        reloadOnSearch: false,
        secure: true
      })
      .state('versions', {
        url: '/versions',
        templateUrl: 'app/components/designer/flows/versions/versions.html',
        controller: 'VersionsController',
        reloadOnSearch: false
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginController',
        isPublic: true
      })
      .state('userprofile', {
        url: '/userprofile',
        templateUrl: 'app/components/userProfile/userProfile.html',
        controller: 'UserProfileController',
        secure: true
      })
      .state('invites', {
        url: '/invites',
        templateUrl: 'app/components/invites/invites.html',
        controller: 'InvitesController',
        secure: true
      });

    $translateProvider
      .useSanitizeValueStrategy('escaped')
      .useLocalStorage()
      .preferredLanguage('en');
  }]);