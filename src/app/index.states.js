'use strict';

angular.module('liveopsConfigPanel').config([
  '$stateProvider',
  '$urlRouterProvider',
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
          regions: [
            'Session',
            'Region',
            function(Session, Region) {
              return Region.query({}, function(result) {
                Session.activeRegionId = result[0].id;
              }).$promise;
            }
          ],

          login: [
            'Session',
            'Login',
            '$state',
            function(Session, Login, $state) {
              return Login.save(
                function(result) {
                  Session.tenants = result.tenants;
                },
                function() {
                  $state.go('login');
                }
              ).$promise;
            }
          ]
        }
      })
      .state('content.management', {
        abstract: true,
        url: '/management',
        templateUrl: 'app/components/management/management.html',
        title: 'User Management',
        controller: 'ManagementController'
      })
      .state('content.management.usersOld', {
        url: '/users-old?id',
        title: 'User Management - Users',
        titleMessageId: 'title.management.users',
        templateUrl: 'app/components/management/users/users.html',
        controller: 'UsersController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            '$q',
            function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageUsers.concat(PermissionGroups.viewUsers)),
                UserPermissions.resolvePermissions(
                  PermissionGroups.manageUserSkillsAndGroups.concat(['PLATFORM_CONFIG_USERS_VIEW'])
                ) //See TITAN2-4897 for why we do this extra check
              );
            }
          ]
        }
      })
      .state('content.management.users', {
        url: '/users?id',
        title: 'User Management - Users',
        titleMessageId: 'title.management.users',
        templateUrl: 'app/components/management/users2/users.html',
        controller: 'usersController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            '$q',
            function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageUsers.concat(PermissionGroups.viewUsers)),
                UserPermissions.resolvePermissions(
                  PermissionGroups.manageUserSkillsAndGroups.concat(['PLATFORM_CONFIG_USERS_VIEW'])
                ) //See TITAN2-4897 for why we do this extra check
              );
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.management.rolesOld', {
        url: '/roles-old?id',
        title: 'User Management - Role Management',
        titleMessageId: 'title.management.roles',
        templateUrl: 'app/components/management/roles/roles.html',
        controller: 'RolesController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.manageRoles);
            }
          ]
        }
      })
      .state('content.management.roles', {
        url: '/roles?id',
        title: 'User Management - Role Management',
        titleMessageId: 'title.management.roles',
        templateUrl: 'app/components/management/roles2/roles2.html',
        controller: 'rolesController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.manageRoles);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.management.skillsOld', {
        url: '/skills-old?id',
        title: 'User Management - Skill Management',
        titleMessageId: 'title.management.skills',
        templateUrl: 'app/components/management/skills/skills.html',
        controller: 'SkillsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            '$q',
            function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageSkills),
                UserPermissions.resolvePermissions(PermissionGroups.manageAllMedia) //See TITAN2-6199 for why we do this extra check
              );
            }
          ]
        }
      })
      .state('content.management.skills', {
        url: '/skills?id',
        title: 'User Management - Skill Management',
        titleMessageId: 'title.management.skills',
        templateUrl: 'app/components/management/skills2/skills.html',
        controller: 'skillsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            '$q',
            function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageSkills),
                UserPermissions.resolvePermissions(PermissionGroups.manageAllMedia) //See TITAN2-6199 for why we do this extra check
              );
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.management.groupsOld', {
        url: '/groups-old?id',
        title: 'User Management - Group Management',
        titleMessageId: 'title.management.groups',
        templateUrl: 'app/components/management/groups/groups.html',
        controller: 'GroupsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            '$q',
            function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageGroups),
                UserPermissions.resolvePermissions(PermissionGroups.manageAllMedia)
              );
            }
          ]
        },
      })
      .state('content.management.groups', {
        url: '/groups?id',
        title: 'User Management - Group Management',
        titleMessageId: 'title.management.groups',
        templateUrl: 'app/components/management/groups2/groups.html',
        controller: 'groupsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            '$q',
            function(UserPermissions, PermissionGroups, $q) {
              return $q.all(
                UserPermissions.resolvePermissions(PermissionGroups.manageGroups),
                UserPermissions.resolvePermissions(PermissionGroups.manageAllMedia)
              );
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.management.capacityRules', {
        url: '/capacityRules?id',
        title: 'User Management - Capacity Rules Management',
        titleMessageId: 'title.management.capacityRules',
        templateUrl: 'app/components/management/capacityRules/capacityRules.html',
        controller: 'CapacityRulesController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            '$q',
            function(UserPermissions, PermissionGroups, $q) {
              return $q.all(UserPermissions.resolvePermissions(PermissionGroups.manageCapacityRules));
            }
          ]
        }
      })
      .state('content.management.capacityRules2', {
        url: '/capacityRules2?id',
        title: 'User Management - Capacity Rules Management',
        templateUrl: 'app/components/management/capacityRules2/capacityRules.html',
        controller: 'capacityRulesController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return (
                UserPermissions.hasPermissionInList(PermissionGroups.viewCapacityRules) ||
                UserPermissions.resolvePermissions(PermissionGroups.manageCapacityRules)
              );
            }
          ]
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
        titleMessageId: 'title.configuration.tenants',
        templateUrl: 'app/components/configuration/tenants/tenants.html',
        controller: 'TenantsController as tc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewTenants);
            }
          ]
        }
      })
      .state('content.configuration.tenants2', {
        url: '/tenants2?id',
        title: 'Configuration - Tenant Management',
        titleMessageId: 'title.configuration.tenants',
        templateUrl: 'app/components/configuration/tenants2/tenants.html',
        controller: 'tenantsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewTenants);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.beta', {
        url: '/early-access-features',
        title: 'Configuration - Early Access Features',
        titleMessageId: 'title.beta',
        templateUrl: 'app/components/configuration/betaFeatures/betaFeatures.html',
        controller: 'betaFeaturesController',
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.readAllMode);
            }
          ]
        }
      })
      .state('content.configuration.genericLists', {
        url: '/lists?id',
        title: 'Configuration - Lists',
        titleMessageId: 'title.configuration.genericLists',
        templateUrl: 'app/components/configuration/genericLists/genericLists.html',
        controller: 'genericListsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllLists);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.outboundIdentifiers', {
        url: '/outboundIdentifiers?id',
        title: 'Configuration - Outbound Identifiers',
        titleMessageId: 'title.configuration.outboundIdentifiers',
        templateUrl: 'app/components/configuration/outboundIdentifiers/outboundIdentifiers.html',
        controller: 'outboundIdentifiersController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewOutboundIdentifiers);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.dataAccessReports', {
        url: '/dataAccessReports?id',
        title: 'Configuration - Data Access Reports',
        titleMessageId: 'title.configuration.dataAccessReports',
        templateUrl: 'app/components/configuration/dataAccessReports/dataAccessReports.html',
        controller: 'dataAccessReportsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.wfm_planning', {
        url: '/wfm/planning',
        title: 'WFM Planning',
        titleMessageId: 'navbar.wfm.title',
        templateUrl: 'app/components/wfm/wfm.html',
        controller: 'wfmController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.wfm);
            }
          ]
        },
        params: { link: 'planning' }
      })
      .state('content.wfm_forecasting', {
        url: '/wfm/forecasting',
        title: 'WFM Forecasting',
        titleMessageId: 'navbar.wfm.title',
        templateUrl: 'app/components/wfm/wfm.html',
        controller: 'wfmController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.wfm);
            }
          ]
        },
        params: { link: 'forecasting' }
      })
      .state('content.wfm_agent', {
        url: '/wfm/agent',
        title: 'WFM Agent',
        titleMessageId: 'navbar.wfm.title',
        templateUrl: 'app/components/wfm/wfm.html',
        controller: 'wfmController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.wfm);
            }
          ]
        },
        params: { link: 'agent' }
      })
      .state('content.wfm_admin', {
        url: '/wfm/admin',
        title: 'WFM Admin',
        titleMessageId: 'navbar.wfm.title',
        templateUrl: 'app/components/wfm/wfm.html',
        controller: 'wfmController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.wfm);
            }
          ]
        },
        params: { link: 'admin' }
      })
      .state('content.configuration.chatWidgets', {
        url: '/chatWidgets?id',
        title: 'Configuration - Chat Widgets',
        titleMessageId: 'title.configuration.chatWidgets',
        templateUrl: 'app/components/configuration/chatWidgets/chatWidgets.html',
        controller: 'chatWidgetsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewChatWidgets);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.whatsappIntegrations', {
        url: '/whatsappIntegrations?id',
        title: 'Configuration - WhatsApp',
        titleMessageId: 'title.configuration.whatsappIntegrations',
        templateUrl: 'app/components/configuration/whatsappIntegrations/whatsappIntegrations.html',
        controller: 'whatsappIntegrationsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewWhatsappIntegrations);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.outboundIdentifierLists', {
        url: '/outboundIdentifierLists?id',
        title: 'Configuration - Outbound Identifier Lists',
        titleMessageId: 'title.configuration.outboundIdentifierLists',
        templateUrl: 'app/components/configuration/outboundIdentifierLists/outboundIdentifierLists.html',
        controller: 'outboundIdentifierListsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewOutboundIdentifiers);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.emailTemplates', {
        url: '/emailTemplates?id',
        title: 'Configuration - Email Templates',
        titleMessageId: 'title.configuration.emailTemplates',
        templateUrl: 'app/components/configuration/emailTemplates/emailTemplates.html',
        controller: 'emailTemplatesController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.accessAllEmailTemplates);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.slas', {
        url: '/slas?id',
        title: 'Configuration - SLA',
        titleMessageId: 'title.configuration.slas',
        templateUrl: 'app/components/configuration/slas/slas.html',
        controller: 'slasController as slas',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.contactAttributes', {
        url: '/contactAttributes?id',
        title: 'Configuration - Contact Attribute Management',
        titleMessageId: 'title.configuration.contactAttributes',
        templateUrl: 'app/components/configuration/contactAttributes2/contactAttributes.html',
        controller: 'contactAttributesController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewContactAttributes);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.contactLayouts', {
        url: '/contactLayouts?id',
        title: 'Configuration - Contact Layout Management',
        titleMessageId: 'title.configuration.contactLayouts',
        templateUrl: 'app/components/configuration/contactLayouts2/contactLayouts.html',
        controller: 'contactLayoutsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewContactLayouts);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.code', {
        url: '/code',
        abstract: true,
        template: '<ui-view />'
      })
      .state('content.management.reasonsOld', {
        url: '/reasons-old?id',
        title: 'User Management - Presence Reasons ',
        titleMessageId: 'title.management.reasons',
        templateUrl: 'app/components/management/reasons/reasons.html',
        controller: 'reasonsController as rc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewReasons);
            }
          ]
        }
      })
      .state('content.management.reasons', {
        url: '/reasons?id',
        title: 'User Management - Presence Reasons ',
        titleMessageId: 'title.management.reasons',
        templateUrl: 'app/components/management/reasons2/reasons.html',
        controller: 'reasonsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewReasons);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.management.reasonListsOld', {
        url: '/reasonLists-old?id',
        title: 'User Management - Presence Reasons Lists',
        titleMessageId: 'title.management.reasonLists',
        templateUrl: 'app/components/management/reasons/reasonLists/reasonLists.html',
        controller: 'reasonListsController as rlc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewReasonLists);
            }
          ]
        }
      })
      .state('content.management.reasonLists', {
        url: '/reasonLists?id',
        title: 'User Management - Presence Reasons Lists',
        titleMessageId: 'title.management.reasonLists',
        templateUrl: 'app/components/management/reasons/reasonLists2/reasonLists.html',
        controller: 'reasonListsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewReasonLists);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.integrations', {
        url: '/integrations?id',
        title: 'Configuration - Integration Management',
        titleMessageId: 'title.configuration.integrations',
        templateUrl: 'app/components/configuration/integrations/integrations.html',
        controller: 'IntegrationsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewIntegrations);
            }
          ]
        }
      })
      .state('content.configuration.integrations2', {
        url: '/integrations2?id',
        title: 'Configuration - Integration Management',
        titleMessageId: 'title.configuration.integrations',
        templateUrl: 'app/components/configuration/integrations2/integrations.html',
        controller: 'integrationsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewIntegrations);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.hoursOld', {
        url: '/hours-old?id',
        title: 'Configuration - Business Hours Management',
        titleMessageId: 'title.configuration.hours',
        templateUrl: 'app/components/configuration/hours/hours.html',
        controller: 'hoursController as hc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return (
                UserPermissions.hasPermissionInList(PermissionGroups.viewBusinessHours) ||
                UserPermissions.resolvePermissions(PermissionGroups.manageBusinessHours)
              );
            }
          ]
        }
      })
      .state('content.configuration.hours', {
        url: '/hours?id',
        title: 'Configuration - Business Hours Management',
        titleMessageId: 'title.configuration.hours',
        templateUrl: 'app/components/configuration/hours2/hours.html',
        controller: 'hoursController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return (
                UserPermissions.hasPermissionInList(PermissionGroups.viewBusinessHours) ||
                UserPermissions.resolvePermissions(PermissionGroups.manageBusinessHours)
              );
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.hours2', {
        url: '/hours-old2?id',
        title: 'Configuration - Business Hours Management',
        titleMessageId: 'title.configuration.hours',
        templateUrl: 'app/components/configuration/hours2/hours.html',
        controller: 'hoursControllerTemp',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return (
                UserPermissions.hasPermissionInList(PermissionGroups.viewBusinessHours) ||
                UserPermissions.resolvePermissions(PermissionGroups.manageBusinessHours)
              );
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.keysOld', {
        url: '/keys-old?id',
        title: 'Configuration - API Keys',
        titleMessageId: 'title.configuration.keys',
        templateUrl: 'app/components/configuration/keys/keys.html',
        controller: 'keysController as kc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewAppCreds);
            }
          ]
        }
      })
      .state('content.configuration.keys', {
        url: '/keys?id',
        title: 'Configuration - API Keys',
        titleMessageId: 'title.configuration.keys',
        templateUrl: 'app/components/configuration/keys2/keys.html',
        controller: 'keysController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewAppCreds);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.messageTemplatesOld', {
        url: '/messageTemplates-old?id',
        title: 'Configuration - Message Templates',
        titleMessageId: 'title.configuration.messageTemplates',
        templateUrl: 'app/components/configuration/messageTemplates/messageTemplates.html',
        controller: 'messageTemplatesController as mtc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewMessageTemplates);
            }
          ]
        }
      })
      .state('content.configuration.messageTemplates', {
        url: '/messageTemplates?id',
        title: 'Configuration - Message Templates',
        titleMessageId: 'title.configuration.messageTemplates',
        templateUrl: 'app/components/configuration/messageTemplates2/messageTemplates.html',
        controller: 'messageTemplatesController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            function(UserPermissions) {
              return UserPermissions.resolvePermissions(['VIEW_ALL_MESSAGE_TEMPLATES', 'PLATFORM_VIEW_ALL']);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.transferListsOld', {
        url: '/transferLists-old?id',
        title: 'Configuration - Transfer Lists',
        titleMessageId: 'title.configuration.transferLists',
        templateUrl: 'app/components/configuration/transferLists/transferLists.html',
        controller: 'transferListsController as tlc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            function(UserPermissions) {
              return UserPermissions.resolvePermissions(['VIEW_ALL_TRANSFER_LISTS']);
            }
          ]
        }
      })
      .state('content.configuration.transferLists', {
        url: '/transferLists?id',
        title: 'Configuration - Transfer Lists',
        titleMessageId: 'title.configuration.transferLists',
        templateUrl: 'app/components/configuration/transferLists2/transferLists.html',
        controller: 'transferListsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            function(UserPermissions) {
              return UserPermissions.resolvePermissions(['VIEW_ALL_TRANSFER_LISTS']);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.configuration.identityProviders', {
        url: '/identityProviders?id',
        title: 'Configuration - Identity Providers',
        titleMessageId: 'title.configuration.identityProviders',
        templateUrl: 'app/components/configuration/identityProviders/identityProviders.html',
        controller: 'identityProvidersController as idp',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            function(UserPermissions) {
              return UserPermissions.resolvePermissions(['IDENTITY_PROVIDERS_READ']);
            }
          ]
        }
      })
      .state('content.configuration.identityProviders2', {
        url: '/identityProviders2?id',
        title: 'Configuration - Identity Providers',
        templateUrl: 'app/components/configuration/identityProviders2/identityProviders.html',
        controller: 'identityProvidersController2 as idp',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            function(UserPermissions) {
              return UserPermissions.resolvePermissions(['IDENTITY_PROVIDERS_READ']);
            }
          ]
        }
      })
      .state('content.flows', {
        abstract: true,
        url: '/flows',
        title: 'Flow Management',
        templateUrl: 'app/components/flows/flows.html',
        controller: 'FlowsController'
      })
      .state('content.flows.flowManagementOld', {
        url: '/management-old?id',
        title: 'Flows - Flow Management',
        templateUrl: 'app/components/flows/flowManagement/flowManagement.html',
        controller: 'FlowManagementController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewFlows);
            }
          ]
        }
      })
      .state('content.flows.flowManagement', {
        url: '/management?id',
        title: 'Flows - Flow Management',
        templateUrl: 'app/components/flows2/flows2.html',
        controller: 'flowsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewFlows);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.flows.flowDebugLogs', {
        url: '/flowDebugLogs',
        title: 'Flow Debug Logs',
        titleMessageId: 'title.flows.flowDebugLogs',
        templateUrl: 'app/components/flows/flowDebugLogs/flowDebugLogs.html',
        controller: 'flowDebugLogsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewFlowDebugLogs);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.flows.queues', {
        url: '/queues?id',
        title: 'Flows - Queue Management',
        titleMessageId: 'title.flows.queues',
        templateUrl: 'app/components/flows/queues/queues.html',
        controller: 'QueueController as qc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewQueues);
            }
          ]
        }
      })
      .state('content.flows.queues2', {
        url: '/queues2?id',
        title: 'Flows - Queue Management',
        titleMessageId: 'title.flows.queues',
        templateUrl: 'app/components/configuration/queues2/queues2.html',
        controller: 'queuesController2 as qc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewQueues);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.flows.dispositionsOld', {
        url: '/dispositions-old?id',
        title: 'Flows - Disposition Management',
        titleMessageId: 'title.flows.dispositions',
        templateUrl: 'app/components/flows/dispositions/dispositions.html',
        controller: 'dispositionsController as dc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispositions);
            }
          ]
        }
      })
      .state('content.flows.dispositions', {
        url: '/dispositions?id',
        title: 'Flows - Disposition Management',
        templateUrl: 'app/components/flows/dispositions/dispositions2/dispositions2.html',
        controller: 'dispositionsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispositions);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.flows.dispositionListsOld', {
        url: '/dispositionLists-old?id',
        title: 'Flows - Disposition List Management',
        titleMessageId: 'title.flows.dispositionLists',
        templateUrl: 'app/components/flows/dispositions/dispositionLists/dispositionLists.html',
        controller: 'dispositionListsController as dlc',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispositionLists);
            }
          ]
        }
      })
      .state('content.flows.dispositionLists', {
        url: '/dispositionLists?id',
        title: 'Flows - Disposition List Management',
        titleMessageId: 'title.flows.dispositionLists',
        templateUrl: 'app/components/flows/dispositions/dispositionLists2/dispositionLists2.html',
        controller: 'dispositionListsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispositionLists);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.flows.media', {
        url: '/media?id',
        title: 'Flows - Media Management',
        titleMessageId: 'title.flows.media',
        templateUrl: 'app/components/flows/media/media.html',
        controller: 'MediaController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewMedia);
            }
          ]
        }
      })
      .state('content.flows.media-collections', {
        url: '/media-collections?id',
        title: 'Flows - Media Collection Management',
        titleMessageId: 'title.flows.media-collections',
        templateUrl: 'app/components/flows/media-collections/media-collections.html',
        controller: 'MediaCollectionController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewMedia);
            }
          ]
        }
      })
      .state('content.flows.dispatchMappingsOld', {
        url: '/dispatchMappings-old?id',
        title: 'Flows - Dispatch Mapping Management',
        titleMessageId: 'title.flows.dispatchMappings',
        templateUrl: 'app/components/flows/dispatchMappings/dispatchMappings.html',
        controller: 'DispatchMappingsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispatchMappings);
            }
          ]
        }
      })
      .state('content.flows.dispatchMappings', {
        url: '/dispatchMappings?id',
        title: 'Flows - Dispatch Mapping Management',
        titleMessageId: 'title.flows.dispatchMappings',
        templateUrl: 'app/components/flows/dispatchMappings2/dispatchMappings.html',
        controller: 'dispatchMappingsController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDispatchMappings);
            }
          ]
        },
        params: {config2: true}
      })
      .state('content.flows.versions', {
        url: '/versions?id',
        title: 'Flows - Flow Versions Management',
        titleMessageId: 'title.flows.versions',
        templateUrl: 'app/components/flows/flowManagement/versions/versions.html',
        controller: 'VersionsController',
        reloadOnSearch: false
      })
      .state('content.flows.editor', {
        url: '/editor/:flowId/:draftId',
        title: 'Flows - Flow Draft',
        titleMessageId: 'title.flows.editor',
        templateUrl: 'app/components/flows/flowDesigner/flowDesignerPage.html',
        controller: 'DesignerPageController',
        reloadOnSearch: false,
        resolve: {}
      })
      .state('content.flows.view', {
        url: '/viewer/:flowId/:versionId',
        title: 'Flows - Flow Viewer',
        titleMessageId: 'title.flows.view',
        templateUrl: 'app/components/flows/flowDesigner/flowViewerPage.html',
        controller: 'ViewerPageController',
        reloadOnSearch: false,
        resolve: {}
      })
      .state('content.flows.customAttributes', {
        url: '/customAttributes?id',
        title: 'Flows - Custom Attributes Management',
        titleMessageId: 'title.flows.customAttributes',
        templateUrl: 'app/components/flows/customAttributes2/customAttributes.html',
        controller: 'customAttributesController2',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.hasPermissionInList(PermissionGroups.readCustomAttributesPermissions);
            }
          ]
        },
        params: {config2: true}
      })
      .state('login', {
        url: '/login?messageKey&tenantId&sso',
        title: 'Login',
        titleMessageId: 'title.login',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginController',
        isPublic: true
      })
      .state('forgot-password', {
        url: '/forgot-password',
        title: 'Forgot Password',
        titleMessageId: 'title.forgot-password',
        templateUrl: 'app/components/forgotPassword/forgotPassword.html',
        controller: 'ForgotPasswordController',
        isPublic: true
      })
      .state('reset-password', {
        url: '/reset-password?userid&userId&token',
        title: 'Reset Password',
        titleMessageId: 'title.reset-password',
        templateUrl: 'app/components/resetPassword/resetPassword.html',
        controller: 'ResetPasswordController',
        isPublic: true,
        resolve: {
          userToReset: [
            '$stateParams',
            'Session',
            'User',
            '$q',
            '$state',
            function($stateParams, Session, User, $q, $state) {
              Session.setToken('Token ' + $stateParams.token);

              var userResult = User.get(
                {
                  id: $stateParams.userId || $stateParams.userid
                },
                angular.noop,
                function() {
                  $state.go('login', {
                    messageKey: 'user.details.password.reset.expired'
                  });
                }
              );
              return userResult.$promise;
            }
          ]
        }
      })
      .state('content.userprofile', {
        url: '/userprofile',
        title: 'User Profile',
        titleMessageId: 'title.userProfile',
        templateUrl: 'app/components/userProfile/userProfile.html',
        controller: 'UserProfileController',
        secure: true
      })
      //CXV1-22138 Hide Standard Reports section
      // Logi standard and advanced reports
      //.state('content.reporting.logiStandard', {
      //  url: '/cxengage-standard',
      //  title: 'Reporting - Standard Reports',
      //  templateUrl: 'app/components/reports/logi/standard/logi_standard.html',
      //  controller: 'LogiStandardController',
      //  reloadOnSearch: false,
      //  resolve: {
      //    hasPermission: [
      //      'UserPermissions',
      //      'PermissionGroups',
      //      function(UserPermissions, PermissionGroups) {
      //        return UserPermissions.resolvePermissions(PermissionGroups.viewConfigReportingBI);
      //      }
      //    ]
      //  },
      // onExit: ['$window', function($window){
      //   $window.EmbeddedReporting.remove('logiContainer');
      // }]
      //})
      //CXV1-22133 - Rename the Advanced Report (V2) option from the Reporting menu.
      .state('content.reporting.logiAdvanced', {
        url: '/cxengage-advanced',
        title: 'Reporting - Historical Reporting',
        titleMessageId: 'title.reporting.logiAdvanced',
        templateUrl: 'app/components/reports/logi/advanced/logi_advanced.html',
        controller: 'LogiAdvancedController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewConfigReportingBI);
            }
          ]
        },
        onExit: ['$window', function($window){
          $window.EmbeddedReporting.remove('ssmContainer');
        }]
      })
      .state('content.billing', {
        url: '/billing-reports?id',
        title: 'Reporting - Billing Reports',
        templateUrl: 'app/components/reports/reports.html',
        controller: 'ReportsController',
        resolve: {
          hasPermission: [
            'UserPermissions',
            function(UserPermissions) {
              return UserPermissions.resolvePermissions(['PLATFORM_VIEW_ALL_TENANTS']);
            }
          ]
        }
      })
      .state('content.reporting.interactionMonitoring', {
        url: '/interactionMonitoring',
        title: 'Reporting - Interaction Monitoring',
        titleMessageId: 'title.reporting.interactionMonitoring',
        templateUrl: 'app/components/reports/interactionMonitoring/interactionMonitoring.html',
        controller: 'InteractionMonitoringController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewInteractionMonitoring);
            }
          ]
        }
      })
      .state('content.reporting.agentStateMonitoring', {
        url: '/agentStateMonitoring',
        title: 'Reporting - Agent State Monitoring',
        titleMessageId: 'title.reporting.agentStateMonitoring',
        templateUrl: 'app/components/reports/agentStateMonitoring/agentStateMonitoring.html',
        controller: 'AgentStateMonitoringController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewAgentStateMonitoring);
            }
          ]
        }
      })
      .state('invite-accept', {
        url: '/invite-accept?userid&userId&tenantId&tenantid&token',
        title: 'Accept Invite',
        titleMessageId: 'title.invite-accept',
        templateUrl: 'app/components/inviteAccept/inviteAccept.html',
        controller: 'InviteAcceptController',
        isPublic: true,
        resolve: {
          invitedUser: [
            '$stateParams',
            'Session',
            'User',
            '$q',
            '$state',
            function($stateParams, Session, User, $q, $state) {
              if ($stateParams.token !== null) {
                Session.setToken('Token ' + $stateParams.token);
              }

              var userResult = User.get(
                {
                  id: $stateParams.userId || $stateParams.userid
                },
                angular.noop,
                function(error) {
                  if (error.data === 'Permission denied') {
                    $state.go('login', {
                      messageKey: 'permissions.unauthorized.message'
                    });
                  } else {
                    $state.go('login', {
                      messageKey: 'invite.accept.expired'
                    });
                  }
                }
              );

              return userResult.$promise;
            }
          ]
        }
      })
      .state('content.custom-dashboards-management', {
        url: '/realtime-dashboards?id',
        title: 'Reporting - Custom Realtime Dashboards',
        titleMessageId: 'title.custom-dashboards-management',
        templateUrl: 'app/components/reporting/realtime/realtimeDashboardManagement/realtimeDashboardsManagement.html',
        controller: 'RealtimeDashboardsManagementController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDashboards);
            }
          ],
          dashboards: [
            'RealtimeDashboardsSettings',
            function(RealtimeDashboardsSettings) {
              return _.filter(RealtimeDashboardsSettings.mockDashboards, function(dash) {
                return dash.enabled === true;
              });
            }
          ]
        }
      })
      .state('content.realtime-dashboards-management-editor', {
        // We should remove the beta feature flag when we deploy custom attributes for Interactions in Conversation Table in to production.
        url: '/realtime-dashboards/editor/:dashboardId?beta',
        title: 'Reporting - Custom Realtime Dashboards - Editor',
        titleMessageId: 'title.realtime-dashboards-management-editor',
        templateUrl: 'app/components/reporting/realtime/realtimeDashboardEditor/realtimeDashboardsEditor.html',
        controller: 'realtimeDashboardsEditorController',
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewDashboards);
            }
          ],
          dashboard: [
            '$stateParams',
            'Session',
            'RealtimeDashboard',
            'RealtimeDashboardsSettings',
            '$q',
            function($stateParams, Session, RealtimeDashboard, RealtimeDashboardsSettings, $q) {
              var deferred = $q.defer();
              var dashboard;

              delete $stateParams.id;

              RealtimeDashboard.get(
                {
                  tenantId: Session.tenant.tenantId,
                  id: $stateParams.dashboardId
                },
                function(data) {
                  dashboard = data;
                  deferred.resolve(dashboard);
                }
              );

              return deferred.promise;
            }
          ],
          dashboards: [
            'RealtimeDashboardsSettings',
            function(RealtimeDashboardsSettings) {
              return _.filter(RealtimeDashboardsSettings.mockDashboards, function(dash) {
                return dash.enabled === true;
              });
            }
          ],
          queues: [
            'Queue',
            'Session',
            '$q',
            function(Queue, Session, $q) {
              var deferred = $q.defer();
              Queue.query(
                {
                  tenantId: Session.tenant.tenantId
                },
                function(queues) {
                  deferred.resolve(queues);
                }
              );
              return deferred.promise;
            }
          ],
          users: [
            'TenantUser',
            'Session',
            '$q',
            function(TenantUser, Session, $q) {
              var deferred = $q.defer();
              TenantUser.query(
                {
                  tenantId: Session.tenant.tenantId
                },
                function(users) {
                  deferred.resolve(users);
                }
              );
              return deferred.promise;
            }
          ],

          flows: [
            'Flow',
            'Session',
            '$q',
            function(Flow, Session, $q) {
              var deferred = $q.defer();
              Flow.query(
                {
                  tenantId: Session.tenant.tenantId
                },
                function(flows) {
                  deferred.resolve(flows);
                }
              );
              return deferred.promise;
            }
          ]
        }
      })
      .state('content.realtime-dashboards-management-viewer', {
        // We should remove the beta feature flag when we deploy custom attributes for Interactions in Conversation Table in to production.
        url: '/realtime-dashboards/viewer/:dashboardId?beta',
        title: 'Reporting - Realtime Dashboards',
        titleMessageId: 'title.realtime-dashboards-management-viewer',
        templateUrl: 'app/components/reporting/realtime/realtimeDashboards.html',
        controller: 'RealtimeDashboardsController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewAssignedReports);
            }
          ],
          dashboard: [
            '$stateParams',
            function($stateParams) {
              delete $stateParams.id;
              return $stateParams.dashboardId || 'overview-dashboard';
            }
          ],
          dashboards: [
            'UserPermissions',
            'RealtimeDashboardsSettings',
            'RealtimeDashboard',
            'Session',
            '$q',
            '$translate',
            '$stateParams',
            function(
              UserPermissions,
              RealtimeDashboardsSettings,
              RealtimeDashboard,
              Session,
              $q,
              $translate,
              $stateParams
            ) {
              var deferred = $q.defer();
              var withoutActiveDashboard = true;

              var isStandardDashbaord = false;
              for (var i = 0; i < RealtimeDashboardsSettings.mockDashboards.length; i++) {
                if ($stateParams.dashboardId == RealtimeDashboardsSettings.mockDashboards[i].id) {
                  isStandardDashbaord = true;
                }
              }
              var fetchDashboards = function() {
                CxEngage.entities.getDashboards(
                  { excludeInactive: true, withoutActiveDashboard: withoutActiveDashboard },
                  function(error, topic, response) {
                    if (!error) {
                      // Add category attribute to each dashboard so they can be grouped together in the dropdown
                      var allPromise = response.result.map(function(item) {
                        item.dashboardCategory = $translate.instant('realtimeDashboards.category.custom');
                        var defer2 = $q.defer();
                        if ($stateParams.dashboardId == item.id && !isStandardDashbaord) {
                          CxEngage.entities.getEntity({ path: ['dashboards', item.id] }, function(err, topic1, resp) {
                            if (!err) {
                              item.activeDashboard = resp.result.activeDashboard;
                              item.activeDashboard.id = item.id;
                              item.activeDashboard.name = item.name;
                              defer2.resolve(item);
                            } else {
                              defer2.reject();
                            }
                          });
                        } else {
                          defer2.resolve(item);
                        }

                        return defer2.promise;
                      });

                      $q.all(allPromise).then(function(customDashboards) {
                        RealtimeDashboardsSettings.mockDashboards.forEach(function(item) {
                          item.dashboardCategory = $translate.instant('realtimeDashboards.category.standard');
                        });

                        // CXV1-12884 - Dropdown order
                        //  - Standard Dashboards: overview-dashboard first, followed by all other dashboards
                        //      sorted alphabetically, then all tables sorted alphabetically.
                        //  - Custom Dashboards: all custom dashboards sorted alphabetically.
                        // Sort all dashboards + tables
                        customDashboards = _.sortBy(customDashboards, 'name');
                        var standardDashboards = _.sortBy(RealtimeDashboardsSettings.mockDashboards, 'name');
                        // Separate tables from dashboards
                        var standardDashboardIds = [
                          'overview-dashboard',
                          'interactions-dashboard',
                          'queues-dashboard',
                          'resources-dashboard'
                        ];
                        var isStandardDashboard = function(dashboard) {
                          return _.contains(standardDashboardIds, dashboard.id);
                        };
                        var standardTables = _.reject(standardDashboards, isStandardDashboard);
                        standardDashboards = _.filter(standardDashboards, isStandardDashboard);
                        // Get overview-dashboard and push it to the top of the dashboard list.
                        var isOverviewDashboard = function(dashboard) {
                          return dashboard.id == 'overview-dashboard';
                        };
                        var overviewDashboard = _.find(standardDashboards, isOverviewDashboard);
                        standardDashboards = _.reject(standardDashboards, isOverviewDashboard);
                        standardDashboards.unshift(overviewDashboard);
                        // Combine all dashboards for display.
                        window.allDashboards = _.union(standardDashboards, standardTables, customDashboards)

                        var allDashboardsMapped = window.allDashboards.map(function(item) {
                          return { id: item.id, name: item.name, dashboardCategory: item.dashboardCategory };
                        });

                        if (!UserPermissions.hasPermission('VIEW_ALL_REALTIME_DASHBOARDS')) {
                          CxEngage.entities.getDataAccessMember(
                            {
                              dataAccessMemberId: Session.user.id
                            },
                            function(error, topic, response) {
                              if (response.result && response.result.length) {
                                var controlledReports = _.filter(response.result, function(report) {
                                  return report.reportType === 'realtime';
                                });

                                var assignedDashboards = [];

                                _.forEach(controlledReports, function(report) {
                                  assignedDashboards.push(report.realtimeReportName);
                                });

                                var filteredDashboards = _.filter(allDashboardsMapped, function(dashboard) {
                                  return _.includes(assignedDashboards, dashboard.name);
                                });
                              }

                              deferred.resolve(filteredDashboards);
                            }
                          );
                        } else {
                          deferred.resolve(allDashboardsMapped);
                        }
                      });
                    } //end of if.
                  }
                ); // end of CxEngage.entities.getDashboards()
              }; //end of fetchDashboards

              CxEngage.session.getActiveTenantId(function(error, topic, response) {
                if (response && response === Session.tenant.tenantId) {
                  fetchDashboards();
                } else {
                  CxEngage.session.setActiveTenant({ tenantId: Session.tenant.tenantId, noSession: true }, function() {
                    fetchDashboards();
                  });
                }
              });

              return deferred.promise;
            } // end of function
          ]
        }
      })
      .state('content.reporting', {
        abstract: true,
        url: '/reporting',
        title: 'Reporting - Reporting',
        templateUrl: 'app/components/reporting/reporting.html',
        controller: 'ReportingController'
      })
      .state('content.reporting.custom-stats', {
        redirectTo: 'content.management.users'
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
        title: 'Reporting - Custom Statistics - Editor',
        titleMessageId: 'title.reporting.custom-stats-editor',
        templateUrl: 'app/components/reporting/customStatsEditor/customStatsEditor.html',
        controller: 'customStatsEditorController',
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
            }
          ],
          customStat: [
            '$stateParams',
            'Session',
            'CustomStat',
            '$q',
            function($stateParams, Session, CustomStat, $q) {
              var deferred = $q.defer();
              var customStat;

              delete $stateParams.id;

              CustomStat.get(
                {
                  tenantId: Session.tenant.tenantId,
                  id: $stateParams.customStatId
                },
                function(data) {
                  customStat = data;
                  deferred.resolve(customStat);
                }
              );

              return deferred.promise;
            }
          ],
          draft: [
            '$stateParams',
            'CustomStatDraft',
            'Session',
            '$q',
            function($stateParams, CustomStatDraft, Session, $q) {
              var deferred = $q.defer();
              var draft;

              CustomStatDraft.get(
                {
                  customStatId: $stateParams.customStatId,
                  id: $stateParams.draftId,
                  tenantId: Session.tenant.tenantId
                },
                function(data) {
                  draft = data;
                  draft.readOnly = false;
                  deferred.resolve(draft);
                }
              );

              return deferred.promise;
            }
          ]
        }
      })
      .state('content.reporting.custom-stats-viewer', {
        url: '/custom-stats/viewer/:customStatId/:draftId/',
        title: 'Reporting - Custom Statistics - Viewer',
        titleMessageId: 'title.reporting.custom-stats-viewer',
        templateUrl: 'app/components/reporting/customStatsEditor/customStatsEditor.html',
        controller: 'customStatsEditorController',
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewCustomStats);
            }
          ],
          customStat: [
            '$stateParams',
            'Session',
            'CustomStat',
            '$q',
            function($stateParams, Session, CustomStat, $q) {
              var deferred = $q.defer();
              var customStat;

              delete $stateParams.id;

              CustomStat.get(
                {
                  tenantId: Session.tenant.tenantId,
                  id: $stateParams.customStatId
                },
                function(data) {
                  customStat = data;
                  deferred.resolve(customStat);
                }
              );

              return deferred.promise;
            }
          ],
          draft: [
            '$stateParams',
            'CustomStatVersion',
            'Session',
            '$q',
            function($stateParams, CustomStatVersion, Session, $q) {
              var deferred = $q.defer();
              var version;

              CustomStatVersion.get(
                {
                  customStatId: $stateParams.customStatId,
                  version: $stateParams.draftId,
                  tenantId: Session.tenant.tenantId
                },
                function(data) {
                  version = data;
                  version.readOnly = true;
                  deferred.resolve(version);
                }
              );

              return deferred.promise;
            }
          ]
        }
      })
      .state('content.qualityManagement', {
        url: '/qualityManagement',
        title: 'Quality Management',
        titleMessageId: 'title.qualityManagement',
        templateUrl: 'app/components/qualityManagement/qualityManagement.html',
        controller: 'qualityManagementController as qm',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function() {
              // Add UserPermissions and PermissionGroups back into the above function params
              // when we impliment this , remove to avoid linter errors
              // TODO: CXV1-12852 Permissions / Feature Flag for TelStrat page
              return true;
            }
          ]
        }
      })
      .state('content.support', {
        abstract: true,
        url: '/support-tool',
        title: 'Support Tool',
        templateUrl: 'app/components/supportTool/supportTool.html',
        controller: 'SupportToolController',
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewConfigSupport);
            }
          ]
        }
      })
      .state('content.support.debug', {
        url: '/debugger',
        title: 'Flow Debugger',
        titleMessageId: 'title.support.debug',
        templateUrl: 'app/components/supportTool/flowDebugger/flowDebuggerPage.html',
        controller: 'DebuggerPageController',
        reloadOnSearch: false,
        resolve: {
          hasPermission: [
            'UserPermissions',
            'PermissionGroups',
            function(UserPermissions, PermissionGroups) {
              return UserPermissions.resolvePermissions(PermissionGroups.viewConfigDebugTool);
            }
          ]
        }
      })
  }
]);
