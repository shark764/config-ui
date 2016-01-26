'use strict';

describe('setDispatchMappingStatusBulkAction directive', function() {
  var $scope,
    element,
    isolateScope,
    $httpBackend,
    apiHostname,
    mockDispatchMappings;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.dispatchMappings.dispatchMappingsController'));

  beforeEach(inject(['$compile', '$rootScope', 'mockDispatchMappings', '$httpBackend', 'apiHostname',
    function($compile, $rootScope, _mockDispatchMappings, _$httpBackend, _apiHostname) {
      $scope = $rootScope.$new();
      mockDispatchMappings = _mockDispatchMappings;
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;

      element = $compile('<ba-set-dispatch-mapping-status></ba-set-dispatch-mapping-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');
    
    var childElement = angular.element('<ba-set-dispatch-mapping-status></ba-set-dispatch-mapping-status>');
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

  it('should should set dispatchMapping.active on bulkAction.execute', function() {
    var returnMapping = angular.copy(mockDispatchMappings[0]);
    returnMapping.active = true;

    $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/dispatchMappingId1').respond(200, {
      result: returnMapping
    });

    expect(mockDispatchMappings[0].active).toBeFalsy();
    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockDispatchMappings[0]);

    $httpBackend.flush();

    expect(mockDispatchMappings[0].active).toEqual(true);
  });

  it('should only have the attribute in the PUT payload', function() {
    $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/dispatchMappingId1', {
      active: true
    }).respond(200);

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockDispatchMappings[0]);

    $httpBackend.flush();
  });
});
