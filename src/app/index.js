'use strict';

angular.module('liveopsConfigPanel', ['ui.router', 'ngResource', 'liveopsConfigPanel.config', 'pascalprecht.translate', 'ngCookies', 'ngMessages', 'ngSanitize', 'toastr', 'ngLodash'])
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
        controller: 'ErrorController',
        isPublic: true
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
      .state('content.configuration.integrations', {
        url: '/integrations?id',
        templateUrl: 'app/components/configuration/integrations/integrations.html',
        controller: 'IntegrationsController',
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
      .state('content.designer.editor', {
        url: '/editor/:flowId/:versionId?v=:version',
        templateUrl: 'app/components/designer/designer/designerPage.html',
        controller: 'DesignerPageController',
        reloadOnSearch: false,
        resolve: {
          flow: ['$stateParams', 'Session', 'Flow', '$q', function($stateParams, Session, Flow, $q) {
            var deferred = $q.defer();
            var flow;

            Flow.get({
              tenantId: Session.tenant.tenantId,
              id: $stateParams.flowId
            }, function(data) {
              flow = data;
              deferred.resolve(flow);
            });

            return deferred.promise;
          }],
          version: ['$stateParams', 'FlowVersion', 'Session', '$q', function($stateParams, FlowVersion, Session, $q) {
            var deferred = $q.defer();
            var version;

            FlowVersion.get({
              flowId: $stateParams.flowId,
              version: $stateParams.versionId,
              tenantId: Session.tenant.tenantId
            }, function(data) {
              version = data;
              version.v = $stateParams.v;
              deferred.resolve(version);
            });

            return deferred.promise;
          }]
        }
      })
      .state('content.designer.subflowEditor', {
        url: '/editor/:flowId/:versionId?v=:version',
        templateUrl: 'app/components/designer/designer/designerPage.html',
        controller: 'DesignerPageController',
        reloadOnSearch: false,
        resolve: {
          subflow: ['$stateParams', 'Session', 'Flow', '$q', function($stateParams, Session, Flow, $q) {
            var deferred = $q.defer();
            return deferred.promise;
          }]
        }
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