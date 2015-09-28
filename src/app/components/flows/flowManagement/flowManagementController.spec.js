'use strict';

describe('FlowManagementController', function () {
  var $scope,
    $controller,
    $httpBackend,
    Flow,
    apiHostname,
    Session,
    mockFlows,
    mockFlowVersions;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows.versions'));
  
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'Flow', 'Session', 'apiHostname', 'mockFlows', 'mockFlowVersions',
    function ($rootScope, _$controller_, $injector, _Flow_, _Session_, _apiHostname_, _mockFlows, _mockFlowVersions) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      Flow = _Flow_;
      $httpBackend = $injector.get('$httpBackend');
      mockFlows = _mockFlows;
      mockFlowVersions = _mockFlowVersions;
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

  it('should have a function to create a new flow and set it as selected', function () {
    $scope.$broadcast('table:on:click:create');
    expect($scope.selectedFlow).toBeDefined();
    expect($scope.selectedFlow.tenantId).toBe(Session.tenant.tenantId);
  });

  describe('Flow.postCreate prototype function', function () {
    it('should create a version if creating a new flow', function () {
      var newFlow = new Flow(mockFlows[2]);
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/flows/flowId3/versions');
      var result = angular.extend(mockFlows[2], {
        activeVersion: 'flowVersionId4'
      });
      
      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/flows/flowId3').respond({
        'result': result
      });
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/flows/flowId3');
      
      newFlow.postCreate(newFlow);
      
      $httpBackend.flush();
      
      expect(newFlow.activeVersion).toEqual('flowVersionId4');
    });
  });
});