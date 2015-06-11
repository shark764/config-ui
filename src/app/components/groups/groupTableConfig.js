'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', [
    function () {
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
        }, {
          'header': 'Status',
          'name': 'status',
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : ['name']
      };
    }
  ])
