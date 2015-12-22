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

});
