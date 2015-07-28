'use strict';

describe('IntegrationsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    mockIntegrations,
    Session;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.integrations'));
  
  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'mockIntegrations',
    function ($rootScope, _$controller_, _$httpBackend, _apiHostname_, _Session_, _mockIntegrations) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend;
      Session = _Session_;
      apiHostname = _apiHostname_;
      mockIntegrations = _mockIntegrations;

      $controller('IntegrationsController', {
        '$scope': $scope
      });
    }
  ]));
  
  
  describe('ON fetchIntegrations', function() {
    it('should fetch the list of integrations on load', function () {
      var integrations = $scope.fetchIntegrations();
      
      $httpBackend.flush();
      
      expect(integrations).toBeDefined();
      expect(integrations[0].id).toEqual(integrations[0].id);
      expect(integrations[1].id).toEqual(integrations[1].id);
    });

    it('should have a function to create a new integration and set it as selected', function () {
      $scope.$broadcast('table:on:click:create');
      expect($scope.selectedIntegration).toBeDefined();
    });
  });
  

});
