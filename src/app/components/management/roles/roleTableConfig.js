'use strict';

angular.module('liveopsConfigPanel')
  .service('roleTableConfig', ['$translate', function ($translate) {
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
            'display': $translate.instant('role.table.permissions'),
          },
          'transclude': true,
          'name': 'permissions'
        }],
        'searchOn' : ['name'],
        'orderBy' : 'name',
        'title': $translate.instant('role.table.title'),
        'showBulkActions': false
      };
    }
  ]);