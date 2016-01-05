'use strict';
describe('MediaController', function() {
  var $scope,
    $httpBackend,
    apiHostname,
    Session,
    mockMedias,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel', 'liveopsConfigPanel.tenant.media.mock'));
  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'medias', 'loEvents',
    function($rootScope, $controller, _$httpBackend, _apiHostname, _Session, _mockMedias, _loEvents) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      Session = _Session;
      mockMedias = _mockMedias;
      loEvents = _loEvents;

      $controller('MediaController', {
        '$scope': $scope
      });
    }
  ]));

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

    it('should call create when on:click:create event occurs', function() {
      $scope.$broadcast(loEvents.tableControls.itemCreate);
      expect($scope.selectedMedia).toBeDefined();
    });
  });
});
