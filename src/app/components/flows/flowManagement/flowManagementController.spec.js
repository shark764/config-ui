'use strict';

describe('FlowManagementController', function() {
  var $scope,
    $httpBackend,
    Flow,
    apiHostname,
    Session,
    mockFlows,
    mockFlowVersions,
    $state;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.version.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.draft.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', '$state', 'Flow', 'Session', 'apiHostname', 'mockFlows', 'mockFlowVersions',
    function($rootScope, $controller, _$httpBackend, _$state, _Flow, _Session, _apiHostname, _mockFlows, _mockFlowVersions) {
      $scope = $rootScope.$new();
      Session = _Session;
      apiHostname = _apiHostname;
      Flow = _Flow;
      $httpBackend = _$httpBackend;
      mockFlows = _mockFlows;
      mockFlowVersions = _mockFlowVersions;
      $state = _$state;

      $controller('FlowManagementController', {
        '$scope': $scope
      });
    }
  ]));

  describe('getVersions function', function() {
    it('should be defined', function() {
      expect($scope.getVersions).toBeDefined();
      expect($scope.getVersions).toEqual(jasmine.any(Function));
    });

    it('should query for the versions', function() {
      $scope.selectedFlow = mockFlows[0];
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions');

      $scope.getVersions();
      $httpBackend.flush();
    });

    it('should do nothing if there is no selected flow', inject(function(FlowVersion) {
      spyOn(FlowVersion, 'cachedQuery');
      $scope.selectedFlow = null;

      $scope.getVersions();
      expect(FlowVersion.cachedQuery).not.toHaveBeenCalled();
    }));
  });

  describe('fetchFlows function', function() {
    it('should be defined', function() {
      expect($scope.fetchFlows).toBeDefined();
      expect($scope.fetchFlows).toEqual(jasmine.any(Function));
    });

    it('should query for the flows', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/flows');
      Session.tenant.tenantId = 'tenant-id';

      $scope.fetchFlows();
      $httpBackend.flush();
    });
  });
});
