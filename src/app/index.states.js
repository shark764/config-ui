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
          title: 'CxEngage',
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
          title: 'User Management',
          controller: 'ManagementController'
        })
        .state('content.management.users', {
          url: '/users?id',
          title: 'User Management - Users',
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
          title: 'User Management - Role Management',
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
          title: 'User Management - Skill Management',
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
          title: 'User Management - Group Management',
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
        .state('content.management.capacityRules', {
          url: '/capacityRules?id',
          title: 'User Management - Capacity Rules Management',
          templateUrl: 'app/components/management/capacityRules/capacityRules.html',
          controller: 'CapacityRulesController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', '$q', function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageCapacityRules)
              );
            }]
          }
        })
        .state('content.configuration', {
          abstract: true,
          url: '/configuration',
          title: 'Configuration',
          templateUrl: 'app/components/configuration/configuration.html',
          controller: 'ConfigurationController'
        })
        .state('content.configuration.tenants', {
          url: '/tenants?id',
          title: 'Configuration - Tenant Management',
          templateUrl: 'app/components/configuration/tenants/tenants.html',
          controller: 'TenantsController as tc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewTenants);
            }]
          }
        })
        .state('content.configuration.genericLists', {
          url: '/lists?id',
          title: 'Configuration - Lists',
          templateUrl: 'app/components/configuration/genericLists/genericLists.html',
          controller: 'genericListsController as gc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllLists);
            }]
          }
        })
        .state('content.configuration.dnc', {
          url: '/dnc?id',
          title: 'Configuration - Do Not Contact List Management',
          templateUrl: 'app/components/configuration/dncLists/dncLists.html',
          controller: 'dncListsController as dnc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCampaigns);
            }]
          }
        })
        .state('content.configuration.code', {
          url: '/code',
          abstract: true,
          template: '<ui-view />'
        })
        .state('content.management.reasons', {
          url: '/reasons?id',
          title: 'User Management - Presence Reasons ',
          templateUrl: 'app/components/management/reasons/reasons.html',
          controller: 'reasonsController as rc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewReasons);
            }]
          }
        })
        .state('content.management.reasonLists', {
          url: '/reasonLists?id',
          title: 'User Management - Presence Reasons Lists',
          templateUrl: 'app/components/management/reasons/reasonLists/reasonLists.html',
          controller: 'reasonListsController as rlc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewReasonLists);
            }]
          }
        })
        .state('content.configuration.integrations', {
          url: '/integrations?id',
          title: 'Configuration - Integration Management',
          templateUrl: 'app/components/configuration/integrations/integrations.html',
          controller: 'IntegrationsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewIntegrations);
            }]
          }
        })
        .state('content.configuration.hours', {
          url: '/hours?id',
          title: 'Configuration - Business Hours Management',
          templateUrl: 'app/components/configuration/hours/hours.html',
          controller: 'hoursController as hc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.hasPermissionInList(PermissionGroups.viewBusinessHours) || UserPermissions.resolvePermissions(PermissionGroups.manageBusinessHours);
            }]
          }
        })
        // FEATURE FLAG: UNCOMMENT THIS AS WELL AS THE CAMPAIGNS ITEM IN NavbarController.js TO
        // ACTIVATE THE CAMPAIGNS FEATURE
        .state('content.configuration.campaigns', {
          url: '/campaigns?id',
          title: 'Configuration - Campaign Management',
          templateUrl: 'app/components/configuration/campaigns/campaigns.html',
          controller: 'campaignsController as cc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCampaigns);
            }]
          }
        })
        .state('content.configuration.campaignSettings', {
          url: '/campaign/settings?id',
          title: 'Configuration - Campaign Settings',
          templateUrl: 'app/components/configuration/campaigns/settings/campaignSettings.html',
          controller: 'campaignSettingsController as csc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCampaigns);
            }],
            getCampaignId: ['$stateParams', function ($stateParams) {
              return $stateParams.id;
            }]
          }
        })
        .state('content.configuration.contacts', {
          url: '/contacts?id',
          title: 'Configuration - Contacts',
          templateUrl: 'app/components/configuration/campaigns/contacts/contacts.html',
          controller: 'contactsController as con',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCampaigns);
            }]
          }
        })
        // .state('content.configuration.keys', {
        //   url: '/keys?id',
        //   title: 'Configuration - API Keys',
        //   templateUrl: 'app/components/configuration/keys/keys.html',
        //   controller: 'keysController as kc',
        //   reloadOnSearch: false,
        //   resolve: {
        //     hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
        //       return UserPermissions.resolvePermissions(PermissionGroups.viewAppCreds);
        //     }]
        //   }
        // })
        .state('content.flows', {
          abstract: true,
          url: '/flows',
          title: 'Flow Management',
          templateUrl: 'app/components/flows/flows.html',
          controller: 'FlowsController'
        })
        .state('content.flows.flowManagement', {
          url: '/management?id',
          title: 'Flows - Flow Management',
          templateUrl: 'app/components/flows/flowManagement/flowManagement.html',
          controller: 'FlowManagementController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewFlows);
            }]
          }
        })
        .state('content.flows.queues', {
          url: '/queues?id',
          title: 'Flows - Queue Management',
          templateUrl: 'app/components/flows/queues/queues.html',
          controller: 'QueueController as qc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewQueues);
            }]
          }
        })
        .state('content.flows.dispositions', {
          url: '/dispositions?id',
          title: 'Flows - Disposition Management',
          templateUrl: 'app/components/flows/dispositions/dispositions.html',
          controller: 'dispositionsController as dc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispositions);
            }]
          }
        })
        .state('content.flows.dispositionLists', {
          url: '/dispositionLists?id',
          title: 'Flows - Disposition List Management',
          templateUrl: 'app/components/flows/dispositions/dispositionLists/dispositionLists.html',
          controller: 'dispositionListsController as dlc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispositionLists);
            }]
          }
        })
        .state('content.flows.media', {
          url: '/media?id',
          title: 'Flows - Media Management',
          templateUrl: 'app/components/flows/media/media.html',
          controller: 'MediaController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewMedia);
            }]
          }
        })
        .state('content.flows.media-collections', {
          url: '/media-collections?id',
          title: 'Flows - Media Collection Management',
          templateUrl: 'app/components/flows/media-collections/media-collections.html',
          controller: 'MediaCollectionController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewMedia);
            }]
          }
        })
        .state('content.flows.dispatchMappings', {
          url: '/dispatchMappings?id',
          title: 'Flows - Dispatch Mapping Management',
          templateUrl: 'app/components/flows/dispatchMappings/dispatchMappings.html',
          controller: 'DispatchMappingsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispatchMappings);
            }]
          }
        })
        .state('content.flows.versions', {
          url: '/versions?id',
          title: 'Flows - Flow Versions Management',
          templateUrl: 'app/components/flows/flowManagement/versions/versions.html',
          controller: 'VersionsController',
          reloadOnSearch: false
        })
        .state('content.flows.editor', {
          url: '/editor/:flowId/:draftId',
          title: 'Flows - Flow Draft',
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
            }],
            platformFlow: ['Session','apiHostname', '$http', function(Session, apiHostname, $http){
              return $http.get(apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/settings')
                .then(function(data){
                  return _.findWhere(data.data.result, {name: 'platform-defaults-flow'}).value;
                });
            }]
          }
        })
        .state('content.flows.view', {
          url: '/viewer/:flowId/:versionId',
          title: 'Flows - Flow Viewer',
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
            }],
            platformFlow: ['Session','apiHostname', '$http', function(Session, apiHostname, $http){
              return $http.get(apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/settings')
                .then(function(data){
                  return _.findWhere(data.data.result, {name: 'platform-defaults-flow'}).value;
                });
            }]
          }
        })
        .state('content.flows.subflowEditor', {
          url: '/subflow-editor/:subflowNotationId',
          title:'Flows - Flow Designer',
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
          title: 'CxEngage Login',
          templateUrl: 'app/components/login/login.html',
          controller: 'LoginController',
          isPublic: true
        })
        .state('forgot-password', {
          url: '/forgot-password',
          title: 'CxEngage Forgot Password',
          templateUrl: 'app/components/forgotPassword/forgotPassword.html',
          controller: 'ForgotPasswordController',
          isPublic: true
        })
        .state('reset-password', {
          url: '/reset-password?userId&token',
          title:'CxEngage Reset Password',
          templateUrl: 'app/components/resetPassword/resetPassword.html',
          controller: 'ResetPasswordController',
          isPublic: true,
          resolve: {
            userToReset: ['$stateParams', 'Session', 'User', '$q', '$state', function($stateParams, Session, User, $q, $state) {
              Session.setToken('Token ' + $stateParams.token);

              var userResult = User.get({
                id: $stateParams.userId
              }, angular.noop, function() {
                $state.go('login', {
                  messageKey: 'user.details.password.reset.expired'
                });
              });

              return userResult.$promise;
            }]
          }
        })
        .state('content.userprofile', {
          url: '/userprofile',
          title:'CxEngage User Profile',
          templateUrl: 'app/components/userProfile/userProfile.html',
          controller: 'UserProfileController',
          secure: true
        })
        .state('content.reports', {
          url: '/reports?id',
          title:'Reporting - Historical Dashboards',
          templateUrl: 'app/components/reports/reports.html',
          controller: 'ReportsController'
        })
        .state('content.recordings', {
          url: '/recordings?id',
          title: 'Reporting - Recordings',
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
          title:'CxEngage Accept Invite',
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
          url: '/realtime-dashboards?id',
          title:'Reporting - Custom Realtime Dashboards',
          templateUrl: 'app/components/reporting/realtime/realtimeDashboardManagement/realtimeDashboardsManagement.html',
          controller: 'RealtimeDashboardsManagementController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDashboards);
            }],
            dashboards: ['RealtimeDashboardsSettings', function(RealtimeDashboardsSettings) {
              return _.filter(RealtimeDashboardsSettings.mockDashboards, function(dash) {
                return dash.enabled === true;
              });
            }]
          }
        })
        .state('content.realtime-dashboards-management.editor', {
          url: '/editor/:dashboardId',
          title:'Reporting - Custom Realtime Dashboards - Editor',
          templateUrl: 'app/components/reporting/realtime/realtimeDashboardEditor/realtimeDashboardsEditor.html',
          controller: 'realtimeDashboardsEditorController',
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDashboards);
            }],
            dashboard: ['$stateParams', 'Session', 'RealtimeDashboard', 'RealtimeDashboardsSettings', '$q', function($stateParams, Session, RealtimeDashboard, RealtimeDashboardsSettings, $q) {
              var deferred = $q.defer();
              var dashboard;

              delete $stateParams.id;

              RealtimeDashboard.get({
                tenantId: Session.tenant.tenantId,
                id: $stateParams.dashboardId
              }, function(data) {
                dashboard = data;
                deferred.resolve(dashboard);
              });

              return deferred.promise;
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
            users: ['TenantUser', 'Session', '$q', function(TenantUser, Session, $q) {
              var deferred = $q.defer();
              TenantUser.query({
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
        })
        .state('content.realtime-dashboards-management.viewer', {
          url: '/viewer/:dashboardId',
          title:'Reporting - Realtime Dashboards',
          templateUrl: 'app/components/reporting/realtime/realtimeDashboards.html',
          controller: 'RealtimeDashboardsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDashboards);
            }],
            dashboard: ['$stateParams', '$state', 'RealtimeDashboardsSettings', 'RealtimeDashboard', 'Session', '$q', function($stateParams, $state, RealtimeDashboardsSettings, RealtimeDashboard, Session, $q) {

              delete $stateParams.id;

              var deferred = $q.defer();

              RealtimeDashboard.query({
                tenantId: Session.tenant.tenantId,
              }, function(data) {
                var dashboards = _.filter(_.union(data, RealtimeDashboardsSettings.mockDashboards), function(dash) {
                  return dash.id === $stateParams.dashboardId;
                });

                if (_.isEmpty(dashboards)) {
                  dashboards = _.filter(RealtimeDashboardsSettings.mockDashboards, function(dash) {
                    return dash.id === 'overview-dashboard';
                  });
                }

                deferred.resolve(_.first(dashboards));
              });

              return deferred.promise;
            }],
            dashboards: ['RealtimeDashboardsSettings', 'RealtimeDashboard', 'Session', '$q', '$translate', function(RealtimeDashboardsSettings, RealtimeDashboard, Session, $q, $translate) {
              var deferred = $q.defer();

              RealtimeDashboard.query({
                tenantId: Session.tenant.tenantId,
              }, function(data) {
                // Add category attribute to each dashboard so they can be grouped together in the dropdown
                data.forEach(function(item) {
                  item.dashboardCategory = $translate.instant('realtimeDashboards.category.custom');
                });
                RealtimeDashboardsSettings.mockDashboards.forEach(function(item) {
                  item.dashboardCategory = $translate.instant('realtimeDashboards.category.standard');
                });

                var dashboards = _.filter(_.union(data, RealtimeDashboardsSettings.mockDashboards), function(dash) {
                  return dash.enabled === true || dash.active === true;
                });
                deferred.resolve(_.sortBy(dashboards, 'name'));
              });

              return deferred.promise;
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
            users: ['TenantUser', 'Session', '$q', function(TenantUser, Session, $q) {
              var deferred = $q.defer();
              TenantUser.query({
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
        })
        .state('content.reporting', {
          abstract: true,
          url: '/reporting',
          title:'Reporting - Reporting',
          templateUrl: 'app/components/reporting/reporting.html',
          controller: 'ReportingController'
        })
        .state('content.reporting.custom-stats', {
          url: '/custom-stats?id',
          title:'Reporting - Custom Statistics',
          templateUrl: 'app/components/reporting/customStats/customStatsManagement.html',
          controller: 'customStatsManagementController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
            }]
          }
        })
        .state('content.reporting.custom-stats-editor', {
          url: '/custom-stats/editor/:customStatId/:draftId/?readOnly',
          title:'Reporting - Custom Statistics - Editor',
          templateUrl: 'app/components/reporting/customStatsEditor/customStatsEditor.html',
          controller: 'customStatsEditorController',
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
            }],
            customStat: ['$stateParams', 'Session', 'CustomStat', '$q', function($stateParams, Session, CustomStat, $q) {
              var deferred = $q.defer();
              var customStat;

              delete $stateParams.id;

              CustomStat.get({
                tenantId: Session.tenant.tenantId,
                id: $stateParams.customStatId
              }, function(data) {
                customStat = data;
                deferred.resolve(customStat);
              });

              return deferred.promise;
            }],
            draft: ['$stateParams', 'CustomStatDraft', 'Session', '$q', function($stateParams, CustomStatDraft, Session, $q) {
              var deferred = $q.defer();
              var draft;

              CustomStatDraft.get({
                customStatId: $stateParams.customStatId,
                id: $stateParams.draftId,
                tenantId: Session.tenant.tenantId
              }, function(data) {
                draft = data;
                draft.readOnly = false;
                deferred.resolve(draft);
              });

              return deferred.promise;
            }]
          }
        })
        .state('content.reporting.custom-stats-viewer', {
          url: '/custom-stats/viewer/:customStatId/:draftId/',
          title:'Reporting - Custom Statistics - Viewer',
          templateUrl: 'app/components/reporting/customStatsEditor/customStatsEditor.html',
          controller: 'customStatsEditorController',
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
            }],
            customStat: ['$stateParams', 'Session', 'CustomStat', '$q', function($stateParams, Session, CustomStat, $q) {
              var deferred = $q.defer();
              var customStat;

              delete $stateParams.id;

              CustomStat.get({
                tenantId: Session.tenant.tenantId,
                id: $stateParams.customStatId
              }, function(data) {
                customStat = data;
                deferred.resolve(customStat);
              });

              return deferred.promise;
            }],
            draft: ['$stateParams', 'CustomStatVersion', 'Session', '$q', function($stateParams, CustomStatVersion, Session, $q) {
              var deferred = $q.defer();
              var version;

              CustomStatVersion.get({
                customStatId: $stateParams.customStatId,
                version: $stateParams.draftId,
                tenantId: Session.tenant.tenantId
              }, function(data) {
                version = data;
                version.readOnly = true;
                deferred.resolve(version);
              });

              return deferred.promise;
            }]
          }
        });
    }
  ]);
