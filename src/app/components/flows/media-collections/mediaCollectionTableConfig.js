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
          'header': 'Identifiers',
          'name': 'identifier',
          'templateUrl' : 'app/components/flows/media-collections/mediaCollectionIdentifier.html'
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : 'Media Collections'
      };
    }
  );
