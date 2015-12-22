'use strict';

describe('setIntegrationStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction,
    $httpBackend,
    apiHostname;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction', '$httpBackend', 'apiHostname',
    function(_$compile, _$rootScope, _BulkAction, _$httpBackend, _apiHostname) {
      $scope = _$rootScope.$new();
      $compile = _$compile;
      BulkAction = _BulkAction;
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;

      $scope.bulkAction = new BulkAction();

      element = $compile('<ba-set-integration-status bulk-action="bulkAction"></ba-set-integration-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set integration.active on bulkAction.execute', function() {
    var mockIntegration = {
      id: 'integration1'
    };

    var returnIntegration = angular.copy(mockIntegration);
    returnIntegration.active = true;

    $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/integrations/integration1').respond(200, {
      result: returnIntegration
    });

    expect(mockIntegration.active).toBeFalsy();
    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockIntegration);

    $httpBackend.flush();

    expect(mockIntegration.active).toEqual(true);
  });

  it('should should only have the attribute in the PUT payload', function() {
    $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/integrations/integration1', {
      active: true
    }).respond(200);

    var mockIntegration = {
      id: 'integration1'
    };

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockIntegration);

    $httpBackend.flush();
  });
});
