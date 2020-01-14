'use strict';

angular.module('liveopsConfigPanel')
  .service('realtimeDashboardsManagementTableConfig', ['$translate', 'UserPermissions', 'CustomDomain', function($translate, UserPermissions, CustomDomain) {

    var CustomDomainSvc = new CustomDomain();

    return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': '$original.name'
        }],
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'title': $translate.instant('realtimeDashboards.table.title'),
        'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Reporting/Realtime/Custom/Creating_dashboards.htm'),
        'baseHelpLink': '/Help/Content/Reporting/Realtime/Custom/Creating_dashboards.htm',
        'sref': 'content.custom-dashboards-management',
        'showBulkActions': false,
        'showCreate': function() {
          return UserPermissions.hasPermissionInList(['MANAGE_ALL_REALTIME_DASHBOARDS']);
        }
    };
  }]);
