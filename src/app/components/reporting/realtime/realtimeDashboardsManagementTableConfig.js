'use strict';

angular.module('liveopsConfigPanel')
  .service('realtimeDashboardsManagementTableConfig', ['$translate', 'helpDocsHostname',
    function($translate, helpDocsHostname) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': 'name'
        }],
        'searchOn': ['name'],
        'orderBy': 'name',
        'helpLink': helpDocsHostname + '/Help/Content/Reporting/Realtime/Realtime_Report_Types.htm',
        'title': $translate.instant('realtimeDashboards.table.title'),
        'sref': 'content.realtime-dashboards-management.editor',
        'showBulkActions': false,
        'showCreate': false
      };
    }
  ]);
