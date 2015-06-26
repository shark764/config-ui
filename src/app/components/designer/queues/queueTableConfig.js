'use strict';

angular.module('liveopsConfigPanel')
  .service('queueTableConfig', ['statuses', function (statuses) {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'name'
        }, {
          'header': 'Description',
          'name': 'description'
        }, {
          'header': 'Active Version',
          'name': 'activeVersionName'
        }, {
          'header': 'Status',
          'name': 'status',
          'templateUrl': 'app/shared/templates/statuses.html',
          'options': statuses()
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : 'Queue Management'
      };
    }
  ]);
