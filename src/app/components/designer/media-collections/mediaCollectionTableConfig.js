'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaCollectionTableConfig', function () {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'name'
        }, {
          'header': 'Description',
          'name': 'description'
        }, {
          'header': 'Media Map',
          'name': 'properties'
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : 'Media Collections'
      };
    }
  );
