'use strict';

angular.module('liveopsConfigPanel')
  .service('queueTableConfig', function () {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'name'
        }, {
          'header': 'Description',
          'name': 'description'
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : 'Queue Management'
      };
    }
  );
