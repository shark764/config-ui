'use strict';

describe('setFlowStatusBulkAction directive', function() {
  var $scope,
    element,
    isolateScope,
    $httpBackend,
    apiHostname;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname',
    function($compile, $rootScope, _$httpBackend, _apiHostname) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;

      element = $compile('<ba-set-flow-status bulk-action="bulkAction"></ba-set-flow-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set flow.active on bulkAction.execute', function() {
    var mockFlow = {
      id: 'id1',
    };

    var returnFlow = angular.copy(mockFlow);
    returnFlow.active = true;

    $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/flows/id1').respond(200, {
      result: returnFlow
    });

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockFlow);

    expect(mockFlow.active).toBeFalsy();

    $httpBackend.flush();

    expect(mockFlow.active).toEqual(true);
  });

  it('should should only have the attribute in the PUT payload', function() {
    var mockFlow = {
      id: 'id1'
    };
    $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/flows/id1', {
      active: true
    }).respond(200);

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockFlow);

    $httpBackend.flush();
  });
});
