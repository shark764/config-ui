'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session', 'DirtyForms', '$translate', 'UserPermissions',
    function ($rootScope, $scope, $state, AuthService, Session, DirtyForms, $translate, UserPermissions) {
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
              DirtyForms.confirmIfDirty(function () {
                Session.setTenant(tenant);

              });
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

      var managementConfig = [];
      //Note: see TITAN2-5445 for why VIEW_ALL_USERS permission on its own is not sufficient
      if ((UserPermissions.hasPermission('VIEW_ALL_USERS') && UserPermissions.hasPermissionInList(['MANAGE_ALL_GROUPS', 'MANAGE_ALL_SKILLS'])) ||
          UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])){
        managementConfig.push({
          label: 'Users',
          stateLink: 'content.management.users',
          id: 'user-management-link',
          order: 1
        });
      }

      if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'PLATFORM_CREATE_TENANT_ROLES', 'VIEW_ALL_ROLES', 'MANAGE_ALL_ROLES', 'MANAGE_TENANT_ENROLLMENT'])) {
        managementConfig.push({
          label: 'Roles',
          stateLink: 'content.management.roles',
          id: 'role-management-link',
          order: 2
        });
      }

      if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_SKILLS', 'MANAGE_ALL_SKILLS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_TENANT_ENROLLMENT'])) {
        managementConfig.push({
          label: 'Skills',
          stateLink: 'content.management.skills',
          id: 'skill-management-link',
          order: 3
        });
      }

      if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_GROUPS', 'MANAGE_ALL_GROUPS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_GROUP_OWNERS', 'MANAGE_TENANT_ENROLLMENT'])) {
        managementConfig.push({
          label: 'Groups',
          stateLink: 'content.management.groups',
          id: 'group-management-link',
          order: 4
        });
      }

      if (managementConfig.length > 0) {
        $scope.managementDropConfig = managementConfig;
      }

      var configurationConfig = [];
      if (UserPermissions.hasPermissionInList(['PLATFORM_VIEW_ALL_TENANTS', 'PLATFORM_MANAGE_ALL_TENANTS', 'PLATFORM_CREATE_ALL_TENANTS', 'PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_TENANT'])) {
        configurationConfig.push({
          label: 'Tenants',
          stateLink: 'content.configuration.tenants',
          id: 'tenants-configuration-link',
          order: 1
        });
      }

      if (UserPermissions.hasPermissionInList(['VIEW_ALL_PROVIDERS', 'MANAGE_ALL_PROVIDERS'])) {
        configurationConfig.push({
          label: 'Integrations',
          stateLink: 'content.configuration.integrations',
          id: 'integrations-configuration-link',
          order: 2
        });
      }

      if (UserPermissions.hasPermission('MANAGE_ALL_LISTS')){
        configurationConfig.push({
          label: 'Lists',
          stateLink: 'content.configuration.genericLists',
          id: 'lists-configuration-link',
          order: 3
        });
      } 

      if (configurationConfig.length > 0) {
        $scope.configurationDropConfig = configurationConfig;
      }

      var flowsConfig = [];
      if (UserPermissions.hasPermissionInList(['VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS', 'MAP_ALL_CONTACT_POINTS'])) {
        flowsConfig.push({
          label: 'Flows',
          stateLink: 'content.flows.flowManagement',
          id: 'flow-management-link',
          order: 1
        });
      }

      if (UserPermissions.hasPermissionInList(['VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS', 'MANAGE_ALL_QUEUES'])) {
        flowsConfig.push({
          label: 'Queues',
          stateLink: 'content.flows.queues',
          id: 'queue-management-link',
          order: 2
        });
      }

      if (UserPermissions.hasPermissionInList(['VIEW_ALL_MEDIA', 'VIEW_ALL_FLOWS', 'MANAGE_ALL_FLOWS'])) {
        flowsConfig.push({
          label: 'Media Collections',
          stateLink: 'content.flows.media-collections',
          id: 'media-collection-management-link',
          order: 3
        });

        flowsConfig.push({
          label: 'Media',
          stateLink: 'content.flows.media',
          id: 'media-management-link',
          order: 4
        });
      }

      if (UserPermissions.hasPermissionInList(['VIEW_ALL_CONTACT_POINTS', 'MAP_ALL_CONTACT_POINTS'])) {
        flowsConfig.push({
          label: 'Dispatch Mappings',
          stateLink: 'content.flows.dispatchMappings',
          id: 'dispatch-mappings-configuration-link',
          order: 5
        });
      }

      if (flowsConfig.length > 0) {
        $scope.flowsDropConfig = flowsConfig;
      }

      $scope.reportingDropConfig = [{
          label: 'Historical Dashboards',
          stateLink: 'content.reports',
          stateLinkParams: {
            id: 'historical-dashboards'
          },
          id: 'reports-management-link',
          order: 1
        }

        // TODO: This is coming out for this release as they are only giving access to dashboards for this Beta.
        //    Will be adding back in once we move forward with data access restrictions.

        /*, {
          label: 'Reporting Designer',
          onClick: function(){$state.transitionTo('content.reports', {id: 'reporting-designer'});},
          id: 'reports-management-link',
          order: 2
        }, {
          label: 'Chart Designer',
          onClick: function(){$state.transitionTo('content.reports', {id: 'chart-designer'});},
          id: 'reports-management-link',
          order: 3
        }*/
      ];
    }
  ]);
