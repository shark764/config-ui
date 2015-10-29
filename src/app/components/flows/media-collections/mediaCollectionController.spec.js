'use strict';

/* global spyOn: false */
describe('MediaCollectionController', function () {
  var $scope,
    $rootScope,
    $controller,
    $httpBackend,
    MediaCollection,
    apiHostname;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.mock.content.media.collections'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'MediaCollection', 'apiHostname',
    function (_$rootScope_, _$controller_, _$httpBackend_, _MediaCollection_, _apiHostname) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      MediaCollection = _MediaCollection_;
      apiHostname = _apiHostname;

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
  
  it('should catch the create media event', inject(['Session', function (Session) {
    $rootScope.$broadcast('resource:details:create:Media', [{
      lookup: 'item 1'
    }]);

    expect($scope.selectedMedia).not.toBeNull();
    expect($scope.selectedMedia.properties).toEqual({});
    expect($scope.selectedMedia.tenantId).toEqual(Session.tenant.tenantId);
  }]));
  
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
  
  describe('submitMediaCollection function', function(){
    it('should exist', inject(function () {
      expect($scope.submitMediaCollection).toBeDefined();
    }));
    
    it('should save the selected media collection', inject(['mockMediaCollections', function (mockMediaCollections) {
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/media-collections/mc1').respond(200);
      $scope.selectedMediaCollection = mockMediaCollections[0];
      $scope.selectedMediaCollection.tenantId = 'tenant-id';
      $scope.submitMediaCollection();
      $httpBackend.flush();
    }]));
  });
  
  describe('submitMedia function', function(){
    it('should exist', inject(function () {
      expect($scope.submitMedia).toBeDefined();
    }));
    
    it('should call submit on the mediaDetails controller', inject(['$q', function ($q) {
      $scope.mediaDetailsController = {
        submit : jasmine.createSpy('submit').and.callFake(function(){
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        })
      };
      
      $scope.submitMedia();
      expect($scope.mediaDetailsController.submit).toHaveBeenCalled();
    }]));
    
    it('should set the selectedMedia to null on success', inject(['$q', function ($q) {
      $scope.mediaDetailsController = {
        submit : jasmine.createSpy('submit').and.callFake(function(){
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        })
      };
      
      $scope.selectedMedia = {id: 'media'};
      $scope.submitMedia();
      $scope.$digest();
      expect($scope.selectedMedia).toBeNull();
    }]));
  });
  
  describe('submitMediaAndNew function', function(){
    it('should exist', inject(function () {
      expect($scope.submitMediaAndNew).toBeDefined();
    }));
    
    it('should call submit on the mediaDetails controller', inject(['$q', function ($q) {
      $scope.mediaDetailsController = {
        submit : jasmine.createSpy('submit').and.callFake(function(){
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        })
      };
      
      $scope.submitMediaAndNew();
      expect($scope.mediaDetailsController.submit).toHaveBeenCalled();
    }]));
    
    it('should set the selectedMedia to an empty media on success', inject(['$q', 'Session', function ($q, Session) {
      $scope.mediaDetailsController = {
        submit : jasmine.createSpy('submit').and.callFake(function(){
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        })
      };
      
      $scope.selectedMedia = {id: 'media'};
      $scope.submitMediaAndNew();
      $scope.$digest();
      expect($scope.selectedMedia).not.toBeNull();
      expect($scope.selectedMedia.properties).toEqual({});
      expect($scope.selectedMedia.tenantId).toEqual(Session.tenant.tenantId);
    }]));
  });
});