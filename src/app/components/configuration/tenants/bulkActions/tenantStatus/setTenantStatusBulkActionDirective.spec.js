'use strict';

describe('setTenantStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.tenants'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();

    element = $compile('<ba-set-tenant-status bulk-action="bulkAction"></ba-set-tenant-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set tenant.status on bulkAction.execute', inject(['mockTenants', '$httpBackend', 'apiHostname',
    function(mockTenants, $httpBackend, apiHostname) {
      var returnTenant = angular.copy(mockTenants[0]);
      returnTenant.status = true;

      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id').respond(200, {
        result: returnTenant
      });
      
      expect(mockTenants[0].status).toBeFalsy();
      isolateScope.status = true;
      isolateScope.bulkAction.apply(mockTenants[0]);

      $httpBackend.flush();

      expect(mockTenants[0].status).toEqual(true);
    }
  ]));
  
  it('should should only have the attribute in the PUT payload',
    inject(['mockTenants', '$httpBackend', 'apiHostname',
      function (mockTenants, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id', {
          status: true
        }).respond(200);

        isolateScope.status = true;
        isolateScope.bulkAction.apply(mockTenants[0]);

        $httpBackend.flush();
      }
    ]));
});
