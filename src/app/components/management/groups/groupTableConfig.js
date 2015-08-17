'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', ['statuses', '$translate',
    function (statuses, $translate) {
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
          'name': '$original.description'
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
          'name': '$original.active',
          'transclude': true,
          
        }],
        'searchOn' : ['$original.name', '$original.description'],
        'orderBy' : '$original.name',
        'title' : $translate.instant('group.table.title')
      };
    }
  ]);
