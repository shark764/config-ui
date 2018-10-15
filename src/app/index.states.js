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
        .state('content.management.users2', {
          url: '/users2',
          title: 'User Management - Users',
          templateUrl: 'app/components/management/users2/users.html',
          controller: 'usersController2',
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
        .state('content.management.roles2', {
          url: '/roles2',
          title: 'User Management - Role Management',
          templateUrl: 'app/components/management/roles2/roles2.html',
          controller: 'rolesController2',
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
          controller: 'genericListsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllLists);
            }]
          }
        })
        .state('content.configuration.outboundIdentifiers', {
          url: '/outboundIdentifiers',
          title: 'Configuration - Outbound Identifiers',
          templateUrl: 'app/components/configuration/outboundIdentifiers/outboundIdentifiers.html',
          controller: 'outboundIdentifiersController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewOutboundIdentifiers);
            }]
          }
        })
        .state('content.configuration.chatWidgets', {
          url: '/chatWidgets',
          title: 'Configuration - Chat Widgets',
          templateUrl: 'app/components/configuration/chatWidgets/chatWidgets.html',
          controller: 'chatWidgetsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewOutboundIdentifiers);
            }]
          }
        })
        .state('content.configuration.outboundIdentifierLists', {
          url: '/outboundIdentifierLists',
          title: 'Configuration - Outbound Identifier Lists',
          templateUrl: 'app/components/configuration/outboundIdentifierLists/outboundIdentifierLists.html',
          controller: 'outboundIdentifierListsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewOutboundIdentifiers);
            }]
          }
        })
        .state('content.beta', {
          url: '/betaFeatures',
          title: 'Configuration - Beta Features',
          templateUrl: 'app/components/configuration/betaFeatures/betaFeatures.html',
          controller: 'betaFeaturesController',
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.readAllMode);
            }]
          }
        })
        .state('content.configuration.emailTemplates', {
          url: '/emailTemplates?id',
          title: 'Configuration - Email Templates',
          templateUrl: 'app/components/configuration/emailTemplates/emailTemplates.html',
          controller: 'emailTemplatesController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllEmailTemplates);
            }]
          }
        })
        .state('content.configuration.statistics', {
            url: '/statistics?id',
            title: 'Configuration - Statistics',
            templateUrl: 'app/components/configuration/statistics/statistics.html',
            controller: 'statisticsController as stat',
            reloadOnSearch: false,
            resolve: {
              hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
                return UserPermissions.resolvePermissions(PermissionGroups.accessAllCustomStats);
              }]
            }
          })
        .state('content.configuration.contactAttributes', {
          url: '/contactAttributes?id',
          title: 'Configuration - Contact Attribute Management',
          templateUrl: 'app/components/configuration/contactAttributes/contactAttributes.html',
          controller: 'contactAttributesController as cac',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewContactAttributes);
            }]
          }
        })
        .state('content.configuration.contactLayouts', {
          url: '/contactLayouts?id',
          title: 'Configuration - Contact Layout Management',
          templateUrl: 'app/components/configuration/contactLayouts/contactLayouts.html',
          controller: 'contactLayoutsController as clc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewContactLayouts);
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
        .state('content.configuration.keys', {
          url: '/keys?id',
          title: 'Configuration - API Keys',
          templateUrl: 'app/components/configuration/keys/keys.html',
          controller: 'keysController as kc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewAppCreds);
            }]
          }
        })
        .state('content.configuration.messageTemplates', {
          url: '/messageTemplates?id',
          title: 'Configuration - Message Templates',
          templateUrl: 'app/components/configuration/messageTemplates/messageTemplates.html',
          controller: 'messageTemplatesController as mtc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewMessageTemplates);
            }]
          }
        })
        .state('content.configuration.transferLists', {
          url: '/transferLists?id',
          title: 'Configuration - Transfer Lists',
          templateUrl: 'app/components/configuration/transferLists/transferLists.html',
          controller: 'transferListsController as tlc',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', function(UserPermissions) {
              return UserPermissions.resolvePermissions(['VIEW_ALL_TRANSFER_LISTS']);
            }]
          }
        })
        .state('content.configuration.identityProviders', {
          url: '/identityProviders?id',
          title: 'Configuration - Identity Providers',
          templateUrl: 'app/components/configuration/identityProviders/identityProviders.html',
          controller: 'identityProvidersController as idp',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', function(UserPermissions) {
              return UserPermissions.resolvePermissions(['IDENTITY_PROVIDERS_READ']);
            }]
          }
        })
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
          resolve: {}
        })
        .state('content.flows.view', {
          url: '/viewer/:flowId/:versionId',
          title: 'Flows - Flow Viewer',
          templateUrl: 'app/components/flows/flowDesigner/flowViewerPage.html',
          controller: 'ViewerPageController',
          reloadOnSearch: false,
          resolve: {}
        })
        .state('login', {
          url: '/login?messageKey&tenantId&sso',
          title: 'Login',
          templateUrl: 'app/components/login/login.html',
          controller: 'LoginController',
          isPublic: true
        })
        .state('forgot-password', {
          url: '/forgot-password',
          title: 'Forgot Password',
          templateUrl: 'app/components/forgotPassword/forgotPassword.html',
          controller: 'ForgotPasswordController',
          isPublic: true
        })
        .state('reset-password', {
          url: '/reset-password?userid&userId&token',
          title:'Reset Password',
          templateUrl: 'app/components/resetPassword/resetPassword.html',
          controller: 'ResetPasswordController',
          isPublic: true,
          resolve: {
            userToReset: ['$stateParams', 'Session', 'User', '$q', '$state', function($stateParams, Session, User, $q, $state) {
              Session.setToken('Token ' + $stateParams.token);

              var userResult = User.get({
                id: $stateParams.userId || $stateParams.userid
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
          title:'User Profile',
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
        .state('content.logi', {
          url: '/reports/logi',
          title: 'Reporting - Logi',
          templateUrl: 'app/components/reports/logi/logi.html',
          controller: 'LogiController'
        })
        .state('content.billing', {
          url: '/billing-reports?id',
          title:'Reporting - Billing Reports',
          templateUrl: 'app/components/reports/reports.html',
          controller: 'ReportsController',
          resolve: {
            hasPermission: ['UserPermissions', function(UserPermissions) {
              return UserPermissions.resolvePermissions(['PLATFORM_VIEW_ALL_TENANTS']);
            }]
          }
        })
        .state('content.reporting.silentMonitoring', {
          url: '/silentMonitoring?id',
          title: 'Reporting - Interaction Monitoring',
          templateUrl: 'app/components/reports/silentMonitoring/silentMonitoring.html',
          controller: 'SilentMonitoringController as ic',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDashboards);
            }]
          }
        })
        .state('content.reporting.interactionMonitoring', {
          url: '/interactionMonitoring?id',
          title: 'Reporting - Interaction Monitoring',
          templateUrl: 'app/components/reports/interactionMonitoring/interactionMonitoring.html',
          controller: 'InteractionMonitoringController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewInteractionMonitoring);
            }]
          }
        })
        .state('invite-accept', {
          url: '/invite-accept?userid&userId&tenantId&tenantid&token',
          title:'Accept Invite',
          templateUrl: 'app/components/inviteAccept/inviteAccept.html',
          controller: 'InviteAcceptController',
          isPublic: true,
          resolve: {
            invitedUser: ['$stateParams', 'Session', 'User', '$q', '$state', function($stateParams, Session, User, $q, $state) {
              if ($stateParams.token !== null) {
                Session.setToken('Token ' + $stateParams.token);
              }

              var userResult = User.get({
                id: $stateParams.userId || $stateParams.userid
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
        .state('content.custom-dashboards-management', {
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
        .state('content.realtime-dashboards-management-editor', {
          url: '/realtime-dashboards/editor/:dashboardId',
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
        .state('content.realtime-dashboards-management-viewer', {
          url: '/realtime-dashboards/viewer/:dashboardId',
          title:'Reporting - Realtime Dashboards',
          templateUrl: 'app/components/reporting/realtime/realtimeDashboards.html',
          controller: 'RealtimeDashboardsController',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDashboards);
            }],
            dashboard: ['$stateParams', function($stateParams) {
              delete $stateParams.id;
              return $stateParams.dashboardId || 'overview-dashboard';
            }],
            dashboards: ['RealtimeDashboardsSettings', 'RealtimeDashboard', 'Session', '$q', '$translate', function(RealtimeDashboardsSettings, RealtimeDashboard, Session, $q, $translate) {
              var deferred = $q.defer();

              var fetchDashboards = function(){
                CxEngage.entities.getDashboards({excludeInactive: true}, function(error, topic, response){
                  if (!error) {
                    // Add category attribute to each dashboard so they can be grouped together in the dropdown
                    response.result.forEach(function(item) {
                      item.dashboardCategory = $translate.instant('realtimeDashboards.category.custom');
                      if (!_.isEmpty(item.activeDashboard)) {
                        item.activeDashboard.id = item.id;
                        item.activeDashboard.name = item.name;
                      }
                    });
                    RealtimeDashboardsSettings.mockDashboards.forEach(function(item) {
                      item.dashboardCategory = $translate.instant('realtimeDashboards.category.standard');
                    });
                    window.allDashboards = _.sortBy(_.union(response.result, RealtimeDashboardsSettings.mockDashboards), 'name');
                    var allDashboardsMapped = window.allDashboards.map(function(item) {
                      return { id: item.id, name: item.name, dashboardCategory: item.dashboardCategory };
                    });
                    deferred.resolve(allDashboardsMapped);
                  }
                });
              };

              CxEngage.session.getActiveTenantId(function(error, topic, response){
                if (response && response === Session.tenant.tenantId){
                  fetchDashboards();
                } else {
                  CxEngage.session.setActiveTenant({tenantId: Session.tenant.tenantId, noSession:true}, function(){
                    fetchDashboards();
                  });
                }
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
          redirectTo: 'content.management.users',
          // commenting out route info as per CXV1-13276, which specifies
          // this option should be hidden, and not necessarily deleted

          // url: '/custom-stats?id',
          // title:'Reporting - Custom Statistics',
          // templateUrl: 'app/components/reporting/customStats/customStatsManagement.html',
          // controller: 'customStatsManagementController',
          // reloadOnSearch: false,
          // resolve: {
          //   hasPermission: ['UserPermissions', 'PermissionGroups', function(UserPermissions, PermissionGroups) {
          //     return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
          //   }]
          // }
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
        })
        .state('content.qualityManagement', {
          url: '/qualityManagement',
          title: 'Quality Management',
          templateUrl: 'app/components/qualityManagement/qualityManagement.html',
          controller: 'qualityManagementController as qm',
          reloadOnSearch: false,
          resolve: {
            hasPermission: ['UserPermissions', 'PermissionGroups', function() {
              // Add UserPermissions and PermissionGroups back into the above function params
              // when we impliment this , remove to avoid linter errors
              // TODO: CXV1-12852 Permissions / Feature Flag for TelStrat page
              return true;
            }]
          }
        });
    }
  ]);
