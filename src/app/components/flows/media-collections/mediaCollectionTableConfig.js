'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaCollectionTableConfig', ['$translate', function ($translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'name'
        }, {
          'header': $translate.instant('value.description'),
          'name': 'description'
        }, {
          'header': $translate.instant('value.identifier'),
          'name': 'identifier',
          'templateUrl' : 'app/components/flows/media-collections/mediaCollectionIdentifier.html'
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : $translate.instant('media.collections.table.title')
      };
    }
  ]);