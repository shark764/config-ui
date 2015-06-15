'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', function () {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'source'
        }, {
          'header': 'Description',
          'name': 'type'
        }, {
          'header': 'Properties',
          'name': 'properties'
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : 'Media'
      };
    }
  )
