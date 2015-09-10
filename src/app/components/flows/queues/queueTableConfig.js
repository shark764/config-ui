'use strict';

angular.module('liveopsConfigPanel')
  .service('queueTableConfig', ['statuses', '$translate', 'UserPermissions', function (statuses, $translate, UserPermissions) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': 'name'
        }, {
          'header': {
            'display': $translate.instant('value.description')
          },
          'name': 'description'
        }, {
          'header': {
            'display': $translate.instant('value.details.activeVersion')
          },
          'transclude': true,
          'name': 'activeQueue'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'name': 'active',
          'id': 'status-column-dropdown',
          'lookup': '$original:active',
          'transclude': true,
        }],
        'searchOn' : ['name'],
        'orderBy' : 'name',
        'title' : $translate.instant('queue.table.title'),
        'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_QUEUES'),
        'showCreate': UserPermissions.hasPermission('MANAGE_ALL_QUEUES')
      };
    }
  ]);
