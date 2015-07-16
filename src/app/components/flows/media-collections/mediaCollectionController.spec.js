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
    expect($scope.waitingMedia).toBeNull();
  }));

  it('should have a function in the payload to media details to save and set selected to null', inject(function (Media) {
    $scope.selectedMedia = new Media();
    $scope.selectedMediaCollection = new MediaCollection();
    $scope.selectedMediaCollection.postSave();

    expect($scope.selectedMedia).toBeNull();
  }));

  it('should have a function in the payload to media details to save and set selected to a new media', inject(function (Media, Session) {
    $scope.selectedMedia = new Media({});

    $scope.$broadcast('resource:details:media:savedAndNew');

    expect($scope.selectedMedia).toEqual(new Media({
      tenantId: Session.tenant.tenantId
    }));
  }));

  it('should have a function in the payload to collections details to create a new media mapping which sets the waiting media, and sets the selected media to new', inject(function (Media, Session) {
    var newMedia = new Media({
      id: 'abc'
    });

    $scope.$broadcast('resource:details:create:mediaMapping', newMedia);

    expect($scope.waitingMedia).toEqual(newMedia);

    expect($scope.selectedMedia.tenantId).toEqual(Session.tenant.tenantId);
    expect($scope.selectedMedia.properties).toEqual({});
  }));

  it('should have a function to create a blank MediaCollection and set it as selected', inject(function (MediaCollection, Session) {
    $scope.create();

    expect($scope.selectedMediaCollection.tenantId).toEqual(Session.tenant.tenantId);
    expect($scope.selectedMediaCollection.mediaMap).toEqual([]);
  }));

  it('should call create when the create button is clicked', inject(function () {
    spyOn($scope, 'create');

    $rootScope.$broadcast('table:on:click:create');

    expect($scope.create).toHaveBeenCalled();
  }));

  it('should call create if there are no media collections returned on fetch', inject(function (Session) {
    spyOn($scope, 'create');

    Session.tenant = {
      tenantId: '3'
    };
    $scope.fetch();
    $httpBackend.flush();

    expect($scope.create).toHaveBeenCalled();
  }));

  it('should have a function to fetch a fresh copy of data for both media and collections, but place the medias in additional scope',
    inject(function (mockMedias, mockMediaCollections) {
      $scope.additionalCollections.medias = [];
      $scope.mediaCollections = [];

      $scope.fetch();
      $httpBackend.flush();

      expect($scope.additionalCollections.medias.length).toEqual(mockMedias.length);
      expect($scope.mediaCollections.length).toEqual(mockMediaCollections.length);
    }));

  it('should watch for media being added, add it to its own list and not update the waiting media if its not set', inject(function (mockMedias, Media) {
    $scope.waitingMedia = null;

    var newMedia = new Media({
      id: 'abc'
    });

    $rootScope.$broadcast('resource:details:media:create:success', newMedia);

    expect($scope.medias.length).toBe(mockMedias.length + 1);
    expect($scope.waitingMedia).toBeNull();
  }));

  it('should watch for media being added, add it to its own list and update the waiting media', inject(function (mockMedias, Media, Session) {

    Session.tenant = {
      tenantId: '2'
    };
    $scope.$apply();
    $httpBackend.flush();

    $scope.waitingMedia = new Media({});

    var newMedia = new Media({
      id: 'abc'
    });

    $rootScope.$broadcast('resource:details:media:create:success', newMedia);

    expect($scope.medias.length).toBe(mockMedias.length + 1);
    expect($scope.waitingMedia).toEqual(newMedia);
  }));
});