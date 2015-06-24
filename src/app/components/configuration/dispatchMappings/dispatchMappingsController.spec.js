'use strict';

describe('DispatchMappingsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    mockDispatchMappings,
    mockFlows,
    mockIntegrations,
    Session;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel', 
    'liveopsConfigPanel.mock.content.configuration.dispatchMappings.dispatchMappingsController'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'mockDispatchMappings', 'mockFlows', 'mockIntegrations',
    function ($rootScope, _$controller_, _$httpBackend_, _apiHostname_, _Session_, _mockDispatchMappings_, _mockFlows_, _mockIntegrations_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      $httpBackend = _$httpBackend_
      apiHostname = _apiHostname_;
      mockDispatchMappings = _mockDispatchMappings_;
      mockFlows = _mockFlows_;
      mockIntegrations = _mockIntegrations_;
    }
  ]));

  describe('with Session set', function () {
    beforeEach(function () {
      $controller('DispatchMappingsController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    });

    it('should fetch the list of dispatchMappings on load', function () {
      expect($scope.dispatchMappings).toBeDefined();
      expect($scope.dispatchMappings.length).toEqual(2);
      expect($scope.dispatchMappings[0].id).toEqual(mockDispatchMappings[0].id);
      expect($scope.dispatchMappings[1].id).toEqual(mockDispatchMappings[1].id);

      expect($scope.flows).toBeDefined();
      expect($scope.flows[0].id).toEqual(mockFlows[0].id);
      expect($scope.flows[1].id).toEqual(mockFlows[1].id);
    });

    it('should have a function to create a new dispatchMapping and set it as selected', function () {
      $scope.$broadcast('on:click:create');
      expect($scope.selectedDispatchMapping).toBeDefined();
    });
  });

  describe('with Session set', function () {
    beforeEach(function () {
      Session.tenant.tenantId = null;

      $controller('DispatchMappingsController', {
        '$scope': $scope
      });
    });

    it('should not fetch anthing if Session.tenant is not set', function () {
      expect($scope.dispatchMappings).not.toBeDefined();
    });
  });
});