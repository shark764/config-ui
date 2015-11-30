'use strict';

angular.module('liveopsConfigPanel', ['ui.router', 'ngResource', 'liveopsConfigPanel.config', 'pascalprecht.translate', 'ngCookies', 'ngMessages', 'ngSanitize', 'toastr', 'ngLodash', 'teljs', 'realtime-dashboards', 'ngFileUpload', 'dndLists', 'liveopsConfigPanel.shared', 'liveOps.flowDesigner'])
  .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', 'toastrConfig', function($stateProvider, $urlRouterProvider, $translateProvider, toastrConfig) {

    $urlRouterProvider.otherwise(function($injector){
      var Session = $injector.get('Session');
      if (Session.isAuthenticated()){
        return '/management/users';
      } else {
        return '/login';
      }
    });

    $stateProvider
      .state('content', {
        abstract: true,
        url: '?messageKey', //Needs URL so stateparams works for the controller
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
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT']);
          }]
        }
      })
      .state('content.management.roles', {
        url: '/roles?id',
        templateUrl: 'app/components/management/roles/roles.html',
        controller: 'RolesController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_ROLES', 'MANAGE_ALL_ROLES', 'MANAGE_TENANT_ENROLLMENT']);
          }]
        }
      })
      .state('content.management.skills', {
        url: '/skills?id',
        templateUrl: 'app/components/management/skills/skills.html',
        controller: 'SkillsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_SKILLS', 'MANAGE_ALL_SKILLS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_TENANT_ENROLLMENT']);
          }]
        }
      })
      .state('content.management.groups', {
        url: '/groups?id',
        templateUrl: 'app/components/management/groups/groups.html',
        controller: 'GroupsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_GROUPS', 'MANAGE_ALL_GROUPS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_GROUP_OWNERS', 'MANAGE_TENANT_ENROLLMENT']);
          }]
        }
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
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['PLATFORM_VIEW_ALL_TENANTS', 'PLATFORM_MANAGE_ALL_TENANTS', 'PLATFORM_CREATE_ALL_TENANTS', 'PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_TENANT']);
          }]
        }
      })
      .state('content.configuration.lists', {
        url: '/lists?id',
        templateUrl: 'app/components/configuration/lists/lists.html',
        controller: 'listsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['MANAGE_ALL_LISTS']);
          }]
        }
      })
      .state('content.configuration.integrations', {
        url: '/integrations?id',
        templateUrl: 'app/components/configuration/integrations/integrations.html',
        controller: 'IntegrationsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['VIEW_ALL_PROVIDERS', 'MANAGE_ALL_PROVIDERS']);
          }]
        }
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
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS', 'MAP_ALL_CONTACT_POINTS']);
          }]
        }
      })
      .state('content.flows.queues', {
        url: '/queues?id',
        templateUrl: 'app/components/flows/queues/queues.html',
        controller: 'QueueController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS', 'VIEW_ALL_QUEUES', 'MANAGE_ALL_QUEUES']);
          }]
        }
      })
      .state('content.flows.media', {
        url: '/media?id',
        templateUrl: 'app/components/flows/media/media.html',
        controller: 'MediaController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['VIEW_ALL_MEDIA', 'VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS']);
          }]
        }
      })
      .state('content.flows.media-collections', {
        url: '/media-collections?id',
        templateUrl: 'app/components/flows/media-collections/media-collections.html',
        controller: 'MediaCollectionController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['VIEW_ALL_MEDIA', 'VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS']);
          }]
        }
      })
      .state('content.flows.dispatchMappings', {
        url: '/dispatchMappings?id',
        templateUrl: 'app/components/flows/dispatchMappings/dispatchMappings.html',
        controller: 'DispatchMappingsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: ['UserPermissions', function(UserPermissions) {
            return UserPermissions.resolvePermissions(['VIEW_ALL_CONTACT_POINTS', 'MAP_ALL_CONTACT_POINTS']);
          }]
        }
      })
      .state('content.flows.versions', {
        url: '/versions?id',
        templateUrl: 'app/components/flows/flowManagement/versions/versions.html',
        controller: 'VersionsController',
        reloadOnSearch: false
      })
      .state('content.flows.editor', {
        url: '/editor/:flowId/:draftId',
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
          draft: ['$stateParams', 'FlowDraft', 'Session', '$q', function($stateParams, FlowDraft, Session, $q) {
            var deferred = $q.defer();
            var draft;

            FlowDraft.get({
              flowId: $stateParams.flowId,
              id: $stateParams.draftId,
              tenantId: Session.tenant.tenantId
            }, function(data) {
              draft = data;
              deferred.resolve(draft);
            });

            return deferred.promise;
          }],
          notations: ['Notation','$q', function(Notation, $q) {
            var deferred = $q.defer();

            Notation.query({}, function(results) {
              deferred.resolve(results);
            });

            return deferred.promise;
          }],
          resources: ['FlowResource', '$q', function(FlowResource, $q){
            var deferred = $q.defer();

            FlowResource.loadResources().then(function(){
                deferred.resolve();
            });

            return deferred.promise;
          }]
        }
      })
      .state('content.flows.view', {
        url: '/viewer/:flowId/:versionId',
        templateUrl: 'app/components/flows/flowDesigner/flowViewerPage.html',
        controller: 'ViewerPageController',
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
          data: ['$stateParams', 'FlowVersion', 'Session', '$q', function($stateParams, FlowVersion, Session, $q) {
            var deferred = $q.defer();
            var version;

            FlowVersion.get({
              flowId: $stateParams.flowId,
              version: $stateParams.versionId,
              tenantId: Session.tenant.tenantId
            }, function(data) {
              version = data;
              deferred.resolve(version);
            });

            return deferred.promise;
          }],
          notations: ['Notation', '$q', function(Notation, $q) {
            var deferred = $q.defer();

            Notation.query({}, function(results) {
              deferred.resolve(results);
            });

            return deferred.promise;
          }],
          resources: ['FlowResource', function(FlowResource){
            return FlowResource.loadResources();
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
        url: '/login?messageKey&tenantId',
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
      .state('content.reports', {
        url: '/reports?id',
        templateUrl: 'app/components/reports/reports.html',
        controller: 'ReportsController'
      })
      .state('invite-accept', {
        url: '/invite-accept?userId&tenantId&token',
        templateUrl: 'app/components/inviteAccept/inviteAccept.html',
        controller: 'InviteAcceptController',
        isPublic: true,
        resolve: {
          invitedUser: ['$stateParams', 'Session', 'User', '$q', '$state', function($stateParams, Session, User, $q, $state) {
            Session.setToken('Token ' + $stateParams.token);

            var userResult = User.get({
              id: $stateParams.userId
            }, angular.noop, function(){
              $state.go('login', {messageKey: 'invite.accept.expired'});
            });

            return userResult.$promise;
          }]
        }
      })
      .state('content.realtime-dashboards', {
        url: '/realtime-dashboards',
        templateUrl: 'app/components/realtimeDashboards/demo.html',
        controller: 'RealtimeDashboardsController',
        isPublic: false,
        resolve: {
          dashboard: function() {
            return {
              name: 'Dashboard A',
              order: 0,
              id: '00000000-0000-0000-000000000000',
              widgets: [{
                title: {
                  enabled: true,
                  text: 'Widget A'
                },
                size: {
                  width: 3,
                  height: 2
                },
                position: {
                  row: 0,
                  col: 0
                },
                chart: {
                  type: 'line',
                  data: {
                    columns: [
                      ['data1', 30, 200, 100, 400, 150, 5],
                      ['data2', 50, 20, 10, 40, 15, 25]
                    ],
                    regions: {
                      'data1': [{'start':1, 'end':2, 'style':'dashed'},{'start':3}], // currently 'dashed' style only
                      'data2': [{'end':3}]
                    }
                  }
                }
              }, {
                title: {
                  enabled: true,
                  text: 'Widget B'
                },
                size: {
                  width: 2,
                  height: 2
                },
                position: {
                  row: 0,
                  col: 0
                },
                chart: {
                  type: 'line',
                  data: {
                    columns: [
                      ['data1', 5, 10, 20, 12, 13, 7],
                      ['data2', 6, 6, 77, 46, 23, 25],
                      ['data3', 3, 3, 255, 46, 77, 36]
                    ],
                    regions: {
                      'data1': [{'start':1, 'end':2, 'style':'dashed'},{'start':3}],
                      'data2': [{'end':3}],
                      'data3': [{'end':2}]
                    }
                  }
                }
              }]
            };
          }
        }
      });

    angular.extend(toastrConfig, {
      closeButton: true,
      timeout: 10000,
      maxOpened: 3,
      positionClass: 'toast-top-right',
      preventOpenDuplicates: true,
      newestOnTop: true,
    });

    $translateProvider
      .useSanitizeValueStrategy('escaped')
      .useLocalStorage()
      .preferredLanguage('en');
  }]);
