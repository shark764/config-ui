'use strict';

angular.module('liveopsConfigPanel')
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise(function($injector) {
        var Session = $injector.get('Session');
        if (Session.isAuthenticated()) {
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
            hasPermission: ['UserPermissions', 'PermissionGroups', '$q', function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageUsers.concat(PermissionGroups.viewUsers)),
                UserPermissions.resolvePermissions(PermissionGroups.manageUserSkillsAndGroups) //See TITAN2-4897 for why we do this extra check
              );
            }]
          }
        })
        .state('content.management.roles', {
          url: '/roles?id',
          templateUrl: 'app/components/management/roles/roles.html',
          controller: 'RolesController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.manageRoles);
            }]
          }
        })
        .state('content.management.skills', {
          url: '/skills?id',
          templateUrl: 'app/components/management/skills/skills.html',
          controller: 'SkillsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', '$q', function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageSkills),
                UserPermissions.resolvePermissions(PermissionGroups.manageAllMedia) //See TITAN2-6199 for why we do this extra check
              );
            }]
          }
        })
        .state('content.management.groups', {
          url: '/groups?id',
          templateUrl: 'app/components/management/groups/groups.html',
          controller: 'GroupsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', '$q', function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageGroups),
                UserPermissions.resolvePermissions(PermissionGroups.manageAllMedia)
              );
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
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessTenants);
            }]
          }
        })
        .state('content.configuration.genericLists', {
          url: '/lists?id',
          templateUrl: 'app/components/configuration/genericLists/genericLists.html',
          controller: 'genericListsController as gc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllLists);
            }]
          }
        })
        .state('content.configuration.code', {
          url: '/code',
          abstract: true,
          template: '<ui-view />'
        })
        .state('content.configuration.dispositions', {
          url: '/dispositions?index',
          templateUrl: 'app/components/configuration/genericItems/genericItems.html',
          controller: 'genericItemsController',
          reloadOnSearch: false,
          params: {
            listId: 'c9d31830-9499-11e5-b3ac-c1ae7ae4ed37',
          },
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllLists);
            }]
          }
        })
        .state('content.configuration.reasons', {
          url: '/reasons?index',
          templateUrl: 'app/components/configuration/genericItems/genericItems.html',
          controller: 'genericItemsController',
          reloadOnSearch: false,
          params: {
            listId: 'c9d31830-9499-11e5-b3ac-c1ae7ae4ed37',
          },
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllLists);
            }]
          }
        })
        .state('content.configuration.integrations', {
          url: '/integrations?id',
          templateUrl: 'app/components/configuration/integrations/integrations.html',
          controller: 'IntegrationsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllIntegrations);
            }]
          }
        })
        .state('content.configuration.hours', {
          url: '/hours?id',
          templateUrl: 'app/components/configuration/hours/hours.html',
          controller: 'hoursController as hc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllBusinessHours);
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
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllFlows);
            }]
          }
        })
        .state('content.flows.queues', {
          url: '/queues?id',
          templateUrl: 'app/components/flows/queues/queues.html',
          controller: 'QueueController as qc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllQueues);
            }]
          }
        })
        .state('content.flows.media', {
          url: '/media?id',
          templateUrl: 'app/components/flows/media/media.html',
          controller: 'MediaController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllMedia);
            }]
          }
        })
        .state('content.flows.media-collections', {
          url: '/media-collections?id',
          templateUrl: 'app/components/flows/media-collections/media-collections.html',
          controller: 'MediaCollectionController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllMedia);
            }]
          }
        })
        .state('content.flows.dispatchMappings', {
          url: '/dispatchMappings?id',
          templateUrl: 'app/components/flows/dispatchMappings/dispatchMappings.html',
          controller: 'DispatchMappingsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllDispatchMappings);
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
            notations: ['Notation', '$q', function(Notation, $q) {
              var deferred = $q.defer();

              Notation.query({}, function(results) {
                deferred.resolve(results);
              });

              return deferred.promise;
            }],
            resources: ['FlowResource', '$q', function(FlowResource, $q) {
              var deferred = $q.defer();

              FlowResource.loadResources().then(function() {
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
            resources: ['FlowResource', function(FlowResource) {
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
                $timeout(function() {
                  $state.go('content.flows.flowManagement');
                }, 5);
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
        .state('content.reports.recordings', {
          url: '/recordings?id',
          templateUrl: 'app/components/reports/recordings/recordings.html',
          controller: 'RecordingsController as rc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', function(UserPermissions) {
              return UserPermissions.resolvePermissions([
                'VIEW_ALL_RECORDINGS',
                'VIEW_MY_RECORDINGS',
                'MANAGE_ALL_RECORDINGS',
                'DELETE_ALL_RECORDED_FILES']);
            }]
          }
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
              }, angular.noop, function(error) {
                if (error.data === 'Permission denied') {
                  $state.go('login', {
                    messageKey: 'permissions.unauthorized.message'
                  });
                } else {
                  $state.go('login', {
                    messageKey: 'invite.accept.expired'
                  });
                }
              });

              return userResult.$promise;
            }]
          }
        })
        .state('content.realtime-dashboards-management', {
          url: '/realtime-dashboards',
          templateUrl: 'app/components/reporting/realtime/realtimeDashboardsManagement.html',
          controller: 'RealtimeDashboardsManagementController',
          resolve: {
            dashboards: ['RealtimeDashboardsSettings', function(RealtimeDashboardsSettings) {
              return _.filter(RealtimeDashboardsSettings.mockDashboards, function(dash) {
                return dash.enabled === true;
              });
            }]
          }
        })
        .state('content.realtime-dashboards-management.editor', {
          url: '/editor?id',
          templateUrl: 'app/components/reporting/realtime/realtimeDashboardEditor/realtimeDashboardsEditor.html',
          controller: 'realtimeDashboardsEditorController',
          resolve: {
            dashboard: ['$stateParams', 'RealtimeDashboardsSettings', function($stateParams, RealtimeDashboardsSettings) {
              var dashboard = _.filter(RealtimeDashboardsSettings.mockDashboards, function(dash) {
                return dash.id === $stateParams.id;
              });
              return dashboard[0];
            }],
            dashboards: ['RealtimeDashboardsSettings', function(RealtimeDashboardsSettings) {
              return _.filter(RealtimeDashboardsSettings.mockDashboards, function(dash) {
                return dash.enabled === true;
              });
            }],
            queues: ['Queue', 'Session', '$q', function(Queue, Session, $q) {
              var deferred = $q.defer();
              Queue.query({
                tenantId: Session.tenant.tenantId
              }, function(queues) {
                deferred.resolve(queues);
              });
              return deferred.promise;
            }],
            users: ['User', 'Session', '$q', function(User, Session, $q) {
              var deferred = $q.defer();
              User.query({
                tenantId: Session.tenant.tenantId
              }, function(users) {
                deferred.resolve(users);
              });
              return deferred.promise;
            }],

            flows: ['Flow', 'Session', '$q', function(Flow, Session, $q) {
              var deferred = $q.defer();
              Flow.query({
                tenantId: Session.tenant.tenantId
              }, function(flows) {
                deferred.resolve(flows);
              });
              return deferred.promise;
            }]
          }
        });
    }
  ]);
