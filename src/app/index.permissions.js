(function() {
  'use strict';

  angular.module('liveopsConfigPanel.permissions', []).constant('PermissionGroups', {
    manageUsers: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'MANAGE_ALL_USER_EXTENSIONS',
      'MANAGE_ALL_GROUP_USERS',
      'MANAGE_ALL_USER_SKILLS',
      'MANAGE_ALL_USER_LOCATIONS',
      'MANAGE_TENANT_ENROLLMENT',
      'PLATFORM_VIEW_ALL'
    ],
    viewUsers: ['VIEW_ALL_USERS', 'PLATFORM_VIEW_ALL_USERS', 'PLATFORM_VIEW_ALL'],
    viewUsersConfig: ['CONFIG_USERS_VIEW', 'PLATFORM_CONFIG_USERS_VIEW', 'PLATFORM_VIEW_ALL'],
    manageUserSkillsAndGroups: ['MANAGE_ALL_GROUPS', 'MANAGE_ALL_USER_SKILLS', 'PLATFORM_VIEW_ALL'],
    manageRoles: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'PLATFORM_CREATE_TENANT_ROLES',
      'VIEW_ALL_ROLES',
      'MANAGE_ALL_ROLES',
      'MANAGE_TENANT_ENROLLMENT',
      'PLATFORM_VIEW_ALL'
    ],
    manageAllMedia: ['MANAGE_ALL_MEDIA', 'PLATFORM_VIEW_ALL'],
    manageCapacityRules: ['MANAGE_ALL_CAPACITY_RULES'],
    manageSkills: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'VIEW_ALL_SKILLS',
      'MANAGE_ALL_SKILLS',
      'MANAGE_ALL_USER_SKILLS',
      'MANAGE_TENANT_ENROLLMENT',
      'PLATFORM_VIEW_ALL'
    ],
    manageGroups: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'VIEW_ALL_GROUPS',
      'MANAGE_ALL_GROUPS',
      'MANAGE_ALL_GROUP_USERS',
      'MANAGE_ALL_GROUP_OWNERS',
      'MANAGE_TENANT_ENROLLMENT',
      'PLATFORM_VIEW_ALL'
    ],
    accessAllTenants: [
      'PLATFORM_VIEW_ALL_TENANTS',
      'PLATFORM_MANAGE_ALL_TENANTS',
      'PLATFORM_CREATE_ALL_TENANTS',
      'PLATFORM_CREATE_TENANT_ROLES',
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT'
    ],
    manageCustomAttributes: [
      'INTERACTION_ATTRIBUTES_CONFIG_READ',
      'INTERACTION_ATTRIBUTES_CONFIG_CREATE',
      'INTERACTION_ATTRIBUTES_CONFIG_UPDATE',
      'PLATFORM_VIEW_ALL',
      'PLATFORM_MANAGE_ALL_INTERACTION_ATTRIBUTES'
    ],
    accessAllLists: ['VIEW_ALL_LISTS'],
    accessAllEmailTemplates: ['USER_MANAGEMENT_EMAIL_READ'],
    accessAllCustomStats: ['CUSTOM_STATS_READ', 'CUSTOM_STATS_CREATE', 'CUSTOM_STATS_UPDATE'],
    viewGroupMembers: ['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_TENANT_ENROLLMENT'],
    manageIdentityProviders: ['IDENTITY_PROVIDERS_CREATE', 'IDENTITY_PROVIDERS_UPDATE', 'IDENTITY_PROVIDERS_DELETE'],
    monitorAllCalls: ['MONITOR_ALL_CALLS'],

    viewTenants: ['PLATFORM_VIEW_ALL_TENANTS', 'MANAGE_TENANT'],
    viewIntegrations: ['VIEW_ALL_PROVIDERS'],
    viewBusinessHours: ['VIEW_ALL_BUSINESS_HOURS'],
    manageBusinessHours: ['MANAGE_ALL_BUSINESS_HOURS'],
    viewCampaigns: ['VIEW_CAMPAIGNS'],
    viewReasons: ['READ_PRESENCE_REASONS', 'PLATFORM_VIEW_ALL'],
    viewReasonLists: ['READ_REASON_LIST', 'PLATFORM_VIEW_ALL'],
    viewFlows: ['VIEW_ALL_FLOWS'],
    viewFlowDebugLogs:  ['VIEW_FLOW_DEBUG_LOGS','PLATFORM_VIEW_FLOW_DEBUG_LOGS'],
    viewDispositions: ['READ_DISPOSITIONS'],
    viewDispositionLists: ['READ_DISPOSITION_LIST'],
    viewQueues: ['VIEW_ALL_FLOWS'],
    viewMedia: ['VIEW_ALL_MEDIA'],
    viewDispatchMappings: ['VIEW_ALL_CONTACT_POINTS'],
    viewDashboards: ['VIEW_ALL_REALTIME_DASHBOARDS'],
    viewConfigReportingBI: ['CONFIG_REPORTING_BI_VIEW'],
    viewAssignedReports: ['VIEW_ALL_REALTIME_DASHBOARDS', 'ASSIGNED_REPORTS_READ'],
    viewInteractionMonitoring: ['VIEW_ALL_MONITORED_CALLS'],
    viewAgentStateMonitoring: ['MANAGE_ALL_USER_STATE', 'MANAGE_ALL_USERS_DIRECTION'],
    viewCustomStats: ['CUSTOM_STATS_READ'],
    viewAppCreds: ['MANAGE_ALL_APP_CREDENTIALS'],
    viewMessageTemplates: ['VIEW_ALL_MESSAGE_TEMPLATES'],
    viewContactAttributes: ['CONTACTS_ATTRIBUTES_READ'],
    viewContactLayouts: ['CONTACTS_LAYOUTS_READ'],
    viewIdentityProviders: ['IDENTITY_PROVIDERS_READ'],
    viewQualityManagement: ['QM_ENABLE'],
    viewOutboundIdentifiers: ['OUTBOUND_IDENTIFIER_READ'],
    viewChatWidgets: ['WEB_INTEGRATIONS_APP_READ'],
    betaFeatures: ['TENANT_FEATURES_UPDATE', 'PLATFORM_MANAGE_ALL_TENANTS'],

    readAllMode: [
      'PLATFORM_VIEW_ALL',
      'TENANT_FEATURES_UPDATE'
    ],

    viewConfigSupport: ['PLATFORM_CONFIG_SUPPORT_TOOLS_VIEW'],
    viewConfigDebugTool: ['PLATFORM_CONFIG_SUPPORT_DEBUG_TOOL_VIEW'],
    viewDebugTool: ['PLATFORM_FLOW_DEBUG_TOOL_VIEW']
  });
})();
