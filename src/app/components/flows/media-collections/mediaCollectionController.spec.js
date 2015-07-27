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

  it('should have fetchMediaCollections function',
    inject(function () {
      expect($scope.fetchMediaCollections).toBeDefined();
    }));

  it('should watch for media being added, and reset selectedMedia', inject(function () {
      $scope.selectedMedia = {id: 'existing'};
      $rootScope.$broadcast('resource:details:media:create:success');
      expect($scope.selectedMedia).toBeNull();
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
});