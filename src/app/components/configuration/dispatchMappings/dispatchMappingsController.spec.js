'use strict';

describe('DispatchMappingsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    dispatchMappings,
    flows,
    Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'apiHostname', 'Session',
    function ($rootScope, _$controller_, $injector, _apiHostname_, _Session_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      apiHostname = _apiHostname_;

      dispatchMappings = [{
        'id': 'id1',
      }, {
        'id': 'id2'
      }];

      flows = [{
        'id': 'flow-id-1'
      }, {
        'id': 'flow-id-1'
      }];

      Session.tenant.tenantId = 'tenant-id';

      $httpBackend = $injector.get('$httpBackend');
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/dispatch-mappings').respond({
        'result': dispatchMappings
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/flows').respond({
        'result': flows
      });

      $controller('DispatchMappingsController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    }
  ]));

  it('should fetch the list of dispatchMappings on load', function () {
    expect($scope.dispatchMappings).toBeDefined();
    expect($scope.dispatchMappings[0].id).toEqual(dispatchMappings[0].id);
    expect($scope.dispatchMappings[1].id).toEqual(dispatchMappings[1].id);

    expect($scope.flows).toBeDefined();
    expect($scope.flows[0].id).toEqual(flows[0].id);
    expect($scope.flows[1].id).toEqual(flows[1].id);
  });

  it('should have a function to create a new dispatchMapping and set it as selected', function () {
    $scope.$broadcast('on:click:create');
    expect($scope.selectedDispatchMapping).toBeDefined();
  });
});
