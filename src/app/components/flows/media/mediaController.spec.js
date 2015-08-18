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
    routeParams;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel', 'liveopsConfigPanel.mock.content.flows.media.mediaController'));
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
  
  beforeEach(function() {
    $controller('MediaController', {
      '$scope': $scope
    });
  });
  
  describe('ON fetchMedias', function() {
    it('should be defined', function() {
      expect($scope.fetchMedias).toBeDefined();
    });

    it('should populate $scope.medias when loaded', function() {
      var medias = $scope.fetchMedias();
      
      $httpBackend.flush();
      
      expect(medias[0].id).toEqual(mockMedias[0].id);
      expect(medias[1].id).toEqual(mockMedias[1].id);
    });

    it('should call create when on:click:create event occurs', function () {
      $scope.$broadcast('table:on:click:create');
      expect($scope.selectedMedia).toBeDefined();
    });
  });
});