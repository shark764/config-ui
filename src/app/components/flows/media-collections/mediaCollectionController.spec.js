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

      $controller('MediaCollectionController', {
        '$scope': $scope
      });
    }
  ]));

  it('should catch the create media event and set the selected media to new', 
    inject(function (Media, Session) {
    $scope.$broadcast('resource:details:create:media');

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
  
  describe('fetchMediaCollections function', function(){
    it('should exist', inject(function () {
      expect($scope.fetchMediaCollections).toBeDefined();
    }));
    
    it('should return the list of media collections', inject(['mockMediaCollections', function (mockMediaCollections) {
      var collection = $scope.fetchMediaCollections();
      $httpBackend.flush();
      expect(collection.length).toEqual(mockMediaCollections.length);
      expect(collection[0].id).toEqual(mockMediaCollections[0].id);
      expect(collection[1].id).toEqual(mockMediaCollections[1].id);
    }]));
  });

  describe('preSave prototype function', function () {
    it('should call cleanMediaMap if mediaMap is defined', inject(function () {
      var myCollection = new MediaCollection();
      myCollection.mediaMap = [];

      spyOn($scope, 'cleanMediaMap');

      myCollection.preSave();
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
});