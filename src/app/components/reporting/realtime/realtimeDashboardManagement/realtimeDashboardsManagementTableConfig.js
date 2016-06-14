'use strict';

angular.module('liveopsConfigPanel')
  .service('realtimeDashboardsManagementTableConfig', ['$translate',
    function($translate) {
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
        'showCreate': true
      };
    }
  ]);
