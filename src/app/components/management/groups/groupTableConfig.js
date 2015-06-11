'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', ['userStatuses',
    function (userStatuses) {
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
          'options': userStatuses
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : ['name']
      };
    }
  ])
