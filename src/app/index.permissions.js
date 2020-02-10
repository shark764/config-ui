(function() {
  'use strict';

  angular.module('liveopsConfigPanel.permissions', []).constant('PermissionGroups', {
    manageUsers: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'MANAGE_ALL_USER_EXTENSIONS',
      'MANAGE_ALL_GROUP_USERS',
      'MANAGE_ALL_USER_SKILLS',
      'MANAGE_ALL_USER_LOCATIONS',
      'MANAGE_TENANT_ENROLLMENT'
    ],
    viewUsers: ['VIEW_ALL_USERS', 'PLATFORM_VIEW_ALL_USERS'],
    viewUsersConfig: ['CONFIG_USERS_VIEW', 'PLATFORM_CONFIG_USERS_VIEW'],
    manageUserSkillsAndGroups: ['MANAGE_ALL_GROUPS', 'MANAGE_ALL_USER_SKILLS'],
    manageRoles: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'PLATFORM_CREATE_TENANT_ROLES',
      'VIEW_ALL_ROLES',
      'MANAGE_ALL_ROLES',
      'MANAGE_TENANT_ENROLLMENT'
    ],
    manageAllMedia: ['MANAGE_ALL_MEDIA'],
    manageCapacityRules: ['MANAGE_ALL_CAPACITY_RULES'],
    manageSkills: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'VIEW_ALL_SKILLS',
      'MANAGE_ALL_SKILLS',
      'MANAGE_ALL_USER_SKILLS',
      'MANAGE_TENANT_ENROLLMENT'
    ],
    manageGroups: [
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
      'VIEW_ALL_GROUPS',
      'MANAGE_ALL_GROUPS',
      'MANAGE_ALL_GROUP_USERS',
      'MANAGE_ALL_GROUP_OWNERS',
      'MANAGE_TENANT_ENROLLMENT'
    ],
    accessAllTenants: [
      'PLATFORM_VIEW_ALL_TENANTS',
      'PLATFORM_MANAGE_ALL_TENANTS',
      'PLATFORM_CREATE_ALL_TENANTS',
      'PLATFORM_CREATE_TENANT_ROLES',
      'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT'
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
    viewReasons: ['READ_PRESENCE_REASONS'],
    viewReasonLists: ['READ_REASON_LIST'],
    viewFlows: ['VIEW_ALL_FLOWS'],
    viewFlowDebugLogs:  ['VIEW_FLOW_DEBUG_LOGS','PLATFORM_VIEW_FLOW_DEBUG_LOGS'],
    viewDispositions: ['READ_DISPOSITIONS'],
    viewDispositionLists: ['READ_DISPOSITION_LIST'],
    viewQueues: ['VIEW_ALL_FLOWS'],
    viewMedia: ['VIEW_ALL_MEDIA'],
    viewDispatchMappings: ['VIEW_ALL_CONTACT_POINTS'],
    viewCustomAttributes: ['INTERACTION_ATTRIBUTES_CONFIG_READ'],
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
      'VIEW_ALL_USERS',
      'VIEW_ALL_SKILLS',
      'VIEW_ALL_GROUPS',
      'VIEW_ALL_ROLES',
      'VIEW_ALL_PROVIDERS',
      'VIEW_ALL_BUSINESS_HOURS',
      'VIEW_CAMPAIGNS',
      'READ_PRESENCE_REASONS',
      'READ_REASON_LIST',
      'VIEW_ALL_FLOWS',
      'READ_DISPOSITIONS',
      'READ_DISPOSITION_LIST',
      'VIEW_ALL_MEDIA',
      'VIEW_ALL_CONTACT_POINTS',
      'VIEW_ALL_REALTIME_DASHBOARDS',
      'CUSTOM_STATS_READ',
      'MANAGE_ALL_LISTS',
      'VIEW_ALL_TRANSFER_LISTS',
      'IDENTITY_PROVIDERS_READ',
      'CONFIG_REPORTING_BI_VIEW'
    ],

    viewConfigSupport: ['PLATFORM_CONFIG_SUPPORT_TOOLS_VIEW'],
    viewConfigDebugTool: ['PLATFORM_CONFIG_SUPPORT_DEBUG_TOOL_VIEW'],
    viewDebugTool: ['PLATFORM_FLOW_DEBUG_TOOL_VIEW']
  });
})();
