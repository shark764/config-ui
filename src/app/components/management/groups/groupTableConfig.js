'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', ['statuses',
    function (statuses) {
      return {
        'fields': [{
          'header': 'Group Name',
          'name': 'name'
        }, {
          'header': 'Description',
          'name': 'description'
        }, {
          'header': 'Members',
          'name': 'members',
          'templateUrl': 'app/components/management/groups/templates/members.html'
        }, {
          'header': 'Status',
          'name': 'status',
          'templateUrl': 'app/shared/templates/statuses.html',
          'options': statuses()
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : ['name'],
        'title' : 'Groups Management'
      };
    }
  ]);
