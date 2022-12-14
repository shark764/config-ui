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

      element = $compile('<ba-set-flow-status></ba-set-flow-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');
    
    var childElement = angular.element('<ba-set-flow-status></ba-set-flow-status>');
    element.append(childElement);
    var childScope = $rootScope.$new();
    childElement = $compile(childElement)(childScope);
    childScope.$digest();

    expect(baExecutorController.register).toHaveBeenCalled();
  }));

  it('should override bulkAction.reset', function() {
    expect(isolateScope.bulkAction.reset).toBeDefined();

    isolateScope.bulkAction.checked = true;
    isolateScope.active = true;
    isolateScope.bulkAction.reset();
    expect(isolateScope.active).toBeFalsy();
    expect(isolateScope.bulkAction.checked).toBeFalsy();
  });

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
