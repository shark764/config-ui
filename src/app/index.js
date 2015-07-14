'use strict';

angular.module('liveopsConfigPanel', ['ui.router', 'ngResource', 'liveopsConfigPanel.config', 'pascalprecht.translate', 'ngCookies', 'ngMessages', 'ngSanitize', 'toastr', 'ngLodash', 'teljs'])
  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', 'toastrConfig', function($stateProvider, $urlRouterProvider, $translateProvider, toastrConfig) {
    $urlRouterProvider.otherwise('/management/users');

    $stateProvider
      .state('content', {
        abstract: true,
        templateUrl: 'app/components/content/content.html',
        controller: 'ContentController',
        resolve: {
          regions: ['Session', 'Region', function(Session, Region) {
            return Region.query({}, function(result) {
              Session.activeRegionId = result[0].id;
            }).$promise;
          }],

          login: ['Session', 'Login', '$state', function(Session, Login, $state) {
            return Login.save(function(result) {
              Session.tenants = result.tenants;
            }, function() {
              $state.go('login');
            }).$promise;
          }],
        }
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
      .state('content.flows', {
        abstract: true,
        url: '/flows',
        templateUrl: 'app/components/flows/flows.html',
        controller: 'FlowsController'
      })
      .state('content.flows.flowManagement', {
        url: '/management?id',
        templateUrl: 'app/components/flows/flowManagement/flowManagement.html',
        controller: 'FlowManagementController',
        reloadOnSearch: false
      })
      .state('content.flows.queues', {
        url: '/queues?id',
        templateUrl: 'app/components/flows/queues/queues.html',
        controller: 'QueueController',
        reloadOnSearch: false
      })
      .state('content.flows.media', {
        url: '/media?id',
        templateUrl: 'app/components/flows/media/media.html',
        controller: 'MediaController',
        reloadOnSearch: false
      })
      .state('content.flows.media-collections', {
        url: '/media-collections',
        templateUrl: 'app/components/flows/media-collections/media-collections.html',
        controller: 'MediaCollectionController',
        reloadOnSearch: false
      })
      .state('content.flows.dispatchMappings', {
        url: '/dispatchMappings?id',
        templateUrl: 'app/components/flows/dispatchMappings/dispatchMappings.html',
        controller: 'DispatchMappingsController',
        reloadOnSearch: false
      })
      .state('content.flows.versions', {
        url: '/versions?id',
        templateUrl: 'app/components/flows/flowManagement/versions/versions.html',
        controller: 'VersionsController',
        reloadOnSearch: false
      })
      .state('content.flows.editor', {
        url: '/editor/:flowId/:versionId?v=:version',
        templateUrl: 'app/components/flows/flowDesigner/flowDesignerPage.html',
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
          }],
          media: ['Media', 'Session', function(Media, Session) {
            return Media.query({tenantId : Session.tenant.tenantId});
          }],
          queue: ['Queue', 'Session', function(Queue, Session) {
            return Queue.query({tenantId : Session.tenant.tenantId});
          }]
        }
      })
      .state('content.flows.subflowEditor', {
        url: '/subflow-editor/:subflowNotationId',
        templateUrl: 'app/components/flows/subflow/subflowDesignerPage.html',
        controller: 'SubflowDesignerPageController',
        reloadOnSearch: false,
        resolve: {
          subflow: ['$stateParams', '$state', '$timeout', 'SubflowCommunicationService', function($stateParams, $state, $timeout, SubflowCommunicationService) {
            if (SubflowCommunicationService.currentFlowContext === '') {
              $timeout(function() { $state.go('content.flows.flowManagement'); }, 5);
            }
            var subflow = SubflowCommunicationService.retrieve($stateParams.subflowNotationId);
            if (_.isUndefined(subflow)) {
              subflow = {
                id: $stateParams.subflowNotationId,
                graphJSON: '{"cells":[]}',
                parentName: SubflowCommunicationService.currentVersionContext.name,
                notationName: SubflowCommunicationService.currentFlowNotationName,
                parentVersionId: SubflowCommunicationService.currentVersionContext.version,
                parentFlowId: SubflowCommunicationService.currentVersionContext.flowId
              };
            }
            return subflow;
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
      })
      .state('content.reports', {
        url: '/reports',
        templateUrl: 'app/components/reports/reports.html',
        controller: 'ReportsController',
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
