'use strict';

/* global spyOn: false */
describe('MediaCollectionController', function () {
  var $scope,
    $rootScope,
    $controller,
    $httpBackend,
    MediaCollection;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.media.collections'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'MediaCollection',
    function (_$rootScope_, _$controller_, _$httpBackend_, _MediaCollection_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      MediaCollection = _MediaCollection_;

      $controller('ContentController', {
        '$scope': $scope
      });
      $controller('MediaCollectionController', {
        '$scope': $scope
      });
      $httpBackend.flush();
    }
  ]));

  it('should have a function in the payload to media details to cancel the save', inject(function (Media) {
    $scope.selectedMedia = new Media({});
    $scope.waitingMedia = new Media({});

    $scope.$broadcast('resource:details:media:canceled');
    
    expect($scope.selectedMedia).toBeNull();
  }));

  it('should have a function in the payload to media details to save and set selected to a new media', inject(['Media', 'Session', '$timeout', function (Media, Session, $timeout) {
    $scope.selectedMedia = new Media({});

    $scope.$broadcast('resource:details:media:savedAndNew');
    $timeout.flush();
    expect($scope.selectedMedia).toEqual(new Media({
      properties: {},
      tenantId: Session.tenant.tenantId
    }));
  }]));

  it('should have a function in the payload to collections details to create a new media mapping which sets the waiting media, and sets the selected media to new', inject(function (Media, Session) {
    var newMedia = new Media({
      id: 'abc'
    });

    $scope.$broadcast('resource:details:create:mediaMapping', newMedia);

    expect($scope.selectedMedia.tenantId).toEqual(Session.tenant.tenantId);
    expect($scope.selectedMedia.properties).toEqual({});
  }));

  it('should have a function to create a blank MediaCollection and set it as selected', inject(function (MediaCollection, Session) {
    $scope.create();

    expect($scope.selectedMediaCollection.tenantId).toEqual(Session.tenant.tenantId);
  }));

  it('should call create when the create button is clicked', inject(function () {
    spyOn($scope, 'create');

    $rootScope.$broadcast('table:on:click:create');

    expect($scope.create).toHaveBeenCalled();
  }));

  it('should have fetchMedias passed down to additionalCollections',
    inject(function () {
      expect($scope.additionalCollections.fetchMedias).toBeDefined();
    }));

  it('should have fetchMedias and fetchMediaCollections function and fetchMedias',
    inject(function () {
      expect($scope.fetchMedias).toBeDefined();
      expect($scope.fetchMediaCollections).toBeDefined();
    }));

  it('should watch for media being added, add it to its own list and not update the waiting media if its not set', inject(function (mockMedias, Media) {
    $scope.waitingMedia = null;

    var newMedia = new Media({
      id: 'abc'
    });

    spyOn($scope, 'fetchMedias').and.returnValue(mockMedias);

    $rootScope.$broadcast('resource:details:media:create:success', newMedia);

    var medias = $scope.fetchMedias();

    expect(medias.length).toBe(3);
    expect($scope.waitingMedia).toBeNull();
  }));

  it('should watch for media being added, add it to its own list and update the waiting media',
    inject(function (mockMedias, Media) {
      $scope.waitingMedia = new Media({});

      var newMedia = new Media({
        id: 'abc'
      });

      spyOn($scope, 'fetchMedias').and.returnValue(mockMedias);

      $rootScope.$broadcast('resource:details:media:create:success', newMedia);

      var medias = $scope.fetchMedias();

      expect(medias.length).toBe(3);
    }));

  describe('preCreate prototype function', function () {
    it('should call cleanMediaMap if mediaMap is defined', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [];

      spyOn($scope, 'cleanMediaMap');

      myCollection.preCreate();
      expect($scope.cleanMediaMap).toHaveBeenCalled();
    }));

    it('should do nothing if mediaMap is not defined', inject(function () {
      var myCollection = new MediaCollection({
        name: 'A cool name'
      });
      spyOn($scope, 'cleanMediaMap');

      myCollection.preCreate();
      expect($scope.cleanMediaMap).not.toHaveBeenCalled();
    }));
  });

  describe('preUpdate prototype function', function () {
    it('should strip unneeded properties from mediaMap', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [];

      spyOn($scope, 'cleanMediaMap');

      myCollection.preUpdate();
      expect($scope.cleanMediaMap).toHaveBeenCalled();
    }));

    it('should do nothing if mediaMap is not defined', inject(function () {
      var myCollection = new MediaCollection({
        name: 'A cool name'
      });
      spyOn($scope, 'cleanMediaMap');

      myCollection.preUpdate();
      expect($scope.cleanMediaMap).not.toHaveBeenCalled();
    }));
  });

  describe('cleanMediaMap function', function () {
    it('should exist', function () {
      expect($scope.cleanMediaMap).toBeDefined();
      expect($scope.cleanMediaMap).toEqual(jasmine.any(Function));
    });

    it('should strip unneeded properties from mediaMap', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [{
        name: 'A name',
        description: 'Some description',
        lookup: 'Lookup',
        id: 'uuid-value',
        $$hashKey: '123'
      }, {
        lookup: 'Lookup 2',
        id: 'uuid-value2',
        $$hashKey: '456'
      }];

      $scope.cleanMediaMap(myCollection);
      expect(myCollection.mediaMap[0]).toEqual({
        lookup: 'Lookup',
        id: 'uuid-value'
      });
      expect(myCollection.mediaMap[1]).toEqual({
        lookup: 'Lookup 2',
        id: 'uuid-value2'
      });
    }));

    it('should remove mediaMap if its langth is zero', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [];

      $scope.cleanMediaMap(myCollection);
      expect(myCollection.mediaMap).toBeUndefined();
    }));
  });

  describe('addMapping function', function () {
    it('should exist', function () {
      expect($scope.addMapping).toBeDefined();
      expect($scope.addMapping).toEqual(jasmine.any(Function));
    });

    it('should add an empty object to the mediaMap array, if defined.', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [{
        id: 'uuid-value'
      }];

      $scope.addMapping(myCollection);
      expect(myCollection.mediaMap.length).toBe(2);
      expect(myCollection.mediaMap[1]).toBeDefined();
      expect(myCollection.mediaMap[1]).toEqual({});
    }));

    it('should create a mediaMap array with an empty object, if no mediaMap exists', inject(function () {
      var myCollection = new MediaCollection();
      $scope.addMapping(myCollection);
      expect(myCollection.mediaMap).toBeDefined();
      expect(myCollection.mediaMap).toEqual(jasmine.any(Array));
      expect(myCollection.mediaMap.length).toBe(1);
      expect(myCollection.mediaMap[0]).toEqual({});
    }));
  });

  describe('removeMapping function', function () {
    it('should exist', function () {
      expect($scope.removeMapping).toBeDefined();
      expect($scope.removeMapping).toEqual(jasmine.any(Function));
    });

    it('should remove the custom form elements and set dirty', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [{
        id: 'uuid-value'
      }, {
        id: 'some other value'
      }];

      var form = {
        mediaMapChanges: {
          $setDirty: jasmine.createSpy('dirtySpy')
        },
        mapping1: {
          id: 'mapping1'
        },
        source1: {
          id: 'source1'
        },
        mapping0: {
          id: 'mapping0'
        },
        source0: {
          id: 'source0'
        }
      };

      $scope.removeMapping(myCollection, form, 1);

      expect(myCollection.mediaMap.length).toBe(1);
      expect(form.mediaMapChanges.$setDirty).toHaveBeenCalled();
    }));

    it('should remove the mediaMap property if no mappings are left', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [{
        id: 'uuid-value'
      }];

      var form = {
        mediaMapChanges: {
          $setDirty: jasmine.createSpy('dirtySpy')
        },
        $removeControl: jasmine.createSpy('formSpy'),
        mapping0: {
          id: 'mapping0'
        },
        source0: {
          id: 'source0'
        }
      };

      $scope.removeMapping(myCollection, form, 0);

      expect(myCollection.mediaMap).toBeUndefined();
    }));
  });
});