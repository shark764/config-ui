'use strict';

describe('TenantsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    routeParams,
    apiHostname,
    integrations,
    Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'apiHostname', 'Session',
    function ($rootScope, _$controller_, $injector, _apiHostname_, _Session_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      apiHostname = _apiHostname_;

      integrations = [{
        'id': 'id1',
      }, {
        'id': 'id2'
      }];

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/integrations').respond({
        'result': integrations
      });

      $controller('IntegrationsController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    }
  ]));

  it('should fetch the list of integrations on load', function () {
    expect($scope.integrations).toBeDefined();
    expect($scope.integrations[0].id).toEqual(integrations[0].id);
    expect($scope.integrations[1].id).toEqual(integrations[1].id);
  });

  it('should have a function to create a new integration and set it as selected', function () {
    $scope.$broadcast('on:click:create');
    expect($scope.selectedIntegration).toBeDefined();
  });
});