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

  describe('ON isTelInput', function() {
    it('should return falsy if no dispatchMapping selected', function() {
      $scope.selectedDispatchMapping = null;

      var result = $scope.isTelInput();
      expect(result).toBeFalsy();
    });

    it('should return truthy if the selected dispatchMapping has an interactionField of "customer"', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        interactionField: 'customer'
      });

      var result = $scope.isTelInput();
      expect(result).toBeTruthy();
    }));
    
    it('should return truthy if the selected dispatchMapping has an interactionField of "contact-point"', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        interactionField: 'contact-point'
      });

      var result = $scope.isTelInput();
      expect(result).toBeTruthy();
    }));
    
    it('should return falsy if the selected dispatchMapping has an interactionField of "source"', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        interactionField: 'source'
      });

      var result = $scope.isTelInput();
      expect(result).toBeFalsy();
    }));
    
    it('should return falsy if the selected dispatchMapping has an interactionField of "direction"', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        interactionField: 'direction'
      });

      var result = $scope.isTelInput();
      expect(result).toBeFalsy();
    }));
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

  describe('submit function', function() {
    it('should be defined on scope', function() {
      expect($scope.submit).toBeDefined();
    });

    it('should save the selected dispatch mapping if it is new', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        tenantId: 'tenant-id'
      });

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/dispatch-mappings').respond(201);
      $scope.submit();
      $httpBackend.flush();
    }));

    it('should update the selected dispatch mapping if it already exists', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        tenantId: 'tenant-id',
        id: '12345'
      });

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/12345').respond(200);
      $scope.submit();
      $httpBackend.flush();
    }));
  });
  
  describe('updateActive function', function() {
    it('should save the dispatch mapping', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      $scope.selectedDispatchMapping.$original = $scope.selectedDispatchMapping;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/dispatch-mappings/1234').respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));
    
    it('should toggle the active property to true when it is false', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      $scope.selectedDispatchMapping.$original = $scope.selectedDispatchMapping;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/dispatch-mappings/1234', {
        active: true
      }).respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));
    
    it('should toggle the active property to false when it is true', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        tenantId: 'myTenant',
        active: true,
        id: '1234'
      });
      $scope.selectedDispatchMapping.$original = $scope.selectedDispatchMapping;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/dispatch-mappings/1234', {
        active: false
      }).respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should update only the active status', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        tenantId: 'myTenant',
        active: false,
        id: '1234',
        anotherProperty: 'somevalue'
      });

      $scope.selectedDispatchMapping.$original = $scope.selectedDispatchMapping;
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/dispatch-mappings/1234', {
        active: true
      }).respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should update the $original value on success', inject(function(DispatchMapping) {
      $scope.selectedDispatchMapping = new DispatchMapping({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });

      $scope.selectedDispatchMapping.$original = angular.copy($scope.selectedDispatchMapping);
      expect($scope.selectedDispatchMapping.$original.active).toBeFalsy();

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/dispatch-mappings/1234').respond(200, {
        result: {
          tenantId: 'myTenant',
          active: true,
          id: '1234'
        }
      });
      
      $scope.updateActive();

      $httpBackend.flush();
      
      expect($scope.selectedDispatchMapping.$original.active).toBeTruthy();
    }));
  });
});
