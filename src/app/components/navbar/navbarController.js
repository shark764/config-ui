'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session', 'DirtyForms', '$translate', 'UserPermissions', 'PermissionGroups', '$window', 'helpDocsHostname', 'appFlags',
    function($rootScope, $scope, $state, AuthService, Session, DirtyForms, $translate, UserPermissions, PermissionGroups, $window, helpDocsHostname, appFlags) {
      var vm = this;
      $scope.hovering = false;
      $scope.Session = Session;
      $scope.hoverTracker = [];

      $scope.populateTenantsHandler = function() {
        if (!Session.isAuthenticated()) {
          return;
        }

        if ((!Session.tenant || !Session.tenant.tenantId) && Session.tenants && Session.tenants.length) {
          Session.setTenant(Session.tenants[0]);
        }

        var tenantDropdownItems = [];
        angular.forEach(Session.tenants, function(tenant) {
          tenantDropdownItems.push({
            label: tenant.tenantName,
            onClick: function() {
              if (!Session.tenant || tenant.tenantId !== Session.tenant.tenantId) {
                DirtyForms.confirmIfDirty(function() {
                  Session.setTenant(tenant);
                  $scope.updateTopbarConfig();
                  var goTo = $state.current;
                  if($state.includes('content.realtime-dashboards-management.editor')) {
                    goTo = 'content.realtime-dashboards-management';
                  } else if ($state.includes('content.flows.editor')){
                    goTo = 'content.flows.flowManagement';
                  }
                  $state.go(goTo, {
                    id: null
                  }, {
                    reload: true,
                    inherit: false
                  });
                });
              }
            }
          });
        });

        $scope.tenantDropdownItems = tenantDropdownItems;
      };

      $scope.isActive = function(viewLocation) {
        return $state.current.name !== '' ? $state.href($state.current.name).indexOf(viewLocation) === 1 : false;
      };

      $scope.logout = function() {
        AuthService.logout();
        $state.transitionTo('login');
        $rootScope.$broadcast('logout');
      };

      $scope.userDropdownItems = [{
        label: $translate.instant('navbar.logout'),
        onClick: function() {
          $scope.logout();
        },
        iconClass: 'fa fa-sign-out'
      }, {
        label: $translate.instant('navbar.profile'),
        onClick: function() {
          $state.transitionTo('content.userprofile');
        },
        iconClass: 'fa fa-gear'
      }];

      $scope.userHelpItems = [
        {
          label: $translate.instant('navbar.help.help'),
          onClick: function() {
            var url = helpDocsHostname + '/Help/Content/Home.htm';
            $window.open(url);
          }
        },
        {
          label: $translate.instant('navbar.help.api'),
          onClick: function() {
            var url = 'https://api-docs.cxengage.net/';
            $window.open(url);
          }
        }
      ];

      $scope.$on('resource:create', $scope.onCreateClick);
      $scope.$on('resource:actions', $scope.onActionsClick);
      $rootScope.$on('readAllMode', function() {
        $scope.updateTopbarConfig();
      });
      $scope.$watch('Session.tenants', $scope.populateTenantsHandler);

      vm.getManagementConfig = function() {
        var items = [];

        //Note: see TITAN2-5445 for why VIEW_ALL_USERS permission on its own is not sufficient
        if ((UserPermissions.hasPermissionInList(PermissionGroups.viewUsers) && UserPermissions.hasPermissionInList(PermissionGroups.manageUserSkillsAndGroups)) ||
          UserPermissions.hasPermissionInList(PermissionGroups.manageUsers)) {
          items.push({
            label: $translate.instant('navbar.management.users.title'),
            stateLink: 'content.management.users',
            id: 'user-management-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewReasons)) {
          items.push({
            label: $translate.instant('navbar.management.reasons.title'),
            stateLink: 'content.management.reasons',
            id: 'reasons-management-link',
            order: 2
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewReasonLists)) {
          items.push({
            label: $translate.instant('navbar.management.reasons.lists.title'),
            stateLink: 'content.management.reasonLists',
            id: 'reason-lists-management-link',
            order: 3
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.manageRoles)) {
          items.push({
            label: $translate.instant('navbar.management.roles.title'),
            stateLink: 'content.management.roles',
            id: 'role-management-link',
            order: 4
          });
        }

        //See TITAN2-6199 for why we do this extra check
        if (UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
          UserPermissions.hasPermissionInList(PermissionGroups.manageSkills)) {
          items.push({
            label: $translate.instant('navbar.management.skills.title'),
            stateLink: 'content.management.skills',
            id: 'skill-management-link',
            order: 5
          });
        }

        //See TITAN2-6199 for why we do this extra check
        if (UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
          UserPermissions.hasPermissionInList(PermissionGroups.manageGroups)) {
          items.push({
            label: $translate.instant('navbar.management.groups.title'),
            stateLink: 'content.management.groups',
            id: 'group-management-link',
            order: 6
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.manageCapacityRules)) {
          items.push({
            label: $translate.instant('navbar.management.capacityRules.title'),
            stateLink: 'content.management.capacityRules',
            id: 'capacity-rules-management-link',
            order: 7
          });
        }

        return items;
      };

      vm.getConfigurationConfig = function() {
        var items = [];

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewTenants)) {
          items.push({
            label: $translate.instant('navbar.configuration.tenants.title'),
            stateLink: 'content.configuration.tenants',
            id: 'tenants-configuration-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewIntegrations)) {
          items.push({
            label: $translate.instant('navbar.configuration.integrations.title'),
            stateLink: 'content.configuration.integrations',
            id: 'integrations-configuration-link',
            order: 2
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllLists)) {
          items.push({
            label: $translate.instant('navbar.configuration.lists.title'),
            stateLink: 'content.configuration.genericLists',
            id: 'lists-configuration-link',
            order: 3
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewBusinessHours) || UserPermissions.hasPermissionInList(PermissionGroups.manageBusinessHours)) {
          items.push({
            label: $translate.instant('navbar.configuration.bh.title'),
            stateLink: 'content.configuration.hours',
            id: 'hours-configuration-link',
            order: 4
          });
        }

        // BEGIN OUTBOUND FEATURE FLAG...
        if (appFlags.OUTBOUND_PAGES) {
          if (UserPermissions.hasPermissionInList(PermissionGroups.viewCampaigns)) {
            items.push({
              label: $translate.instant('navbar.configuration.campaigns.title'),
              stateLink: 'content.configuration.campaigns',
              id: 'campaigns-configuration-link',
              order: 5
            });

            items.push({
              label: $translate.instant('navbar.configuration.dnc.title'),
              stateLink: 'content.configuration.dnc',
              id: 'dnc-configuration-link',
              order: 6
            });
          }
        }
        // ...END OUTBOUND FEATURE FLAG

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewAppCreds)) {
          items.push({
            label: $translate.instant('navbar.configuration.keys.title'),
            stateLink: 'content.configuration.keys',
            id: 'key-configuration-link',
            order: 7
          });
        }

        return items;
      };

      vm.getFlowsConfig = function() {
        var items = [];

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewFlows)) {
          items.push({
            label: $translate.instant('navbar.flows.title'),
            stateLink: 'content.flows.flowManagement',
            id: 'flow-management-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewDispositions)) {
          items.push({
            label: $translate.instant('navbar.flows.dispositions.title'),
            stateLink: 'content.flows.dispositions',
            id: 'dispositions-flows-link',
            order: 2
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewDispositions)) {
          items.push({
            label: $translate.instant('navbar.flows.dispositions.lists.title'),
            stateLink: 'content.flows.dispositionLists',
            id: 'disposition-lists-flows-link',
            order: 3
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewQueues)) {
          items.push({
            label: $translate.instant('navbar.flows.queues.title'),
            stateLink: 'content.flows.queues',
            id: 'queue-management-link',
            order: 4
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewMedia)) {
          items.push({
            label: $translate.instant('navbar.flows.media.title'),
            stateLink: 'content.flows.media',
            id: 'media-management-link',
            order: 5
          });

          // removing this for now as per product, since we are not
          // ready to handle Media Collections on the flow side yet
          // items.push({
          //   label: $translate.instant('navbar.flows.mediacollections.title'),
          //   stateLink: 'content.flows.media-collections',
          //   id: 'media-collection-management-link',
          //   order: 6
          // });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewDispatchMappings)) {
          items.push({
            label: $translate.instant('navbar.flows.dispatchmappings.title'),
            stateLink: 'content.flows.dispatchMappings',
            id: 'dispatch-mappings-configuration-link',
            order: 7
          });
        }

        return items;
      };

      vm.getReportingConfig = function() {
        var items = [];

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewDashboards)) {
          items.push({
            label: $translate.instant('navbar.reports.rtd.title'),
            stateLink: 'content.realtime-dashboards-management.viewer({dashboardId: "overview-dashboard"})',
            id: 'realtime-dashboard-link',
            order: 1
          });

          items.push({
            label: $translate.instant('navbar.reports.rtdCustom.title'),
            stateLink: 'content.realtime-dashboards-management',
            id: 'custom-realtime-dashboard-link',
            order: 2
          });

          // Grouping historical dashboards with realtime for now. Need to find out why there's no historical dashboards permissions
          items.push({
            label: $translate.instant('navbar.reports.hd.title'),
            stateLink: 'content.reports',
            stateLinkParams: {
              id: 'historical-dashboards'
            },
            id: 'reports-management-link',
            order: 3
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewRecordings)) {
          items.push({
            label: 'Recordings',
            stateLink: 'content.recordings',
            id: 'recording-management-link',
            order: 4
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewCustomStats)) {
          items.push({
            label: 'Custom Statistics',
            stateLink: 'content.reporting.custom-stats',
            id: 'custom-stats-link',
            order: 5
          });
        }

        return items;
      };

      $scope.updateTopbarConfig = function() {
        $scope.managementDropConfig = vm.getManagementConfig();
        $scope.configurationDropConfig = vm.getConfigurationConfig();
        $scope.flowsDropConfig = vm.getFlowsConfig();
        $scope.reportingDropConfig = vm.getReportingConfig();
      };

      $scope.updateTopbarConfig();
    }
  ]);
