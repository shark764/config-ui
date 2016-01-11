'use strict';

angular.module('liveopsConfigPanel')
  .service('realtimeDashboardsTableConfig', ['$translate',
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
        'sref': 'content.dashboard',
        'showBulkActions': false,
        'showCreate': false
      };
    }
  ]);