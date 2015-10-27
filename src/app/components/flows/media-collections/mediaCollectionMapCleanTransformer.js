'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaCollectionMapCleanTransformer', [
    function() {
      return function(mediaCollection) {
        angular.forEach(mediaCollection.mediaMap, function(mediaMap) {
          delete mediaMap.name;
          delete mediaMap.description;
        });
        
        return mediaCollection;
      };
    }
  ]);
