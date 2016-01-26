'use strict';

describe('setQueueStatusBulkAction directive', function() {
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

      element = $compile('<ba-set-queue-status></ba-set-queue-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));
  
  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');
    
    var childElement = angular.element('<ba-set-queue-status></ba-set-queue-status>');
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

  it('should should set queue.active on bulkAction.execute', function() {
    var mockQueue = {
      id: 'id1',
    };
    var returnQueue = angular.copy(mockQueue);
    returnQueue.active = true;

    $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/queues/id1').respond(200, {
      result: returnQueue
    });

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockQueue);

    expect(mockQueue.active).toBeFalsy();

    $httpBackend.flush();

    expect(mockQueue.active).toEqual(true);
  });

  it('should should only have the attribute in the PUT payload', function() {
    var mockQueue = {
      id: 'id1'
    };
    $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/queues/id1', {
      active: true
    }).respond(200);

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockQueue);

    $httpBackend.flush();
  });
});
