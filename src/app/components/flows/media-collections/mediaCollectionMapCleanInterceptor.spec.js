'use strict';

describe('mediaCollectionMapCleanTransformer service', function() {
  var mediaCollectionMapCleanTransformer;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['mediaCollectionMapCleanTransformer', function(_mediaCollectionMapCleanTransformer_) {
    mediaCollectionMapCleanTransformer = _mediaCollectionMapCleanTransformer_;
  }]));

  it('should remove name and description from all items in the media map', inject(function(MediaCollection) {
    var collection = new MediaCollection({
      mediaMap: [{
        name: 'a name',
        description: 'a description',
        lookup: 'some value'
      }, {
        name: 'another name',
        description: 'another description',
        lookup: 'some other value'
      }]
    });

    mediaCollectionMapCleanTransformer(collection);
    expect(collection.mediaMap[0].name).toBeUndefined();
    expect(collection.mediaMap[0].description).toBeUndefined();
    expect(collection.mediaMap[1].name).toBeUndefined();
    expect(collection.mediaMap[1].description).toBeUndefined();
  }));
});
