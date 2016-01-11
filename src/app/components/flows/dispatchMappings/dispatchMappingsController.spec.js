'use strict';

describe('DispatchMappingsController', function() {
  var $scope,
    $controller,
    controller,
    $httpBackend,
    apiHostname,
    mockDispatchMappings,
    mockFlows,
    mockIntegrations,
    Session,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.dispatchMappings.dispatchMappingsController'));
  beforeEach(module('liveopsConfigPanel.tenant.integration.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'mockDispatchMappings', 'mockFlows', 'mockIntegrations', 'loEvents',
    function($rootScope, _$controller, _$httpBackend, _apiHostname, _Session, _mockDispatchMappings, _mockFlows, _mockIntegrations, _loEvents) {
      $scope = $rootScope.$new();
      $controller = _$controller;
      Session = _Session;
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      mockDispatchMappings = _mockDispatchMappings;
      mockFlows = _mockFlows;
      mockIntegrations = _mockIntegrations;
      loEvents = _loEvents;

      controller = $controller('DispatchMappingsController', {
        '$scope': $scope
      });
    }
  ]));

  describe('ON loadDispatchMappings', function() {
    it('should be defined on controller', function() {
      expect(controller.loadDispatchMappings);
    });

    it('should return dispatchMappings on call', function() {
      controller.loadDispatchMappings();

      $httpBackend.flush();

      expect($scope.dispatchMappings).toBeDefined();
      expect($scope.dispatchMappings.length).toEqual(2);
      expect($scope.dispatchMappings[0].id).toEqual(mockDispatchMappings[0].id);
      expect($scope.dispatchMappings[1].id).toEqual(mockDispatchMappings[1].id);
    });
  });

  describe('ON loadFlows', function() {
    it('should be defined on controller', function() {
      expect(controller.loadFlows);
    });

    it('should return flows on call', function() {
      controller.loadFlows();

      $httpBackend.flush();

      expect($scope.flows).toBeDefined();
      expect($scope.flows[0].id).toEqual(mockFlows[0].id);
      expect($scope.flows[1].id).toEqual(mockFlows[1].id);
    });
  });

  describe('ON loadIntegrations', function() {
    it('should be defined on controller', function() {
      expect(controller.loadIntegrations);
    });

    it('should return flows on call', function() {
      controller.loadIntegrations();

      $httpBackend.flush();

      expect($scope.integrations).toBeDefined();
      expect($scope.integrations[0].id).toEqual(mockIntegrations[0].id);
      expect($scope.integrations[1].id).toEqual(mockIntegrations[1].id);
    });
  });

  it('should have a function to create a new dispatchMapping and set it as selected', function() {
    $scope.$broadcast(loEvents.tableControls.itemCreate);
    expect($scope.selectedDispatchMapping).toBeDefined();
  });
});
