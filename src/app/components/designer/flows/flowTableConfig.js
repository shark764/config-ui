'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', function () {
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
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : 'Flow Management'
      };
    }
  );
