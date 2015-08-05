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
          'resolve': function(collection) {
            var identifiers = [];
            for (var i = 0; i < collection.mediaMap.length; i++){
              identifiers.push(collection.mediaMap[i].lookup);
            }
            
            return identifiers.join(', ');
          }
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : $translate.instant('media.collections.table.title')
      };
    }
  ]);
