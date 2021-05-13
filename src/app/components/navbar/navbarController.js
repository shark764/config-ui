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
    $scope.hoverTracker = [];
    $scope.currentTenantNavbarConfig = null;
    var MeSvc = new Me();

    const checkSessionTenantId = Session.tenant.tenantId !== "";

    if (checkSessionTenantId) {
        $scope.showQualityManagemant = UserPermissions.hasPermissionInList(PermissionGroups.viewQualityManagement);
        $scope.showSupportTool = UserPermissions.hasPermissionInList(PermissionGroups.viewConfigSupport);
    }

    if (checkSessionTenantId) {
        var CustomDomainSvc = new CustomDomain();
    }

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

    function redirectToBetaPages(newBetaFeatures) {
      var goTo = $state.current;
      var messageKey = '';
      // Opt-out pages: Only show disabled message if switching to old page
      if ($state.includes('content.configuration.tenants') || $state.includes('content.configuration.tenants2')) {
        goTo = newBetaFeatures.tenants === false ? 'content.configuration.tenants' : 'content.configuration.tenants2';
        if (newBetaFeatures.tenants === false) {
          messageKey = 'permissions.betaFeatures.disabled.message';
        }
      } else if ($state.includes('content.configuration.integrations') || $state.includes('content.configuration.integrations2')) {
        goTo = newBetaFeatures.integrations === false ? 'content.configuration.integrations' : 'content.configuration.integrations2';
        if (newBetaFeatures.integrations === false) {
          messageKey = 'permissions.betaFeatures.disabled.message';
        }
      } else if ($state.includes('content.management.capacityRules') || $state.includes('content.management.capacityRules2')) {
        goTo = newBetaFeatures.capacityRules === false ? 'content.management.capacityRules' : 'content.management.capacityRules2';
        if (newBetaFeatures.capacityRules === false) {
          messageKey = 'permissions.betaFeatures.disabled.message';
        }
      } else if ($state.includes('content.configuration.identityProviders') || $state.includes('content.configuration.identityProviders2')) {
        goTo = newBetaFeatures.identityProviders === false ? 'content.configuration.identityProviders' : 'content.configuration.identityProviders2';
        if (newBetaFeatures.identityProviders === false) {
          messageKey = 'permissions.betaFeatures.disabled.message';
        }
      }
      $state.go(goTo, { id: null, messageKey: messageKey }, { reload: true, inherit: false });
    }

    function redirectToNonBetaPages() {
      var goTo = $state.current;
      var messageKey = '';

      if ($state.includes('content.realtime-dashboards-management-editor')) {
        goTo = 'content.custom-dashboards-management';
      } else if ($state.includes('content.flows.editor')) {
        goTo = 'content.flows.flowManagement';
      } else if (
        $state.includes('content.flows.dispatchMappings') ||
        $state.includes('content.flows.dispatchMappingsOld')
      ) {
        goTo = 'content.flows.dispatchMappings';
      } else if (
        $state.includes('content.flows.flowManagement') ||
        $state.includes('content.flows.flowManagementOld')
      ) {
        goTo = 'content.flows.flowManagement';
      } else if ($state.includes('content.management.groups') || $state.includes('content.management.groupsOld')) {
        goTo = 'content.management.groups';
      } else if ($state.includes('content.management.roles') || $state.includes('content.management.rolesOld')) {
        goTo = 'content.management.roles';
      } else if ($state.includes('content.management.skills') || $state.includes('content.management.skillsOld')) {
        goTo = 'content.management.skills';
      } else if ($state.includes('content.management.users') || $state.includes('content.management.usersOld')) {
        goTo = 'content.management.users';
      } else if ($state.includes('content.configuration.keys') || $state.includes('content.configuration.keysOld')) {
        goTo = 'content.configuration.keys';
      } else if (
        $state.includes('content.configuration.hours') ||
        $state.includes('content.configuration.hours2') ||
        $state.includes('content.configuration.hoursOld')
      ) {
        goTo = 'content.configuration.hours';
      } else if (
        $state.includes('content.configuration.messageTemplates') ||
        $state.includes('content.configuration.messageTemplatesOld')
      ) {
        goTo = 'content.configuration.messageTemplates';
      } else if ($state.includes('content.management.reasons') || $state.includes('content.management.reasonsOld')) {
        goTo = 'content.management.reasons';
      } else if (
        $state.includes('content.management.reasonLists') ||
        $state.includes('content.management.reasonListsOld')
      ) {
        goTo = 'content.management.reasonLists';
      } else if (
        $state.includes('content.configuration.transferLists') ||
        $state.includes('content.configuration.transferListsOld')
      ) {
        goTo = 'content.configuration.transferLists';
      } else if ($state.includes('content.flows.dispositions') || $state.includes('content.flows.dispositionsOld')) {
        goTo = 'content.flows.dispositions';
      } else if (
        $state.includes('content.flows.dispositionLists') ||
        $state.includes('content.flows.dispositionListsOld')
      ) {
        goTo = 'content.flows.dispositionLists';
      }
      $state.go(goTo, { id: null, messageKey: messageKey }, { reload: true, inherit: false });
    }

    function redirectToOnTenantSwitched() {
      $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/settings/betaFeatures/value',
        headers: {
          Authorization: 'Token ' + Session.token
        }
      }).then(function (data) {
        var newBetaFeatures = data.data.result;
        redirectToBetaPages(newBetaFeatures);
        redirectToPage();
      }, function (err) {
        redirectToNonBetaPages();
      });
    }

    function switchTenant(targetSessionTenant) {
      Session.setTenant(targetSessionTenant);
      AuthService.updateDomain(targetSessionTenant);
      $scope.updateTopbarConfig();
      $scope.updateBranding();

      // Removing impersonate tenant data from sessionStorage
      // when switching between tenants
      sessionStorage.removeItem('LOGI-USER-IMPERSONATE');

      redirectToOnTenantSwitched();
    }

    $scope.populateTenantsHandler = function() {
      if (!Session.isAuthenticated()) {
        return;
      }
      var tenantDropdownItems = [];

      var currentSessionTenant = _.find(Session.tenants, { tenantId: Session.tenant.tenantId });

      if (
        (!Session.tenant ||
        !Session.tenant.tenantId ||
        (currentSessionTenant && currentSessionTenant.tenantActive === false)) &&
        Session.tenants.length
      ) {
        // reset to the first tenant in the list
        Session.setTenant(Session.tenants[0]);
      }

      $scope.tenantDropdownVisible = true;
      if (!Session.tenants.length) {
        $scope.tenantDropdownVisible = false;
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
                currentMeTenant &&
                currentMeTenant.password !== false;

              var className;
              var iconClass;
              var title;

              if (!isCxTenant || (isCxTenant && targetTenant.password === false)) {
                className = 'unavailableTenant';
                iconClass = 'fa fa-sign-in';
                title = $translate.instant('title.text.explain');
              }

              var switchToTenantConfig = {
                label: targetTenant.name,
                className: className,
                iconClass: iconClass,
                title: title,
                onClick: function () {
                  if ($rootScope.isConfig2FormDirty) {
                    var discardChanges = window.confirm($translate.instant('unsavedchanges.nav.warning'));
                    if (discardChanges) {
                      $rootScope.isConfig2FormDirty = false;
                    } else {
                      return;
                    }
                  }
                  DirtyForms.confirmIfDirty(function() {
                    // Make sure that we only switch without forcing re-auth
                    // if we are switching from one *CxEngage* IDP to another.
                    // (CxEngage IDP's always have a password prop set to true)
                    if (isCxTenant) {
                      var monitoredInteraction = CxEngage.session.getMonitoredInteraction();
                      if (monitoredInteraction !== null) {
                        var confirmedToSwitchTenants = confirm($translate.instant('interactionMonitoring.confirmEnd'));
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
              };
              if (Session.tenant.tenantId !== targetTenant.tenantId) {
                // filter out any tenants that have a tenantActive prop set to false
                tenantDropdownItems.push(switchToTenantConfig);
              } else {
                $scope.currentTenantNavbarConfig = switchToTenantConfig;
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
          label: $translate.instant('navigation.logout'),
          onClick: function() {
            $scope.logout();
          },
          iconClass: 'fa fa-sign-out'
        },
        {
          label: $translate.instant('navigation.profile'),
          onClick: function() {
            $state.transitionTo('content.userprofile');
          },
          iconClass: 'fa fa-gear'
        }
      ];

      if (checkSessionTenantId) {
        // TODO: Add translation in here
        if (UserPermissions.hasPermissionInList(PermissionGroups.betaFeatures)) {
          items.push({
            label: $translate.instant('navigation.earlyAccess'),
            onClick: function () {
              $state.transitionTo('content.beta');
            },
            iconClass: 'fa fa-exclamation'
          });
        }
      }
      return items;
    }

    function getLauncherDropdownItems() {
      var items = [];
      if(UserPermissions.hasPermission('PLATFORM_CXWFM_VIEW_ALL')){
        items.push({
          label: "CxEngage WFM",
          onClick: function() {
            var url = 'SerenovaWFM: foo=bar';
            $window.location.href= url;
          }
        })
      }
      return items;
    }

    $scope.userDropdownItems = getUserDropdownItems();
    if (checkSessionTenantId) {
        $scope.launcherDropdownItems = getLauncherDropdownItems();
    }

    $scope.userHelpItems = [
      {
        label: $translate.instant('navigation.help.help'),
        onClick: function() {
          var url = "";
          if (CustomDomainSvc) {
            url = CustomDomainSvc.getHelpURL('/Help/Content/Home.htm');
          } else {
            url = "http://docs.cxengage.net";
          }
          $window.open(url);
        }
      },
      {
        label: $translate.instant('navigation.help.api'),
        onClick: function() {
          var url = 'https://api-docs.cxengage.net/Rest/Default.htm';
          $window.open(url);
        }
      }
    ];

    $rootScope.$on(loEvents.session.tenants.updated, $scope.populateTenantsHandler);

    $scope.$on('resource:create', $scope.onCreateClick);
    $scope.$on('resource:actions', $scope.onActionsClick);
    $rootScope.$on('readAllMode', function() {
      if ($scope.currentTenantNavbarConfig !== null) {
        var tenantDropdownItems = $scope.tenantDropdownItems;
        tenantDropdownItems.push($scope.currentTenantNavbarConfig);
        $scope.tenantDropdownItems = tenantDropdownItems;
      }
      $scope.currentTenantNavbarConfig = null;

      getBetaFeatures();
      //$scope.updateTopbarConfig();
    });
    $scope.checkedForBetaFeatures = false;
    $scope.brandingIsSet = false;

    $rootScope.$on(loEvents.session.tenants.updated, function() {
      $scope.updateTopbarConfig();
    });

    $scope.populateTenantsHandler();

    vm.getManagementConfig = function() {
      var items = [];
      var isActiveExternalTenant = isTenantSetForReadAllMode();

      //Note: see TITAN2-5445 for why VIEW_ALL_USERS permission on its own is not sufficient
      if (
        (UserPermissions.hasPermissionInList(PermissionGroups.viewUsers) &&
          (UserPermissions.hasPermissionInList(PermissionGroups.manageUserSkillsAndGroups) ||
            UserPermissions.hasPermissionInList(PermissionGroups.viewUsersConfig))) ||
        UserPermissions.hasPermissionInList(PermissionGroups.manageUsers)
      ) {
        items.push({
          label: $translate.instant('navigation.management.users'),
          stateLink: 'content.management.users',
          id: 'user-management-link',
          order: 1
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewReasons)) {
        items.push({
          label: $translate.instant('navigation.management.reasons'),
          stateLink: 'content.management.reasons',
          id: 'reasons-management-link',
          order: 2
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewReasonLists)) {
        items.push({
          label: $translate.instant('navigation.management.reasonsList'),
          stateLink: 'content.management.reasonLists',
          id: 'reason-lists-management-link',
          order: 3
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.manageRoles)) {
        items.push({
          label: $translate.instant('navigation.management.roles'),
          stateLink: 'content.management.roles',
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
          label: $translate.instant('navigation.management.skills'),
          stateLink: 'content.management.skills',
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
          label: $translate.instant('navigation.management.groups'),
          stateLink: 'content.management.groups',
          id: 'group-management-link',
          order: 6
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewCapacityRules) ||
          UserPermissions.hasPermissionInList(PermissionGroups.manageCapacityRules)) {
        items.push({
          label: $translate.instant('navigation.management.capacityRules'),
          stateLink: Session.betaFeatures.capacityRules === false ?
            'content.management.capacityRules' : 'content.management.capacityRules2',
          id: 'capacity-rules-management-link',
          order: 7
        });
      }

      return items;
    };

    vm.getConfigurationConfig = function() {
      var items = [];
      var isActiveExternalTenant = isTenantSetForReadAllMode();

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewTenants)) {
        if (Session.betaFeatures) {
            items.push({
              label: $translate.instant('navigation.configuration.tenants'),
              stateLink: Session.betaFeatures.tenants === false ? 'content.configuration.tenants' : 'content.configuration.tenants2',
              id: 'tenants-configuration-link',
              order: 1
            });
        }
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewIdentityProviders)) {
        items.push({
          label: $translate.instant('navigation.configuration.identityProviders'),
          stateLink: Session.betaFeatures.identityProviders === false ? 'content.configuration.identityProviders' : 'content.configuration.identityProviders2',
          id: 'identity-providers-configuration-link',
          order: 2
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewIntegrations)) {
        items.push({
          label: $translate.instant('navigation.configuration.integrations'),
          stateLink: Session.betaFeatures.integrations === false ? 'content.configuration.integrations' : 'content.configuration.integrations2',
          id: 'integrations-configuration-link',
          order: 3
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllLists)) {
        items.push({
          label: $translate.instant('navigation.configuration.lists'),
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
          label: $translate.instant('navigation.configuration.businessHours'),
          stateLink: 'content.configuration.hours',
          id: 'hours-configuration-link',
          order: 5
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewCustomStats)) {
        items.push({
          label: $translate.instant('navigation.configuration.slas'),
          stateLink: 'content.configuration.slas',
          id: 'slas-configuration-link',
          order: 6
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewAppCreds)) {
        items.push({
          label: $translate.instant('navigation.configuration.apiKeys'),
          stateLink: 'content.configuration.keys',
          id: 'key-configuration-link',
          order: 7
        });
      }

      if (UserPermissions.hasPermission('VIEW_ALL_TRANSFER_LISTS')) {
        items.push({
          label: $translate.instant('navigation.configuration.transferLists'),
          stateLink: 'content.configuration.transferLists',
          id: 'transferList-configuration-link',
          order: 8
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewMessageTemplates)) {
        items.push({
          label: $translate.instant('navigation.configuration.messageTemplates'),
          stateLink: 'content.configuration.messageTemplates',
          id: 'template-configuration-link',
          order: 9
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllEmailTemplates) && !isActiveExternalTenant) {
        items.push({
          label: $translate.instant('navigation.configuration.emailTemplates'),
          stateLink: 'content.configuration.emailTemplates',
          id: 'emailTemplates-configuration-link',
          order: 10
        });
      }
      if (UserPermissions.hasPermissionInList(PermissionGroups.viewOutboundIdentifiers) && !isActiveExternalTenant) {
        items.push({
          label: $translate.instant('navigation.configuration.outboundIdentifiers'),
          stateLink: 'content.configuration.outboundIdentifiers',
          id: 'outboundIdentifiers-configuration-link',
          order: 11
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewOutboundIdentifiers) && !isActiveExternalTenant) {
        items.push({
          label: $translate.instant('navigation.configuration.outboundIdentifierLists'),
          stateLink: 'content.configuration.outboundIdentifierLists',
          id: 'outboundIdentifierLists-configuration-link',
          order: 12
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewChatWidgets) && !isActiveExternalTenant) {
        items.push({
          label: $translate.instant('navigation.configuration.chatWidgets'),
          stateLink: 'content.configuration.chatWidgets',
          id: 'chatWidgets-configuration-link',
          order: 13
        });
      }

      if (
        UserPermissions.hasPermissionInList(
          PermissionGroups.viewWhatsappIntegrations
        ) &&
        !isActiveExternalTenant
      ) {
        items.push({
          label: $translate.instant(
            'navigation.configuration.whatsappIntegrations'
          ),
          stateLink: 'content.configuration.whatsappIntegrations',
          id: 'whatsappIntegrations-configuration-link',
          order: 14,
        });
      }

      if (appFlags.CONTACT_MANAGEMENT) {
        if (UserPermissions.hasPermissionInList(PermissionGroups.viewContactAttributes)) {
          items.push({
            label: $translate.instant('navigation.configuration.contactAttributes'),
            stateLink: 'content.configuration.contactAttributes',
            id: 'contact-attributes-configuration-link',
            order: 15
          });
        }

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewContactLayouts)) {
          items.push({
            label: $translate.instant('navigation.configuration.contactLayouts'),
            stateLink: 'content.configuration.contactLayouts',
            id: 'contact-layouts-configuration-link',
            order: 16
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
          label: $translate.instant('navigation.flows'),
          stateLink: 'content.flows.flowManagement',
          id: 'flow-management-link',
          order: 1
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewFlowDebugLogs)) {
        items.push({
          label: $translate.instant('navigation.flows.flowDebugLogs'),
          stateLink: 'content.flows.flowDebugLogs',
          id: 'flow-Debugger-link',
          order: 8
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewDispositions)) {
        items.push({
          label: $translate.instant('navigation.flows.dispositions'),
          stateLink: 'content.flows.dispositions',
          id: 'dispositions-flows-link',
          order: 2
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewDispositions)) {
        items.push({
          label: $translate.instant('navigation.flows.dispositionsLists'),
          stateLink: 'content.flows.dispositionLists',
          id: 'disposition-lists-flows-link',
          order: 3
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewQueues)) {
        items.push({
          label: $translate.instant('navigation.flows.queues'),
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
          label: $translate.instant('navigation.flows.queues') + ' (Alpha)',
          stateLink: 'content.flows.queues2',
          id: 'queue-management-link',
          order: 4
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewMedia)) {
        items.push({
          label: $translate.instant('navigation.flows.media'),
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
          label: $translate.instant('navigation.flows.dispatchmappings'),
          stateLink: 'content.flows.dispatchMappings',
          id: 'dispatch-mappings-configuration-link',
          order: 7
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.readCustomAttributesPermissions)) {
        items.push({
          label: $translate.instant('navigation.flows.customAttributes'),
          stateLink: 'content.flows.customAttributes',
          id: 'custom-attributes-configuration-link',
          order: 9
        });
      }
      return items;
    };

    vm.getReportingConfig = function() {
      var items = [];
      var isActiveExternalTenant = isTenantSetForReadAllMode();

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewAssignedReports)) {
        items.push({
          label: $translate.instant('navigation.reports.rtd'),
          stateLink: 'content.realtime-dashboards-management-viewer({dashboardId: "overview-dashboard"})',
          id: 'realtime-dashboard-link',
          order: 1
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewDashboards)) {
        items.push({
          label: $translate.instant('navigation.reports.rtdCustom'),
          stateLink: 'content.custom-dashboards-management',
          id: 'custom-realtime-dashboard-link',
          order: 2
        });

        if (UserPermissions.hasPermissionInList(PermissionGroups.viewCustomStats) && !isActiveExternalTenant) {
          items.push({
            label: $translate.instant('navigation.configuration.dataAccessReports'),
            stateLink: 'content.configuration.dataAccessReports',
            id: 'dataAccessReports-configuration-link',
            order: 4
          });
        }
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewInteractionMonitoring)) {
        items.push({
          label: $translate.instant('navigation.reports.interactionMonitoring'),
          stateLink: 'content.reporting.interactionMonitoring',
          id: 'interaction-monitoring-link',
          order: 7
        });
      }

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewAgentStateMonitoring)) {
        items.push({
          label: $translate.instant('navigation.reports.agentStateMonitoring'),
          stateLink: 'content.reporting.agentStateMonitoring',
          id: 'agent-state-monitoring-link',
          order: 8
        });
      }

      // //////////////////////////////////////////
      // LOGI Reports
      // Logi standard and advanced reports
      // //////////////////////////////////////////
      //CXV1-22138 Hide Standard Reports section
      //if (UserPermissions.hasPermissionInList(PermissionGroups.viewConfigReportingBI)) {
      //  items.push({
      //    label: $translate.instant('navbar.reports.logi.standard.title'),
      //    stateLink: 'content.reporting.logiStandard',
      //    id: 'logi-standard-reports-link',
      //    order: 9
      //  });
      //}
      if (UserPermissions.hasPermissionInList(PermissionGroups.viewConfigReportingBI)) {
        items.push({
          label: $translate.instant('navigation.reports.logi.historicalReporting'),
          stateLink: 'content.reporting.logiAdvanced',
          id: 'logi-advanced-reports-link',
          order: 10
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

    vm.getWfmConfig = function() {
      return [
        $location.search()['alpha'] &&
        UserPermissions.hasPermissionInList(PermissionGroups.wfm) &&
        {
          label: $translate.instant('navbar.wfm.planning'),
          stateLink: 'content.wfm_planning',
          id: 'wfm-planning-link',
          order: 1
        },
        $location.search()['alpha'] &&
        UserPermissions.hasPermissionInList(PermissionGroups.wfm) &&
        {
          label: $translate.instant('navbar.wfm.forecasting'),
          stateLink: 'content.wfm_forecasting',
          id: 'wfm-forecasting-link',
          order: 2
        },
        $location.search()['alpha'] &&
        UserPermissions.hasPermissionInList(PermissionGroups.wfm) &&
        {
          label: $translate.instant('navbar.wfm.agent'),
          stateLink: 'content.wfm_agent',
          id: 'wfm-agent-link',
          order: 3
        },
        $location.search()['alpha'] &&
        UserPermissions.hasPermissionInList(PermissionGroups.wfm) &&
        {
          label: $translate.instant('navbar.wfm.admin'),
          stateLink: 'content.wfm_admin',
          id: 'wfm-admin-link',
          order: 4
        },
      ].filter(Boolean);
    };

    vm.getSupportConfig = function() {
      var items = [];

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewConfigDebugTool)) {
        items.push({
          label: $translate.instant('navigation.support.debug'),
          stateLink: 'content.support.debug',
          id: 'flow-debugger-link',
          order: 1
        });
      }

      return items;
    };

    $scope.updateTopbarConfig = function() {
      $scope.managementDropConfig = vm.getManagementConfig();
      $scope.configurationDropConfig = vm.getConfigurationConfig();
      $scope.flowsDropConfig = vm.getFlowsConfig();
      $scope.reportingDropConfig = vm.getReportingConfig();
      $scope.wfmDropConfig = vm.getWfmConfig();
      $scope.supportDropConfig = vm.getSupportConfig();
      $scope.userDropdownItems = getUserDropdownItems();
    };

    $scope.updateBranding = function(tenantId) {
      if (checkSessionTenantId) {
        Branding.get(
          {
            tenantId: tenantId ? tenantId : Session.tenant.tenantId
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
      } else {
        Branding.set({});
        $scope.brandingIsSet = true;
      }
    };

    function getBetaFeatures(){
      if (checkSessionTenantId) {
        Session.betaFeatures = {};
        $http({
          method: 'GET',
          url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/settings/betaFeatures/value',
          headers: {
            Authorization: 'Token ' + Session.token
           }
        })
        .then(function (data) {
          Session.betaFeatures = data.data.result;
          $scope.checkedForBetaFeatures = true;

          $scope.updateBranding();
          $scope.updateTopbarConfig();
        })
        .catch(function (error) {
          $scope.checkedForBetaFeatures = true;
          $scope.updateBranding();
          $scope.updateTopbarConfig();
          console.error(error);
        });
      } else {
        $scope.checkedForBetaFeatures = true;
        $scope.updateBranding();
      }
    };

    getBetaFeatures();



    $rootScope.$on('tenantBrandingUpdated', function (event, tenantId) {
      if (Session.tenant.tenantId === tenantId) {
        $scope.updateBranding(tenantId);
      }
    });


    $rootScope.$on('switchTenant', function (event, tenantId, tenantName) {

      Session.setTenant({
        tenantId: tenantId,
        tenantName: tenantName + ' *',
        tenantPermissions: PermissionGroups.readAllMode
      });

      if ($scope.currentTenantNavbarConfig !== null) {
        var tenantDropdownItems = $scope.tenantDropdownItems;
        tenantDropdownItems.push($scope.currentTenantNavbarConfig);
        $scope.tenantDropdownItems = tenantDropdownItems;
      }
      $scope.currentTenantNavbarConfig = null;

      $scope.updateTopbarConfig();
      $scope.updateBranding(tenantId);

      // Removing impersonate tenant data from sessionStorage
      // when setting tenant as active
      sessionStorage.removeItem('LOGI-USER-IMPERSONATE');
    });

    $rootScope.$on('setIsConfig2FormDirty', function (event, isDirty) {
      $rootScope.isConfig2FormDirty = isDirty;
    });
  }
]);
