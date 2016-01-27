'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session', 'DirtyForms', '$translate', 'UserPermissions', 'PermissionGroups',
    function($rootScope, $scope, $state, AuthService, Session, DirtyForms, $translate, UserPermissions, PermissionGroups) {
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
                  vm.updateTopbarConfig();
                  $state.go($state.current, {
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

      $scope.$on('resource:create', $scope.onCreateClick);
      $scope.$on('resource:actions', $scope.onActionsClick);
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

        if (UserPermissions.hasPermissionInList(PermissionGroups.manageRoles)) {
          items.push({
            label: $translate.instant('navbar.management.roles.title'),
            stateLink: 'content.management.roles',
            id: 'role-management-link',
            order: 2
          });
        }

        //See TITAN2-6199 for why we do this extra check
        if (UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
          UserPermissions.hasPermissionInList(PermissionGroups.manageSkills)) {
          items.push({
            label: $translate.instant('navbar.management.skills.title'),
            stateLink: 'content.management.skills',
            id: 'skill-management-link',
            order: 3
          });
        }

        //See TITAN2-6199 for why we do this extra check
        if (UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
          UserPermissions.hasPermissionInList(PermissionGroups.manageGroups)) {
          items.push({
            label: $translate.instant('navbar.management.groups.title'),
            stateLink: 'content.management.groups',
            id: 'group-management-link',
            order: 4
          });
        }

        return items;
      };

      vm.getConfigurationConfig = function() {
        var items = [];

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessTenants)) {
          items.push({
            label: $translate.instant('navbar.configuration.tenants.title'),
            stateLink: 'content.configuration.tenants',
            id: 'tenants-configuration-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllIntegrations)) {
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

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllBusinessHours)) {
          items.push({
            label: $translate.instant('navbar.configuration.bh.title'),
            stateLink: 'content.configuration.hours',
            id: 'hours-configuration-link',
            order: 4
          });
        }

        return items;
      };

      vm.getFlowsConfig = function() {
        var items = [];

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllFlows)) {
          items.push({
            label: $translate.instant('navbar.flows.title'),
            stateLink: 'content.flows.flowManagement',
            id: 'flow-management-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllQueues)) {
          items.push({
            label: $translate.instant('navbar.flows.queues.title'),
            stateLink: 'content.flows.queues',
            id: 'queue-management-link',
            order: 2
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllMedia)) {
          items.push({
            label: $translate.instant('navbar.flows.mediacollections.title'),
            stateLink: 'content.flows.media-collections',
            id: 'media-collection-management-link',
            order: 3
          });

          items.push({
            label: $translate.instant('navbar.flows.media.title'),
            stateLink: 'content.flows.media',
            id: 'media-management-link',
            order: 4
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllDispatchMappings)) {
          items.push({
            label: $translate.instant('navbar.flows.dispatchmappings.title'),
            stateLink: 'content.flows.dispatchMappings',
            id: 'dispatch-mappings-configuration-link',
            order: 5
          });
        }

        return items;
      };

      vm.getReportingConfig = function() {
        return [{
          label: $translate.instant('navbar.reports.rtd.title'),
          stateLink: 'content.realtime-dashboards-management',
          id: 'realtime-dashboard-link',
          order: 1
        }, {
          label: 'Recordings',
          stateLink: 'content.reports.recordings',
          id: 'recording-management-link',
          order: 2
        }];
      };

      vm.updateTopbarConfig = function() {
        $scope.managementDropConfig = vm.getManagementConfig();
        $scope.configurationDropConfig = vm.getConfigurationConfig();
        $scope.flowsDropConfig = vm.getFlowsConfig();
        $scope.reportingDropConfig = vm.getReportingConfig();
      };

      vm.updateTopbarConfig();
    }
  ]);
