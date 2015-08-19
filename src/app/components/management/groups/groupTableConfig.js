'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', ['statuses', '$translate',
    function (statuses, $translate) {
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
            'display': $translate.instant('group.table.members')
          },
          'name': 'members',
          'transclude': true,
          'sortOn': 'members.length'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'name': 'active',
          'transclude': true,
          
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : 'name',
        'title' : $translate.instant('group.table.title')
      };
    }
  ]);
