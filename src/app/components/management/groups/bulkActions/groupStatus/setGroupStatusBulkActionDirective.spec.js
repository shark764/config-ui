'use strict';

describe('setGroupStatusBulkAction directive', function() {
  var $scope,
    element,
    isolateScope,
    $httpBackend,
    apiHostname,
    mockGroups;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname', 'mockGroups',
    function($compile, $rootScope, _$httpBackend, _apiHostname, _mockGroups) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      mockGroups = _mockGroups;

      element = $compile('<ba-set-group-status></ba-set-group-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));
  
  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');
    
    var childElement = angular.element('<ba-set-group-status></ba-set-group-status>');
    element.append(childElement);
    var childScope = $rootScope.$new();
    childElement = $compile(childElement)(childScope);
    childScope.$digest();

    expect(baExecutorController.register).toHaveBeenCalled();
  }));

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });
  
  it('should override bulkAction.reset', function() {
    expect(isolateScope.bulkAction.reset).toBeDefined();

    isolateScope.active = true;
    isolateScope.bulkAction.checked = true;
    isolateScope.bulkAction.reset();
    expect(isolateScope.active).toBeFalsy();
    expect(isolateScope.bulkAction.checked).toBeFalsy();
  });

  it('should should set group.active on bulkAction.execute', function() {
    var returnGroup = angular.copy(mockGroups[0]);
    returnGroup.active = true;

    $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/groups/groupId1').respond(200, {
      result: returnGroup
    });

    expect(mockGroups[0].active).toBeFalsy();
    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockGroups[0]);

    $httpBackend.flush();

    expect(mockGroups[0].active).toEqual(true);
  });

  it('should only have the attribute in the PUT payload', function() {
    $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/groups/groupId1', {
      active: true
    }).respond(200);

    isolateScope.active = true;
    isolateScope.bulkAction.apply(mockGroups[0]);

    $httpBackend.flush();
  });

  it('should reject the change if attempting to edit the Everyone group', inject(function(Group) {
    var everyoneGroup = new Group({
      type: 'everyone',
      id: '123456',
      active: true
    });

    isolateScope.active = false;
    var result = isolateScope.bulkAction.apply(everyoneGroup);

    result.then(angular.noop, function(reason) {
      expect(reason).toEqual('Cannot disable the Everyone group');
    });

    $scope.$digest();
    expect(everyoneGroup.active).toBeTruthy();
  }));
});
