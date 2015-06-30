'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', ['mediaTypes', function (mediaTypes) {
      return {
        'fields': [{
          'header': 'Source',
          'name': 'source'
        }, {
          'header': 'Type',
          'name': 'type',
          'options': mediaTypes,
          'filter': 'selectedOptions'
        }, {
          'header': 'Properties',
          'name': 'properties'
        }],
        'searchOn' : ['source'],
        'orderBy' : ['source'],
        'title' : 'Media'
      };
    }]
  );
