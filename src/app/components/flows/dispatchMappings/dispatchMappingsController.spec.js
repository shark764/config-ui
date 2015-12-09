'use strict';

describe('DispatchMappingsController', function () {
  var $scope,
    $controller,
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
    function ($rootScope, _$controller_, _$httpBackend_, _apiHostname_, _Session_, _mockDispatchMappings, _mockFlows, _mockIntegrations, _loEvents) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      $httpBackend = _$httpBackend_;
      apiHostname = _apiHostname_;
      mockDispatchMappings = _mockDispatchMappings;
      mockFlows = _mockFlows;
      mockIntegrations = _mockIntegrations;
      loEvents = _loEvents;
    }
  ]));

  beforeEach(function () {
    $controller('DispatchMappingsController', {
      '$scope': $scope
    });
  });
  
  describe('ON fetchDispatchMappings', function() {
    it('should be defined', function() {
      expect($scope.fetchDispatchMappings);
    });
    
    it('should return dispatchMappings on call', function () {
      var dispatchMappings = $scope.fetchDispatchMappings();
      
      $httpBackend.flush();
      
      expect(dispatchMappings).toBeDefined();
      expect(dispatchMappings.length).toEqual(2);
      expect(dispatchMappings[0].id).toEqual(mockDispatchMappings[0].id);
      expect(dispatchMappings[1].id).toEqual(mockDispatchMappings[1].id);
    });
  });
  
  describe('ON fetchFlows', function() {
    it('should be defined', function() {
      expect($scope.fetchFlows);
    });
    
    it('should return flows on call', function () {
      var flows = $scope.fetchFlows();
      
      $httpBackend.flush();
      
      expect(flows).toBeDefined();
      expect(flows[0].id).toEqual(mockFlows[0].id);
      expect(flows[1].id).toEqual(mockFlows[1].id);
    });
  });
  
  describe('ON fetchIntegrations', function() {
    it('should be defined', function() {
      expect($scope.fetchIntegrations);
    });
    
    it('should return flows on call', function () {
      var integrations = $scope.fetchIntegrations();
      
      $httpBackend.flush();
      
      expect(integrations).toBeDefined();
      expect(integrations[0].id).toEqual(mockIntegrations[0].id);
      expect(integrations[1].id).toEqual(mockIntegrations[1].id);
    });
  });

  

  it('should have a function to create a new dispatchMapping and set it as selected', function () {
    $scope.$broadcast(loEvents.tableControls.itemCreate);
    expect($scope.selectedDispatchMapping).toBeDefined();
  });

  describe('with tenant not set', function () {
    beforeEach(function () {
      Session.tenant.tenantId = null;

      $controller('DispatchMappingsController', {
        '$scope': $scope
      });
    });

    it('should not fetch anything if Session.tenant is not set', function () {
      expect($scope.dispatchMappings).not.toBeDefined();
    });
  });
});