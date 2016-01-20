'use strict';

angular.module('liveopsConfigPanel')
  .service('realtimeDashboardsManagementTableConfig', ['$translate',
    function($translate) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': 'name'
        }],
        'searchOn': ['name'],
        'orderBy': 'name',
        'title': $translate.instant('realtimeDashboards.table.title'),
        'sref': 'content.realtime-dashboards-management.editor',
        'showBulkActions': false,
        'showCreate': false
      };
    }
  ]);
