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

      element = $compile('<ba-set-group-status bulk-action="bulkAction"></ba-set-group-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
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
