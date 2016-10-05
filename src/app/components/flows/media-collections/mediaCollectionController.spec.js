'use strict';

/* global spyOn: false */
describe('MediaCollectionController', function() {
  var $scope,
    $rootScope,
    $httpBackend,
    MediaCollection,
    apiHostname,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.mediaCollection.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'MediaCollection', 'apiHostname', 'loEvents',
    function(_$rootScope, $controller, _$httpBackend, _MediaCollection, _apiHostname, _loEvents) {
      $rootScope = _$rootScope;
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      MediaCollection = _MediaCollection;
      apiHostname = _apiHostname;
      loEvents = _loEvents;

      $controller('MediaCollectionController', {
        '$scope': $scope
      });
    }
  ]));

  it('should have a function to create a blank MediaCollection and set it as selected', inject(function(MediaCollection, Session) {
    $scope.create();

    expect($scope.selectedMediaCollection.tenantId).toEqual(Session.tenant.tenantId);
  }));

  it('should call create when the create button is clicked', function() {
    spyOn($scope, 'create');

    $rootScope.$broadcast(loEvents.tableControls.itemCreate);

    expect($scope.create).toHaveBeenCalled();
  });

  it('should catch the create media event', inject(function(Session) {
    $rootScope.$broadcast('resource:details:create:Media', [{
      lookup: 'item 1'
    }]);

    expect($scope.selectedMedia).not.toBeNull();
    expect($scope.selectedMedia.properties).toEqual({});
    expect($scope.selectedMedia.tenantId).toEqual(Session.tenant.tenantId);
  }));

  describe('fetchMediaCollections function', function() {
    it('should exist', inject(function() {
      expect($scope.fetchMediaCollections).toBeDefined();
    }));

    it('should return the list of media collections', inject(function(mockMediaCollections) {
      var collection = $scope.fetchMediaCollections();
      $httpBackend.flush();
      expect(collection.length).toEqual(mockMediaCollections.length);
      expect(collection[0].id).toEqual(mockMediaCollections[0].id);
      expect(collection[1].id).toEqual(mockMediaCollections[1].id);
    }));
  });

  describe('submitMediaCollection function', function() {
    it('should exist', inject(function() {
      expect($scope.submitMediaCollection).toBeDefined();
    }));

    it('should save the selected media collection', inject(function(mockMediaCollections) {
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/media-collections/mc1').respond(200);
      $scope.selectedMediaCollection = mockMediaCollections[0];
      $scope.selectedMediaCollection.tenantId = 'tenant-id';
      $scope.submitMediaCollection();
      $httpBackend.flush();
    }));
  });

  describe('submitMedia function', function() {
    it('should exist', inject(function() {
      expect($scope.submitMedia).toBeDefined();
    }));

    it('should call submit on the mediaDetails controller', inject(function($q) {
      $scope.mediaDetailsController = {
        submit: jasmine.createSpy('submit').and.callFake(function() {
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        })
      };

      $scope.submitMedia();
      expect($scope.mediaDetailsController.submit).toHaveBeenCalled();
    }));
  });

  describe('submitMediaAndNew function', function() {
    it('should exist', inject(function() {
      expect($scope.submitMediaAndNew).toBeDefined();
    }));

    it('should call submit on the mediaDetails controller', inject(function($q) {
      $scope.mediaDetailsController = {
        submit: jasmine.createSpy('submit').and.callFake(function() {
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        })
      };

      $scope.submitMediaAndNew();
      expect($scope.mediaDetailsController.submit).toHaveBeenCalled();
    }));
  });
});
