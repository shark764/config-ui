'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', function () {
      return {
        'fields': [{
          'header': 'Source',
          'name': 'source'
        }, {
          'header': 'Type',
          'name': 'type'
        }, {
          'header': 'Properties',
          'name': 'properties'
        }],
        'searchOn' : ['source'],
        'orderBy' : ['source'],
        'title' : 'Media'
      };
    });
