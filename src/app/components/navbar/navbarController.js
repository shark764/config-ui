'use strict';

angular.module('liveopsConfigPanel').controller('NavbarController', [
  '$rootScope',
  '$scope',
  '$state',
  '$location',
  '$q',
  '$http',
  'apiHostname',
  'AuthService',
  'Session',
  'DirtyForms',
  '$translate',
  'UserPermissions',
  'PermissionGroups',
  '$window',
  'appFlags',
  'loEvents',
  'Branding',
  'CustomDomain',
  'Me',
  function(
    $rootScope,
    $scope,
    $state,
    $location,
    $q,
    $http,
    apiHostname,
    AuthService,
    Session,
    DirtyForms,
    $translate,
    UserPermissions,
    PermissionGroups,
    $window,
    appFlags,
    loEvents,
    Branding,
    CustomDomain,
    Me
  ) {
    var vm = this;
    $scope.hovering = false;
    $scope.Session = Session;
    $scope.showQualityManagemant = UserPermissions.hasPermissionInList(PermissionGroups.viewQualityManagement);
    $scope.hoverTracker = [];
    $scope.betaFeaturesByTenant = [];
    var MeSvc = new Me();

    var CustomDomainSvc = new CustomDomain();

    function isTenantSetForReadAllMode() {
      // Controls whether the active tenant in session is not one
      // of the active tenants for user in Session
      // If it's a different tenant, we hide React alpha and beta pages
      return _.find(Session.tenants, { tenantId: Session.tenant.tenantId }) === undefined;
    }

    // since sometimes the tenant data from the /me endpoint doesn't
    // give us data we need, this lets us get the corresponding
    // Session.tenant and vice-versa
    function getTenantData(tenantObj, tenantList) {
      if (tenantObj && angular.isObject(tenantObj)) {
        var tenants = tenantList || Session.tenants;
        return _.find(tenants, { tenantId: tenantObj.tenantId });
      }
    }

    function redirectToOnTenantSwitched() {
      var goTo = $state.current;
      var messageKey = '';
      if ($state.includes('content.realtime-dashboards-management-editor')) {
        goTo = 'content.custom-dashboards-management';
      } else if ($state.includes('content.flows.editor')) {
        goTo = 'content.flows.flowManagement';
      } else if (
        $state.includes('content.flows.dispatchMappings') ||
        $state.includes('content.flows.dispatchMappings2')
      ) {
        goTo = $scope.betaFeaturesByTenant[Session.tenant.tenantId].dispatchMappings
          ? 'content.flows.dispatchMappings2'
          : 'content.flows.dispatchMappings';
        messageKey = $scope.betaFeaturesByTenant[Session.tenant.tenantId].dispatchMappings
          ? 'permissions.betaFeatures.enabled.message'
          : 'permissions.betaFeatures.disabled.message';
      } else if ($state.includes('content.flows.flowManagement') || $state.includes('content.flows.flowManagement2')) {
        goTo = $scope.betaFeaturesByTenant[Session.tenant.tenantId].flows
          ? 'content.flows.flowManagement2'
          : 'content.flows.flowManagement';
        messageKey = $scope.betaFeaturesByTenant[Session.tenant.tenantId].flows
          ? 'permissions.betaFeatures.enabled.message'
          : 'permissions.betaFeatures.disabled.message';
      } else if ($state.includes('content.management.groups') || $state.includes('content.management.groups2')) {
        goTo = $scope.betaFeaturesByTenant[Session.tenant.tenantId].groups
          ? 'content.management.groups2'
          : 'content.management.groups';
        messageKey = $scope.betaFeaturesByTenant[Session.tenant.tenantId].groups
          ? 'permissions.betaFeatures.enabled.message'
          : 'permissions.betaFeatures.disabled.message';
      } else if ($state.includes('content.management.roles') || $state.includes('content.management.roles2')) {
        goTo = $scope.betaFeaturesByTenant[Session.tenant.tenantId].roles
          ? 'content.management.roles2'
          : 'content.management.roles';
        messageKey = $scope.betaFeaturesByTenant[Session.tenant.tenantId].roles
          ? 'permissions.betaFeatures.enabled.message'
          : 'permissions.betaFeatures.disabled.message';
      } else if ($state.includes('content.management.skills') || $state.includes('content.management.skills2')) {
        goTo = $scope.betaFeaturesByTenant[Session.tenant.tenantId].skills
          ? 'content.management.skills2'
          : 'content.management.skills';
        messageKey = $scope.betaFeaturesByTenant[Session.tenant.tenantId].skills
          ? 'permissions.betaFeatures.enabled.message'
          : 'permissions.betaFeatures.disabled.message';
      } else if ($state.includes('content.management.users') || $state.includes('content.management.users2')) {
        goTo = $scope.betaFeaturesByTenant[Session.tenant.tenantId].users
          ? 'content.management.users2'
          : 'content.management.users';
        messageKey = $scope.betaFeaturesByTenant[Session.tenant.tenantId].users
          ? 'permissions.betaFeatures.enabled.message'
          : 'permissions.betaFeatures.disabled.message';
      } else if (
        ($state.includes('content.configuration.outboundIdentifierLists') &&
          !$scope.betaFeaturesByTenant[Session.tenant.tenantId].outboundIdentifierLists) ||
        ($state.includes('content.configuration.outboundIdentifiers') &&
          !$scope.betaFeaturesByTenant[Session.tenant.tenantId].outboundIdentifiers)
      ) {
        goTo = $scope.betaFeaturesByTenant[Session.tenant.tenantId].users
          ? 'content.management.users2'
          : 'content.management.users';
        messageKey = 'permissions.unauthorized.message';
      }

      $state.go(
        goTo,
        {
          id: null,
          messageKey: messageKey
        },
        {
          reload: true,
          inherit: false
        }
      );
    }

    function switchTenant(targetSessionTenant) {
      Session.setTenant(targetSessionTenant);
      AuthService.updateDomain(targetSessionTenant);
      $scope.updateTopbarConfig();
      $scope.updateBranding();

      // Removing impersonate tenant data from sessionStorage
      // when switching between tenants
      sessionStorage.removeItem('LOGI-USER-IMPERSONATE');

      // Redirect user to correct page, based on
      // betaFeatures available for each tenant
      redirectToOnTenantSwitched();
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
      allTenants.$promise
        .then(function(allTenantsResponse) {
          if (allTenantsResponse.length > 0 && Session.tenants && Session.tenants.length) {
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

              if (!isCxTenant || (isCxTenant && targetTenant.password === false)) {
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
                        var monitoredInteraction = CxEngage.session.getMonitoredInteraction();
                        if (monitoredInteraction !== null) {
                          var confirmedToSwitchTenants = confirm(
                            $translate.instant('interactionMonitoring.confirmEnd')
                          );
                          if (confirmedToSwitchTenants) {
                            CxEngage.interactions.voice.resourceRemove(
                              { interactionId: monitoredInteraction },
                              function() {
                                switchTenant(targetSessionTenant);
                              }
                            );
                          }
                        } else {
                          switchTenant(targetSessionTenant);
                        }
                      } else {
                        $location.search('tenantid', targetTenant.tenantId);
                        Session.domain = '';
                        AuthService.setResumeSession(true);
                        $state.go('login', {
                          sso: targetTenant.password === false ? 'true' : null
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
        .then(function() {
          $scope.tenantDropdownItems = tenantDropdownItems;
        });
    };

    $scope.isActive = function(viewLocation) {
      return $state.current.name !== '' ? $location.url().indexOf(viewLocation) === 0 : false;
    };

    $scope.logout = function() {
      var monitoredInteraction = CxEngage.session.getMonitoredInteraction();
      if (monitoredInteraction !== null) {
        var confirmedToLogout = confirm($translate.instant('interactionMonitoring.confirmEnd.logout'));
        if (confirmedToLogout) {
          CxEngage.interactions.voice.resourceRemove({ interactionId: monitoredInteraction }, function() {
            setTimeout(function() {
              // Removing from current session key used for logi reports,
              // this will be removed automatically also if browser tab is closed
              sessionStorage.removeItem('LOGI-USER-IMPERSONATE');
              AuthService.logout();
              $state.transitionTo('login');
              $rootScope.$broadcast('logout');
              Session.token = null;
              // Reload ensure no saved state for the next session
              location.reload();
            }, 1000);
          });
        }
      } else {
        // Removing from current session key used for logi reports,
        // this will be removed automatically also if browser tab is closed
        sessionStorage.removeItem('LOGI-USER-IMPERSONATE');
        AuthService.logout();
        $state.transitionTo('login');
        $rootScope.$broadcast('logout');
        Session.token = null;
        location.reload();
      }
    };

    function getUserDropdownItems() {
      var items = [
        {
          label: $translate.instant('navbar.logout'),
          onClick: function() {
            $scope.logout();
          },
          iconClass: 'fa fa-sign-out'
        },
        {
          label: $translate.instant('navbar.profile'),
          onClick: function() {
            $state.transitionTo('content.userprofile');
          },
          iconClass: 'fa fa-gear'
        }
      ];

      if (UserPermissions.hasPermissionInList(PermissionGroups.betaFeatures) && !isTenantSetForReadAllMode()) {
        items.push({
          label: ' Beta Features',
          onClick: function() {
            $state.transitionTo('content.beta');
          },
          iconClass: 'fa fa-exclamation'
        });
      }

      return items;
    }

    $scope.userDropdownItems = getUserDropdownItems();

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
    $scope.checkedForBetaFeatures = false;
    $scope.brandingIsSet = false;

    $rootScope.$on(loEvents.session.tenants.updated, function() {
      $scope.updateTopbarConfig();
    });

    $scope.populateTenantsHandler();
    Session.betaFeatures = {};
    for (var i = 0; i < Session.tenants.length; i++) {
      getBetaFeaturesForEachTenant(Session.tenants[i].tenantId);
    }

    function getBetaFeaturesForEachTenant(activeTenantId) {
      $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + activeTenantId + '/settings/betaFeatures/value',
        headers: {
          Authorization: 'Token ' + Session.token
        }
      })
        .then(function(data) {
          // We need to store all betaFeatures preferences for all active tenants
          // So when changing to another tenant, we can redirect user to correct pages
          $scope.betaFeaturesByTenant[activeTenantId] = data.data.result;

          // We just reload all menu for the current tenant
          if (activeTenantId === Session.tenant.tenantId) {
            Session.betaFeatures = data.data.result;
            $scope.checkedForBetaFeatures = true;

            vm.getManagementConfig = function() {
              var items = [];
              var isActiveExternalTenant = isTenantSetForReadAllMode();

              //Note: see TITAN2-5445 for why VIEW_ALL_USERS permission on its own is not sufficient
              if (
                (UserPermissions.hasPermissionInList(PermissionGroups.viewUsers) &&
                  UserPermissions.hasPermissionInList(PermissionGroups.manageUserSkillsAndGroups)) ||
                UserPermissions.hasPermissionInList(PermissionGroups.manageUsers)
              ) {
                items.push({
                  label: $translate.instant('navbar.management.users.title'),
                  stateLink:
                    Session.betaFeatures.users && !isActiveExternalTenant
                      ? 'content.management.users2'
                      : 'content.management.users',
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

              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewReasons) &&
                $location.search()['alpha'] &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.management.reasons.title') + ' (Alpha UAT)  ',
                  stateLink: 'content.management.reasons2',
                  id: 'reasons-management-link2'
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
                  stateLink:
                    Session.betaFeatures.roles && !isActiveExternalTenant
                      ? 'content.management.roles2'
                      : 'content.management.roles',
                  id: 'role-management-link',
                  order: 4
                });
              }

              //See TITAN2-6199 for why we do this extra check
              if (
                UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
                UserPermissions.hasPermissionInList(PermissionGroups.manageSkills)
              ) {
                items.push({
                  label: $translate.instant('navbar.management.skills.title'),
                  stateLink:
                    Session.betaFeatures.skills && !isActiveExternalTenant
                      ? 'content.management.skills2'
                      : 'content.management.skills',
                  id: 'skill-management-link',
                  order: 5
                });
              }

              //See TITAN2-6199 for why we do this extra check
              if (
                UserPermissions.hasPermissionInList(PermissionGroups.manageAllMedia) &&
                UserPermissions.hasPermissionInList(PermissionGroups.manageGroups)
              ) {
                items.push({
                  label: $translate.instant('navbar.management.groups.title'),
                  stateLink:
                    Session.betaFeatures.groups && !isActiveExternalTenant
                      ? 'content.management.groups2'
                      : 'content.management.groups',
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

              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewReasonLists) &&
                $location.search()['alpha'] &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.management.reasons.lists.title') + ' (Alpha UAT)  ',
                  stateLink: 'content.management.reasonLists2',
                  id: 'reason-lists-management-link2'
                });
              }

              return items;
            };

            vm.getConfigurationConfig = function() {
              var items = [];
              var isActiveExternalTenant = isTenantSetForReadAllMode();

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

              if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllLists) && !isActiveExternalTenant) {
                items.push({
                  label: $translate.instant('navbar.configuration.lists.title'),
                  stateLink: 'content.configuration.genericLists',
                  id: 'lists-configuration-link',
                  order: 4
                });
              }

              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewBusinessHours) ||
                UserPermissions.hasPermissionInList(PermissionGroups.manageBusinessHours)
              ) {
                items.push({
                  label: $translate.instant('navbar.configuration.bh.title'),
                  stateLink: 'content.configuration.hours',
                  id: 'hours-configuration-link',
                  order: 5
                });
              }

              if (UserPermissions.hasPermissionInList(PermissionGroups.viewCustomStats) && !isActiveExternalTenant) {
                items.push({
                  label: $translate.instant('navbar.configuration.slas.title'),
                  stateLink: 'content.configuration.slas',
                  id: 'slas-configuration-link',
                  order: 6
                });
              }

              if (UserPermissions.hasPermissionInList(PermissionGroups.viewAppCreds)) {
                items.push({
                  label: $translate.instant('navbar.configuration.keys.title'),
                  stateLink: 'content.configuration.keys',
                  id: 'key-configuration-link',
                  order: 7
                });
              }

              if (UserPermissions.hasPermission('VIEW_ALL_TRANSFER_LISTS')) {
                items.push({
                  label: $translate.instant('navbar.configuration.transferLists.title'),
                  stateLink: 'content.configuration.transferLists',
                  id: 'transferList-configuration-link',
                  order: 8
                });
              }

              if (
                UserPermissions.hasPermission('VIEW_ALL_TRANSFER_LISTS') &&
                $location.search()['alpha'] &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.configuration.transferLists.title') + ' (alpha)',
                  stateLink: 'content.configuration.transferLists2',
                  id: 'transferList-configuration-link',
                  order: 16
                });
              }

              if (UserPermissions.hasPermissionInList(PermissionGroups.viewMessageTemplates)) {
                items.push({
                  label: $translate.instant('navbar.configuration.messageTemplates.title'),
                  stateLink: 'content.configuration.messageTemplates',
                  id: 'template-configuration-link',
                  order: 9
                });
              }

              if (
                UserPermissions.hasPermissionInList(PermissionGroups.accessAllEmailTemplates && !isActiveExternalTenant)
              ) {
                items.push({
                  label: $translate.instant('navbar.configuration.emailTemplates.title'),
                  stateLink: 'content.configuration.emailTemplates',
                  id: 'emailTemplates-configuration-link',
                  order: 10
                });
              }
              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewOutboundIdentifiers) &&
                Session.betaFeatures.outboundIdentifiers &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.configuration.outboundIdentifiers.title'),
                  stateLink: 'content.configuration.outboundIdentifiers',
                  id: 'outboundIdentifiers-configuration-link',
                  order: 11
                });
              }

              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewOutboundIdentifiers) &&
                Session.betaFeatures.outboundIdentifierLists &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.configuration.outboundIdentifierLists.title'),
                  stateLink: 'content.configuration.outboundIdentifierLists',
                  id: 'outboundIdentifierLists-configuration-link',
                  order: 12
                });
              }

              if (
                UserPermissions.hasPermissionInList(PermissionGroups.accessAllEmailTemplates) &&
                $location.search()['alpha'] &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.configuration.chatWidgets.title'),
                  stateLink: 'content.configuration.chatWidgets',
                  id: 'chatWidgets-configuration-link',
                  order: 13
                });
              }

              if (appFlags.CONTACT_MANAGEMENT) {
                if (UserPermissions.hasPermissionInList(PermissionGroups.viewContactAttributes)) {
                  items.push({
                    label: $translate.instant('navbar.configuration.contactAttributes.title'),
                    stateLink: 'content.configuration.contactAttributes',
                    id: 'contact-attributes-configuration-link',
                    order: 14
                  });
                }

                if (UserPermissions.hasPermissionInList(PermissionGroups.viewContactLayouts)) {
                  items.push({
                    label: $translate.instant('navbar.configuration.contactLayouts.title'),
                    stateLink: 'content.configuration.contactLayouts',
                    id: 'contact-layouts-configuration-link',
                    order: 15
                  });
                }
              }

              return items;
            };

            vm.getFlowsConfig = function() {
              var items = [];
              var isActiveExternalTenant = isTenantSetForReadAllMode();

              if (UserPermissions.hasPermissionInList(PermissionGroups.viewFlows)) {
                items.push({
                  label: $translate.instant('navbar.flows.title'),
                  stateLink:
                    Session.betaFeatures.flows && !isActiveExternalTenant
                      ? 'content.flows.flowManagement2'
                      : 'content.flows.flowManagement',
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
              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewQueues) &&
                $location.search()['alpha'] &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.flows.queues.title') + ' (Alpha)',
                  stateLink: 'content.flows.queues2',
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
                  stateLink:
                    Session.betaFeatures.dispatchMappings && !isActiveExternalTenant
                      ? 'content.flows.dispatchMappings2'
                      : 'content.flows.dispatchMappings',
                  id: 'dispatch-mappings-configuration-link',
                  order: 7
                });
              }

              return items;
            };

            vm.getReportingConfig = function() {
              var items = [];
              var isActiveExternalTenant = isTenantSetForReadAllMode();

              if (UserPermissions.hasPermissionInList(PermissionGroups.viewAssignedReports)) {
                items.push({
                  label: $translate.instant('navbar.reports.rtd.title'),
                  stateLink: 'content.realtime-dashboards-management-viewer({dashboardId: "overview-dashboard"})',
                  id: 'realtime-dashboard-link',
                  order: 1
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

              if (UserPermissions.hasPermissionInList(PermissionGroups.viewDashboards)) {
                items.push({
                  label: $translate.instant('navbar.reports.rtdCustom.title'),
                  stateLink: 'content.custom-dashboards-management',
                  id: 'custom-realtime-dashboard-link',
                  order: 2
                });

                if (UserPermissions.hasPermissionInList(PermissionGroups.viewCustomStats) && !isActiveExternalTenant) {
                  items.push({
                    label: $translate.instant('navbar.configuration.dataAccessReports.title'),
                    stateLink: 'content.configuration.dataAccessReports',
                    id: 'dataAccessReports-configuration-link',
                    order: 4
                  });
                }
              }

              if (UserPermissions.hasPermissionInList(PermissionGroups.viewInteractionMonitoring)) {
                items.push({
                  label: $translate.instant('navbar.reports.silentMonitoring.title'),
                  stateLink: 'content.reporting.silentMonitoring',
                  id: 'silent-monitoring-link',
                  order: 6
                });
              }
              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewInteractionMonitoring) &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: $translate.instant('navbar.reports.interactionMonitoring.title'),
                  stateLink: 'content.reporting.interactionMonitoring',
                  id: 'interaction-monitoring-link',
                  order: 7
                });
              }

              // //////////////////////////////////////////
              // LOGI Reports
              // //////////////////////////////////////////
              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewConfigReportingBI) &&
                Session.betaFeatures.logiStandard &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: '(Beta) ' + $translate.instant('navbar.reports.logi.standard.title'),
                  stateLink: 'content.reporting.logiStandard',
                  id: 'logi-standard-reports-link',
                  order: 8
                });
              }
              if (
                UserPermissions.hasPermissionInList(PermissionGroups.viewConfigReportingBI) &&
                Session.betaFeatures.logiAdvanced &&
                !isActiveExternalTenant
              ) {
                items.push({
                  label: '(Beta) ' + $translate.instant('navbar.reports.logi.advanced.title'),
                  stateLink: 'content.reporting.logiAdvanced',
                  id: 'logi-advanced-reports-link',
                  order: 9
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
              $scope.userDropdownItems = getUserDropdownItems();
            };

            $scope.updateBranding = function() {
              Branding.get(
                {
                  tenantId: Session.tenant.tenantId
                },
                function(response) {
                  if (response.active) {
                    Branding.set(response);
                    $scope.brandingIsSet = true;
                  }
                },
                function() {
                  Branding.set({});
                  $scope.brandingIsSet = true;
                }
              );
            };

            $scope.updateBranding();
            $scope.updateTopbarConfig();
          }
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }
]);
