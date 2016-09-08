'use strict';

angular.module('liveopsConfigPanel')
  .service('realtimeDashboardsManagementTableConfig', ['$translate', 'UserPermissions',
    function($translate, UserPermissions) {
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
        'sref': 'content.realtime-dashboards-management',
        'showBulkActions': false,
        'showCreate': function() {
          return UserPermissions.hasPermissionInList(['MANAGE_ALL_REALTIME_DASHBOARDS']);
        }
      };
    }
  ]);
