'use strict';

describe('setIntegrationStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();

    element = $compile('<ba-set-integration-status bulk-action="bulkAction"></ba-set-integration-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set integration.status on bulkAction.execute', inject(['$httpBackend', 'apiHostname',
    function($httpBackend, apiHostname) {
      var mockIntegration = {
          id: 'integration1'
      }
      var returnIntegration = angular.copy(mockIntegration);
      returnIntegration.status = true;

      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/integrations/integration1').respond(200, {
        result: returnIntegration
      });
      
      expect(mockIntegration.status).toBeFalsy();
      isolateScope.status = true;
      isolateScope.bulkAction.apply(mockIntegration);

      $httpBackend.flush();

      expect(mockIntegration.status).toEqual(true);
    }
  ]));
  
  it('should should only have the attribute in the PUT payload',
    inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/integrations/integration1', {
          status: true
        }).respond(200);

        var mockIntegration = {
            id: 'integration1'
        }
        isolateScope.status = true;
        isolateScope.bulkAction.apply(mockIntegration);

        $httpBackend.flush();
      }
    ]));
});
