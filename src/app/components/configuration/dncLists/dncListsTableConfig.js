'use strict';

angular.module('liveopsConfigPanel')
  .service('dncListsTableConfig', ['statuses', '$translate', 'UserPermissions', function(statuses, $translate, UserPermissions) {
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
          'display': $translate.instant('dnc.table.expiration')
        },
        'name': '$original.expiration',
        'transclude': true,
        'optional': true
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': '$original.active',
        'id': 'status-column-dropdown',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title' : $translate.instant('dnc.table.title'),
      'sref' : 'content.configuration.dnc',
      'showCreate': function () {
        return UserPermissions.hasPermission('MANAGE_CAMPAIGNS');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('MANAGE_CAMPAIGNS');
      }
    };
  }]);
