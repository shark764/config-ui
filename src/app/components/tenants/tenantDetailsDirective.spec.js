'use strict';

describe('tenantDetails directive', function () {
  var $scope,
    $compile,
    Tenant,
    $httpBackend,
    element,
    tenant,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', 'Tenant', '$httpBackend', function (_$compile_, _$rootScope_, _Tenant_, _$httpBackend_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    Tenant = _Tenant_;
    $httpBackend = _$httpBackend_;
    
    tenant =  new Tenant();

    $scope.tenant = tenant;
    $httpBackend.when('GET', 'fakendpoint.com/v1/users').respond({'result' : []});
    $httpBackend.when('GET', 'fakendpoint.com/v1/regions').respond({'result' : []});
    $httpBackend.when('POST', 'fakendpoint.com/v1/tenants').respond({'result' : {}});
    
    element = $compile('<tenant-details tenant="tenant">')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  //TODO

});
