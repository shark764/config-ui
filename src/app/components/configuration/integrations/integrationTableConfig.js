'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', '$translate', 'UserPermissions', function (statuses, $translate, UserPermissions) {
    return {
      'fields': [{
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': 'type'
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': 'active',
        'id': 'status-column-dropdown',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['type'],
      'orderBy': 'type',
      'title' : $translate.instant('integration.table.title'),
      'showCreate': false,
      'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_PROVIDERS')
    };
  }]);
