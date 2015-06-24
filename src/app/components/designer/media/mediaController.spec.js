'use strict';
// jshint unused:false
describe('MediaController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    Session,
    mockMedias,
    Media,
    apiHostname,
    routeParams;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel', 'liveopsConfigPanel.mock.content.designer.media.mediaController'));
  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'Media', 'apiHostname', 'Session', 'medias',
    function ($rootScope, _$controller_, _$httpBackend_, _Media_, _apiHostname_, _Session_, _mockMedias_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      Media = _Media_;
      apiHostname = _apiHostname_;
      Session = _Session_;
      mockMedias =  _mockMedias_;
    }
  ]));
  
  describe('when fetch returns results', function() {
    beforeEach(function() {
      $controller('MediaController', {
        '$scope': $scope
      });
      
      $httpBackend.flush();
    })
    
    it('should populate $scope.medias when loaded', function() {
      expect($scope.medias).toBeDefined();
      expect($scope.medias[0].id).toEqual(mockMedias[0].id);
      expect($scope.medias[1].id).toEqual(mockMedias[1].id);
    });
    
    it('should call create when on:click:create event occurs', function () {
      $scope.$broadcast('on:click:create');
      expect($scope.selectedMedia).toBeDefined();
    });
  });
  
  
  describe('when fetch returns no results', function() {
    beforeEach(function() {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/media').respond({
        'result': []
      });
      
      $controller('MediaController', {
        '$scope': $scope
      });
      
      $httpBackend.flush();
    })
    
    it('should call create when not results are return from fetch', function () {
      expect($scope.selectedMedia.tenantId).toEqual(Session.tenant.tenantId);
      expect($scope.selectedMedia.properties).toEqual({});
    });
  });
  
  
});