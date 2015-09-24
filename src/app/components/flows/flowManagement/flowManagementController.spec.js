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

  describe('ON fetchFlows', function() {
    it('should be defined', function () {
      expect($scope.fetchFlows).toBeDefined();
    });

    it('should return flows on call', function () {
      var flows = $scope.fetchFlows();

      $httpBackend.flush();

      expect(flows[0].id).toEqual(mockFlows[0].id);
      expect(flows[1].id).toEqual(mockFlows[1].id);
    });
  });

  describe('resource.postCreate function', function () {
    it('should create an initial draft if creating a new flow', function () {
      var newFlow = new Flow(mockFlows[2]);
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/flows/flowId3/drafts');
      spyOn($state, 'go');
      newFlow.postCreate(newFlow);

      $httpBackend.flush();
    });
  });
});
