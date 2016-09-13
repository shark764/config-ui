'use strict';

describe('IntegrationsController', function() {
  var $scope,
    $controller,
    $httpBackend,
    mockIntegrations,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.integration.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'mockIntegrations', 'loEvents',
    function($rootScope, _$controller, _$httpBackend, _mockIntegrations, _loEvents) {
      $scope = $rootScope.$new();
      $controller = _$controller;
      $httpBackend = _$httpBackend;
      mockIntegrations = _mockIntegrations;

      loEvents = _loEvents;

      $controller('IntegrationsController', {
        '$scope': $scope
      });
    }
  ]));

  describe('ON fetchIntegrations', function() {
    it('should fetch the list of integrations on load', function() {
      var integrations = $scope.fetchIntegrations();

      $httpBackend.flush();

      expect(integrations).toBeDefined();
      expect(integrations[0].id).toEqual(integrations[0].id);
      expect(integrations[1].id).toEqual(integrations[1].id);
    });

    it('should have a function to create a new integration and set it as selected', function() {
      $scope.$broadcast(loEvents.tableControls.itemCreate);
      expect($scope.selectedIntegration).toBeDefined();
    });
  });

  describe('ON submit', function() {
    it('should save the integration', inject(function(Integration, apiHostname) {
      $scope.selectedIntegration = new Integration();

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/integrations').respond(200);
      $scope.submit();

      $httpBackend.flush();
    }));
  });

  describe('ON updateActive', function() {
    it('should save the integration', inject(function(Integration, apiHostname) {
      $scope.selectedIntegration = new Integration({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      $scope.selectedIntegration.$original = $scope.selectedIntegration;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/integrations/1234').respond(200);
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/integrations/1234/listeners').respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should toggle the active property to true when it is false', inject(function(Integration, apiHostname) {
      $scope.selectedIntegration = new Integration({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      $scope.selectedIntegration.$original = $scope.selectedIntegration;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/integrations/1234', {
        active: true
      }).respond(200);

      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/integrations/1234/listeners').respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should toggle the active property to false when it is true', inject(function(Integration, apiHostname) {
      $scope.selectedIntegration = new Integration({
        tenantId: 'myTenant',
        active: true,
        id: '1234'
      });
      $scope.selectedIntegration.$original = $scope.selectedIntegration;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/integrations/1234', {
        active: false
      }).respond(200);

      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/integrations/1234/listeners').respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should update only the active status', inject(function(Integration, apiHostname) {
      $scope.selectedIntegration = new Integration({
        tenantId: 'myTenant',
        active: false,
        id: '1234',
        anotherProperty: 'somevalue'
      });

      $scope.selectedIntegration.$original = $scope.selectedIntegration;
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/integrations/1234', {
        active: true
      }).respond(200);
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/integrations/1234/listeners').respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should update the $original value on success', inject(function(Integration, apiHostname) {
      $scope.selectedIntegration = new Integration({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });

      $scope.selectedIntegration.$original = angular.copy($scope.selectedIntegration);
      expect($scope.selectedIntegration.$original.active).toBeFalsy();

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/integrations/1234').respond(200, {
        result: {
          tenantId: 'myTenant',
          active: true,
          id: '1234'
        }
      });
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/integrations/1234/listeners').respond(200);

      $scope.updateActive();

      $httpBackend.flush();

      expect($scope.selectedIntegration.$original.active).toBeTruthy();
    }));

    it('should return a rejected promise with the error message on error', function(done){
      inject(function(Integration, apiHostname) {
        $scope.selectedIntegration = new Integration({
          tenantId: 'myTenant',
          active: false,
          id: '1234'
        });

        $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/integrations/1234').respond(400, {
          error: {
            attribute : {
              active : 'This integration cannot be enabled'
            }
          }
        });

        $scope.updateActive().catch(function(error){
          expect(error).toEqual('This integration cannot be enabled');
          done();
        });

        $httpBackend.flush();
      });
    });
  });
});
