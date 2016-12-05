'use strict';

angular.module('liveopsConfigPanel')
  .service('keysTableConfig', ['statuses', '$translate', 'UserPermissions', function(statuses, $translate, UserPermissions) {
    return {
      'fields': [{
        'header': {
          'display': $translate.instant('value.name')
        },
        'name': '$original.name'
      }, {
        'header': {
          'display': $translate.instant('value.description')
        },
        'name': '$original.description',
        'optional': true
      }, {
        'header': {
          'display': $translate.instant('value.role')
        },
        'name': 'roleName'
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': '$original.status',
        'id': 'status-column-dropdown',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['$original.name', '$original.description', 'roleName'],
      'orderBy': '$original.name',
      'title': $translate.instant('keys.table.title'),
      'sref': 'content.configuration.keys',
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_APP_CREDENTIALS');
      },
      'showBulkActions': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_APP_CREDENTIALS');
      }
    };
  }]);
