'use strict';

describe('FlowManagementController', function () {
  var $scope,
    $controller,
    $httpBackend,
    Flow,
    apiHostname,
    Session,
    mockFlows,
    mockFlowVersions,
    $state;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows.versions'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows.drafts'));

  beforeEach(inject(['$rootScope', '$controller', '$injector', '$state', 'Flow', 'Session', 'apiHostname', 'mockFlows', 'mockFlowVersions',
    function ($rootScope, _$controller_, $injector, _$state_, _Flow_, _Session_, _apiHostname_, _mockFlows, _mockFlowVersions) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      Flow = _Flow_;
      $httpBackend = $injector.get('$httpBackend');
      mockFlows = _mockFlows;
      mockFlowVersions = _mockFlowVersions;
      $state = _$state_;
    }
  ]));

  beforeEach(function () {
    $controller('FlowManagementController', {
      '$scope': $scope
    });
  });

  describe('getVersions function', function() {
    it('should be defined', function () {
      expect($scope.getVersions).toBeDefined();
      expect($scope.getVersions).toEqual(jasmine.any(Function));
    });

    it('should query for the versions', function () {
      $scope.selectedFlow = mockFlows[0];
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions');

      $scope.getVersions();
      $httpBackend.flush();
    });

    it('should do nothing if there is no selected flow', inject(['FlowVersion',function (FlowVersion) {
      spyOn(FlowVersion, 'cachedQuery');
      $scope.selectedFlow = null;

      $scope.getVersions();
      expect(FlowVersion.cachedQuery).not.toHaveBeenCalled();
    }]));
  });

  describe('fetchFlows function', function() {
    it('should be defined', function () {
      expect($scope.fetchFlows).toBeDefined();
      expect($scope.fetchFlows).toEqual(jasmine.any(Function));
    });

    it('should query for the flows', function () {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/flows');
      Session.tenant.tenantId = 'tenant-id';

      $scope.fetchFlows();
      $httpBackend.flush();
    });
  });

  describe('create function', function () {
    it('should create a version if creating a new flow', function () {
      var newFlow = new Flow(mockFlows[2]);
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/flows/flowId3/drafts');
      spyOn($state, 'go');
      $scope.create();

      $httpBackend.flush();
    });
  });
});
