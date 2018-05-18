'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', '$location', '$q', 'AuthService', 'Session', 'DirtyForms', '$translate', 'UserPermissions', 'PermissionGroups', '$window', 'appFlags', 'loEvents', 'Branding', 'CustomDomain', 'Me',
    function($rootScope, $scope, $state, $location, $q, AuthService, Session, DirtyForms, $translate, UserPermissions, PermissionGroups, $window, appFlags, loEvents, Branding, CustomDomain, Me) {
      var vm = this;
      $scope.hovering = false;
      $scope.Session = Session;
      $scope.showQualityManagemant = window.location.href.toLowerCase().indexOf('qualitymanagement=true') !== -1;
      $scope.hoverTracker = [];
      var MeSvc = new Me();

      var CustomDomainSvc = new CustomDomain();

      // since sometimes the tenant data from the /me endpoint doesn't
      // give us data we need, this lets us get the corresponding
      // Session.tenant and vice-versa
      function getTenantData (tenantObj, tenantList) {
        if (
          tenantObj &&
          angular.isObject(tenantObj)
        ) {
          var tenants = tenantList || Session.tenants;
          return  _.find(tenants, { tenantId: tenantObj.tenantId });
        }
      }

      $scope.populateTenantsHandler = function() {
        if (!Session.isAuthenticated()) {
          return;
        }
        var tenantDropdownItems = [];

        var currentSessionTenant = _.find(Session.tenants, { tenantId: Session.tenant.tenantId });

        if (
          !Session.tenant ||
          !Session.tenant.tenantId ||
          (currentSessionTenant && currentSessionTenant.tenantActive === false)
        ) {
          // reset to the first tenant in the list
          Session.setTenant(Session.tenants[0]);
        }

        var allTenants = Me.cachedQuery(null, 'Me', true);
        allTenants.$promise.then(function (allTenantsResponse) {
          if (
            allTenantsResponse.length > 0 &&
            Session.tenants &&
            Session.tenants.length
          ) {
            // with only the Session tenant data as a reference, get
            // the tenant data from the /me endpoint
            var currentMeTenant = getTenantData(Session.tenant, allTenantsResponse);
            // here we set a globally-available flag to tell config-ui whether or
            // not the current tenant has a CxEngageIdp (used for UI changes ATM)
            MeSvc.setHasCxEngageIdp(currentMeTenant);

            angular.forEach(allTenantsResponse, function(targetTenant) {
              // with only the /me tenant data as a reference,
              // get the tenant data from the Session
              var targetSessionTenant = getTenantData(targetTenant);

              var isCxTenant =
                targetSessionTenant &&
                targetTenant.password !== false &&
                (currentMeTenant && currentMeTenant.password !== false);

              var className;
              var iconClass;
              var title;

              if (
                !isCxTenant ||
                (isCxTenant && targetTenant.password === false)
              ) {
                className = 'unavailableTenant';
                iconClass = 'fa fa-sign-in';
                title = $translate.instant('title.text.explain');
              }
              if (Session.tenant.tenantId !== targetTenant.tenantId) {
                // filter out any tenants that have a tenantActive prop set to false
                tenantDropdownItems.push({
                  label: targetTenant.name,
                  className: className,
                  iconClass: iconClass,
                  title: title,
                  onClick: function() {
                    DirtyForms.confirmIfDirty(function() {
                      // Make sure that we only switch without forcing re-auth
                      // if we are switching from one *CxEngage* IDP to another.
                      // (CxEngage IDP's always have a password prop set to true)
                      if (isCxTenant) {
                        Session.setTenant(targetSessionTenant);
                        $scope.updateTopbarConfig();
                        $scope.updateBranding();
                        var goTo = $state.current;
                        if($state.includes('content.realtime-dashboards-management-editor')) {
                          goTo = 'content.custom-dashboards-management';
                        } else if ($state.includes('content.flows.editor')){
                          goTo = 'content.flows.flowManagement';
                        }
                        $state.go(goTo, {
                          id: null
                        }, {
                          reload: true,
                          inherit: false
                        });
                      } else {
                        AuthService.setResumeSession(true);
                        $state.go('login', {
                          sso: targetTenant.password === false ? 'isSso' : null
                        });
                        $state.params.tenantId = targetTenant.tenantId;
                      }
                    });
                  }
                });
              }
            });
          }
        })
        .then(function () {
          $scope.tenantDropdownItems = tenantDropdownItems;
        });
      };

      $scope.isActive = function(viewLocation) {
        return $state.current.name !== '' ? $location.url().indexOf(viewLocation) === 0 : false;
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
            var url = CustomDomainSvc.getHelpURL('/Help/Content/Home.htm');
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

      $rootScope.$on(loEvents.session.tenants.updated, $scope.populateTenantsHandler);

      $scope.$on('resource:create', $scope.onCreateClick);
      $scope.$on('resource:actions', $scope.onActionsClick);
      $rootScope.$on('readAllMode', function() {
        $scope.updateTopbarConfig();
      });

      $scope.populateTenantsHandler();

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

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewIdentityProviders)) {
          items.push({
            label: $translate.instant('navbar.configuration.tenants.identityProviders'),
            stateLink: 'content.configuration.identityProviders',
            id: 'identity-providers-configuration-link',
            order: 2
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewIntegrations)) {
          items.push({
            label: $translate.instant('navbar.configuration.integrations.title'),
            stateLink: 'content.configuration.integrations',
            id: 'integrations-configuration-link',
            order: 3
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllLists)) {
          items.push({
            label: $translate.instant('navbar.configuration.lists.title'),
            stateLink: 'content.configuration.genericLists',
            id: 'lists-configuration-link',
            order: 4
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewBusinessHours) || UserPermissions.hasPermissionInList(PermissionGroups.manageBusinessHours)) {
          items.push({
            label: $translate.instant('navbar.configuration.bh.title'),
            stateLink: 'content.configuration.hours',
            id: 'hours-configuration-link',
            order: 5
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewAppCreds)) {
          items.push({
            label: $translate.instant('navbar.configuration.keys.title'),
            stateLink: 'content.configuration.keys',
            id: 'key-configuration-link',
            order: 6
          });
        }

        if (UserPermissions.hasPermission('VIEW_ALL_TRANSFER_LISTS')) {
          items.push({
            label: $translate.instant('navbar.configuration.transferLists.title'),
            stateLink: 'content.configuration.transferLists',
            id: 'transferList-configuration-link',
            order: 7
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewMessageTemplates)) {
          items.push({
            label: $translate.instant('navbar.configuration.messageTemplates.title'),
            stateLink: 'content.configuration.messageTemplates',
            id: 'template-configuration-link',
            order: 8
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllEmailTemplates)) {
          items.push({
            label: $translate.instant('navbar.configuration.emailTemplates.title'),
            stateLink: 'content.configuration.emailTemplates',
            id: 'emailTemplates-configuration-link',
            order: 9
          });
        }

        if (appFlags.CONTACT_MANAGEMENT) {
          if (UserPermissions.hasPermissionInList(PermissionGroups.viewContactAttributes)) {
            items.push({
              label: $translate.instant('navbar.configuration.contactAttributes.title'),
              stateLink: 'content.configuration.contactAttributes',
              id: 'contact-attributes-configuration-link',
              order: 10
            });
          }

          if (UserPermissions.hasPermissionInList(PermissionGroups.viewContactLayouts)) {
            items.push({
              label: $translate.instant('navbar.configuration.contactLayouts.title'),
              stateLink: 'content.configuration.contactLayouts',
              id: 'contact-layouts-configuration-link',
              order: 11
            });
          }
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
            stateLink: 'content.realtime-dashboards-management-viewer({dashboardId: "overview-dashboard"})',
            id: 'realtime-dashboard-link',
            order: 1
          });

          items.push({
            label: $translate.instant('navbar.reports.rtdCustom.title'),
            stateLink: 'content.custom-dashboards-management',
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

          if (appFlags.LOGI) {
            items.push({
              label: 'Logi Dashboards',
              stateLink: 'content.logi',
              id: 'logi-link',
              order: 4
            });
          }

          items.push({
            label: $translate.instant('navbar.reports.silentMonitoring.title'),
            stateLink: 'content.reporting.silentMonitoring',
            id: 'silent-monitoring-link',
            order: 5
          });
        }

        // commenting this out as per CXV1-13276, which specifies
        // this option should be hidden, and not necessarily deleted
        // if (UserPermissions.hasPermissionInList(PermissionGroups.viewCustomStats)) {
        //   items.push({
        //     label: 'Custom Statistics',
        //     stateLink: 'content.reporting.custom-stats',
        //     id: 'custom-stats-link',
        //     order: 5
        //   });
        // }

        return items;
      };

      $scope.updateTopbarConfig = function() {
        $scope.managementDropConfig = vm.getManagementConfig();
        $scope.configurationDropConfig = vm.getConfigurationConfig();
        $scope.flowsDropConfig = vm.getFlowsConfig();
        $scope.reportingDropConfig = vm.getReportingConfig();
      };

      $scope.updateBranding = function() {
        Branding.get({
          tenantId: Session.tenant.tenantId
        }, function(response){
          if (response.active) {
            Branding.set(response);
          }
        }, function(){
          Branding.set({});
        });
      };

      $scope.updateBranding();
      $scope.updateTopbarConfig();
    }
  ]);
