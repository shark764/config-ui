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
});