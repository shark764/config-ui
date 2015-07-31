'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaCollectionTableConfig', ['$translate', function ($translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': '$original.name'
        }, {
          'header': $translate.instant('value.description'),
          'name': '$original.description'
        }, {
          'header': $translate.instant('value.identifier'),
          'resolve': function(collection) {
            var identifiers = [];
            for (var i = 0; i < collection.$original.mediaMap.length; i++){
              identifiers.push(collection.$original.mediaMap[i].lookup);
            }
            
            return identifiers.join(', ');
          }
        }],
        'searchOn' : ['$original.name'],
        'orderBy' : ['$original.name'],
        'title' : $translate.instant('media.collections.table.title')
      };
    }
  ]);
