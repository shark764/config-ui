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
    $controller('ContentController', {
      '$scope': $scope
    });
    $controller('FlowManagementController', {
      '$scope': $scope
    });
    $httpBackend.flush();
  });

  it('should have flows defined', function () {
    expect($scope.flows).toBeDefined();
    expect($scope.flows[0].id).toEqual(mockFlows[0].id);
    expect($scope.flows[1].id).toEqual(mockFlows[1].id);
  });

  it('should have a function to create a new flow and set it as selected', function () {
    $scope.$broadcast('table:on:click:create');
    expect($scope.selectedFlow).toBeDefined();
    expect($scope.selectedFlow.tenantId).toBe(Session.tenant.tenantId);
  });

  describe('resource.postCreate function', function () {
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

  describe('fetch function', function () {
    it('should get data', function () {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/flows').respond({
        'result': mockFlows[0]
      });
      $scope.fetch();
      $httpBackend.flush();

      expect($scope.flows).toBeDefined();
      expect($scope.flows[0].id).toEqual(mockFlows[0].id);
    });
  });
});