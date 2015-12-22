'use strict';

describe('setTenantStatusBulkAction directive', function() {
  var $scope,
    element,
    isolateScope,
    mockTenants,
    $httpBackend,
    apiHostname;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'mockTenants', '$httpBackend', 'apiHostname',
    function($compile, $rootScope, _mockTenants, _$httpBackend, _apiHostname) {
      $scope = $rootScope.$new();
      mockTenants = _mockTenants;
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;

      element = $compile('<ba-set-tenant-status bulk-action="bulkAction"></ba-set-tenant-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set tenant.active on bulkAction.execute', function() {
    var returnTenant = angular.copy(mockTenants[0]);
    returnTenant.active = true;

    $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id').respond(200, {
      result: returnTenant
    });

    expect(mockTenants[0].active).toBeFalsy();
    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockTenants[0]);

    $httpBackend.flush();

    expect(mockTenants[0].active).toEqual(true);
  });

  it('should should only have the attribute in the PUT payload', function() {
    $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id', {
      active: true
    }).respond(200);

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockTenants[0]);

    $httpBackend.flush();
  });
});
