'use strict';

angular.module('liveopsConfigPanel')
  .service('skillTableConfig', ['statuses', '$translate', 'UserPermissions', 'ynStatuses', function (statuses, $translate, UserPermissions, ynStatuses) {
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
            'display': $translate.instant('skill.table.proficiency'),
            'options': ynStatuses(),
            'valuePath': 'value',
            'displayPath': 'display',
          },
          'filter': 'selectedOptions',
          'transclude': true,
          'name': 'hasProficiency'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'filter': 'selectedOptions',
          'transclude': true,
          'name': 'active'
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : 'name',
        'title': $translate.instant('skill.table.title'),
        'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_SKILLS'),
        'showCreate': UserPermissions.hasPermission('MANAGE_ALL_SKILLS'),
      };
    }
  ]);