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
          'templateUrl': 'app/components/management/groups/templates/members.html'
        }, {
          'header': $translate.instant('value.status'),
          'name': 'status',
          'templateUrl': 'app/shared/templates/statuses.html',
          'options': statuses()
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : ['name'],
        'title' : $translate.instant('group.table.title')
      };
    }
  ]);
