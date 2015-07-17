'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', ['statuses', '$translate',
    function (statuses, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'name'
        }, {
          'header': $translate.instant('value.description'),
          'name': 'description'
        }, {
          'header': $translate.instant('group.table.members'),
          'name': 'members',
          'transclude': true,
        }, {
          'header': $translate.instant('value.status'),
          'name': 'status',
          'transclude': true,
          'options': statuses()
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : ['name'],
        'title' : $translate.instant('group.table.title')
      };
    }
  ]);
