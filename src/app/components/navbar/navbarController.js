'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session', 'DirtyForms', '$translate', 'UserPermissions', 'queryCache',  'PermissionGroups',
    function ($rootScope, $scope, $state, AuthService, Session, DirtyForms, $translate, UserPermissions, queryCache, PermissionGroups) {
      var vm = this;

      $scope.hovering = false;

      $scope.Session = Session;

      $scope.populateTenantsHandler = function () {
        if (!Session.isAuthenticated()) {
          return;
        }

        if (!Session.tenant.tenantId && Session.tenants && Session.tenants.length) {
          Session.setTenant(Session.tenants[0]);
        }

        var tenantDropdownItems = [];
        angular.forEach(Session.tenants, function (tenant) {
          tenantDropdownItems.push({
            label: tenant.tenantName,
            onClick: function () {
              if(!Session.tenant || tenant.tenantId !== Session.tenant.tenantId) {
                DirtyForms.confirmIfDirty(function () {
                  Session.setTenant(tenant);
                  vm.updateTopbarConfig();
                  queryCache.removeAll();
                  $state.go($state.current, {id: null}, {reload: true, inherit: false });
                });
              }
            }
          });
        });

        $scope.tenantDropdownItems = tenantDropdownItems;
      };

      $scope.hoverTracker = [];

      $scope.isActive = function (viewLocation) {
        return $state.current.name !== '' ? $state.href($state.current.name).indexOf(viewLocation) === 1 : false;
      };

      $scope.logout = function () {
        AuthService.logout();
        $state.transitionTo('login');
        $rootScope.$broadcast('logout');
      };

      $scope.userDropdownItems = [{
        label: $translate.instant('navbar.logout'),
        onClick: function () {
          $scope.logout();
        },
        iconClass: 'fa fa-sign-out'
      }, {
        label: $translate.instant('navbar.profile'),
        onClick: function () {
          $state.transitionTo('content.userprofile');
        },
        iconClass: 'fa fa-gear'
      }];

      $scope.$on('resource:create', $scope.onCreateClick);
      $scope.$on('resource:actions', $scope.onActionsClick);
      $scope.$watch('Session.tenants', $scope.populateTenantsHandler);

      vm.getManagementConfig = function () {

        var items = [];

        //Note: see TITAN2-5445 for why VIEW_ALL_USERS permission on its own is not sufficient
        if ((UserPermissions.hasPermissionInList(PermissionGroups.viewUsers) && UserPermissions.hasPermissionInList(PermissionGroups.manageUserSkillsAndGroups)) ||
            UserPermissions.hasPermissionInList(PermissionGroups.manageUsers)){
          items.push({
            label: 'Users',
            stateLink: 'content.management.users',
            id: 'user-management-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.manageRoles)) {
          items.push({
            label: 'Roles',
            stateLink: 'content.management.roles',
            id: 'role-management-link',
            order: 2
          });
        }

        //See TITAN2-6199 for why we do this extra check
        if (UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
        UserPermissions.hasPermissionInList(PermissionGroups.manageMedia)) {
          items.push({
            label: 'Skills',
            stateLink: 'content.management.skills',
            id: 'skill-management-link',
            order: 3
          });
        }

        //See TITAN2-6199 for why we do this extra check
        if (UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
          UserPermissions.hasPermissionInList(PermissionGroups.manageGroups)) {
          items.push({
            label: 'Groups',
            stateLink: 'content.management.groups',
            id: 'group-management-link',
            order: 4
          });
        }

        return items;
      };

      vm.getConfigurationConfig = function () {
        var items = [];

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllTenants)) {
          items.push({
            label: 'Tenants',
            stateLink: 'content.configuration.tenants',
            id: 'tenants-configuration-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllIntegrations)) {
          items.push({
            label: 'Integrations',
            stateLink: 'content.configuration.integrations',
            id: 'integrations-configuration-link',
            order: 2
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllLists)){
          items.push({
            label: 'Lists',
            stateLink: 'content.configuration.genericLists',
            id: 'lists-configuration-link',
            order: 3
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllBusinessHours)){
          items.push({
            label: 'Business Hours',
            stateLink: 'content.configuration.hours',
            id: 'hours-configuration-link',
            order: 4
          });
        }

        return items;
      };

      vm.getFlowsConfig = function () {
        var items = [];

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllFlows)) {
          items.push({
            label: 'Flows',
            stateLink: 'content.flows.flowManagement',
            id: 'flow-management-link',
            order: 1
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllQueues)) {
          items.push({
            label: 'Queues',
            stateLink: 'content.flows.queues',
            id: 'queue-management-link',
            order: 2
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllMedia)) {
          items.push({
            label: 'Media Collections',
            stateLink: 'content.flows.media-collections',
            id: 'media-collection-management-link',
            order: 3
          });

          items.push({
            label: 'Media',
            stateLink: 'content.flows.media',
            id: 'media-management-link',
            order: 4
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accsessAllDispatchMappings)) {
          items.push({
            label: 'Dispatch Mappings',
            stateLink: 'content.flows.dispatchMappings',
            id: 'dispatch-mappings-configuration-link',
            order: 5
          });
        }

        return items;
      };

      vm.getReportingConfig = function () {
        return [{
            label: 'Historical Dashboards',
            stateLink: 'content.reports',
            stateLinkParams: {
              id: 'historical-dashboards'
            },
            id: 'reports-management-link',
            order: 1
          },  {
            label: 'Realtime Dashboards',
            stateLink: 'content.realtime-dashboards',
            id: 'realtime-dashboard-link',
            order: 2
          }
        ];
      };

      vm.updateTopbarConfig = function () {
        $scope.managementDropConfig = vm.getManagementConfig();
        $scope.configurationDropConfig = vm.getConfigurationConfig();
        $scope.flowsDropConfig = vm.getFlowsConfig();
        $scope.reportingDropConfig = vm.getReportingConfig();
      };

      vm.updateTopbarConfig();
    }
  ]);
