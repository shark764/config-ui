'use strict';

angular.module('liveopsConfigPanel', ['ui.router', 'ngResource', 'liveopsConfigPanel.config', 'pascalprecht.translate', 'ngCookies', 'ngMessages', 'ngSanitize', 'toastr'])
  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', 'toastrConfig', function ($stateProvider, $urlRouterProvider, $translateProvider, toastrConfig) {
    $urlRouterProvider.otherwise('/management/users');

    $stateProvider
      .state('content', {
        abstract: true,
        templateUrl: 'app/components/content/content.html',
        controller: 'ContentController'
      })
      .state('error', {
        templateUrl: 'app/components/error/error.html',
        controller: 'ErrorController'
      })
      .state('content.management', {
        abstract: true,
        url: '/management',
        templateUrl: 'app/components/management/management.html',
        controller: 'ManagementController'
      })
      .state('content.management.users', {
        url: '/users?id',
        templateUrl: 'app/components/management/users/users.html',
        controller: 'UsersController',
        reloadOnSearch: false
      })
      .state('content.management.skills', {
        url: '/skills?id',
        templateUrl: 'app/components/management/skills/skills.html',
        controller: 'SkillsController',
        reloadOnSearch: false
      })
      .state('content.management.groups', {
        url: '/groups?id',
        templateUrl: 'app/components/management/groups/groups.html',
        controller: 'GroupsController',
        reloadOnSearch: false
      })
      .state('content.configuration', {
        abstract: true,
        url: '/configuration',
        templateUrl: 'app/components/configuration/configuration.html',
        controller: 'ConfigurationController'
      })
      .state('content.configuration.tenants', {
        url: '/tenants?id',
        templateUrl: 'app/components/configuration/tenants/tenants.html',
        controller: 'TenantsController',
        reloadOnSearch: false
      })
      .state('content.designer', {
        abstract: true,
        url: '/designer',
        templateUrl: 'app/components/designer/designer.html',
        controller: 'DesignerController'
      })
      .state('content.designer.flows', {
        url: '/flows?id',
        templateUrl: 'app/components/designer/flows/flows.html',
        controller: 'FlowsController',
        reloadOnSearch: false
      })
      .state('content.designer.queues', {
        url: '/queues?id',
        templateUrl: 'app/components/designer/queues/queues.html',
        controller: 'QueueController',
        reloadOnSearch: false
      })

      .state('content.designer.media', {
        url: '/media?id',
        templateUrl: 'app/components/designer/media/media.html',
        controller: 'MediaController',
        reloadOnSearch: false
      })
      .state('content.designer.versions', {
        url: '/versions?id',
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
      .state('content.userprofile', {
        url: '/userprofile',
        templateUrl: 'app/components/userProfile/userProfile.html',
        controller: 'UserProfileController',
        secure: true
      })
      .state('content.invites', {
        url: '/invites?id',
        templateUrl: 'app/components/invites/invites.html',
        controller: 'InvitesController',
        secure: true
      });

    angular.extend(toastrConfig, {
      closeButton: true,
      timeout: 10000,
      maxOpened: 1,
      positionClass: 'toast-top-right',
      preventOpenDuplicates: true,
      newestOnTop: true,
    });

    $translateProvider
      .useSanitizeValueStrategy('escaped')
      .useLocalStorage()
      .preferredLanguage('en');

  }]);