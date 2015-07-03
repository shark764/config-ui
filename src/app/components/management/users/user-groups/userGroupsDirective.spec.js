'use strict';

/* global spyOn, jasmine : false */
describe('userGroups directive', function() {
  var $scope,
    $httpBackend,
    $compile,
    element,
    isolateScope,
    apiHostname,
    mockGroups,
    mockUserGroups,
    mockUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname', 'mockUsers', 'mockGroups', 'mockUserGroups',
    function(_$compile, _$rootScope_, _$httpBackend_, _apiHostname_, _mockUsers, _mockGroups, _mockUserGroups) {
      $compile = _$compile;
      $scope = _$rootScope_.$new();
      $httpBackend = _$httpBackend_;
      apiHostname = _apiHostname_;
      mockGroups = _mockGroups;
      mockUserGroups = _mockUserGroups;
      mockUsers = _mockUsers;
    }
  ]));

  beforeEach(function() {
    $scope.user = mockUsers[0];

    element = $compile('<user-groups user="user"></user-groups>')($scope);
    $scope.$digest();
    $httpBackend.flush();

    isolateScope = element.isolateScope();
    spyOn(isolateScope, 'updateCollapseState'); //Stub this out so we dont trigger digests in the tests
  });

  it('should have groups defined', inject(function() {
    expect(isolateScope.groups).toBeDefined();
  }));

  it('should load the groups for the tenant', inject(function() {
    expect(isolateScope.groups).toBeDefined();
    expect(isolateScope.groups.length).toEqual(2);
    expect(isolateScope.groups[0].id).toEqual(mockGroups[0].id);
    expect(isolateScope.groups[1].id).toEqual(mockGroups[1].id);
  }));

  it('should have userGroups defined', inject(function() {
    expect(isolateScope.userGroups).toBeDefined();
  }));

  it('should load the user\'s groups', inject(function() {
    expect(isolateScope.userGroups.length).toEqual(mockUserGroups.length);
    expect(isolateScope.userGroups[0].userId).toEqual(mockUserGroups[0].userId);
    expect(isolateScope.userGroups[0].groupId).toEqual(mockUserGroups[0].groupId);
  }));

  describe('fetch function', function() {
    it('should be called when user changes', inject(['User', function(User) {
      spyOn(isolateScope, 'fetch');
      $scope.user = new User({
        id: 2
      });
      $scope.$digest();
      expect(isolateScope.fetch).toHaveBeenCalled();
    }]));

    it('should do nothing if there is no tenant selected', inject(function(Session, TenantUserGroups) {
      Session.tenant = {};
      isolateScope.fetch();
      expect($scope.groups).not.toBeDefined();
      expect($scope.userGroups).not.toBeDefined();
    }));

    it('should load the user\'s groups', inject(function() {
      isolateScope.groups = [];
      isolateScope.fetch();
      $httpBackend.flush();
      expect(isolateScope.groups.length).toEqual(2);
      expect(isolateScope.groups[0].id).toEqual(mockGroups[0].id);
      expect(isolateScope.groups[1].id).toEqual(mockGroups[1].id);
    }));

    it('should update filtered', inject(function() {
      isolateScope.filtered = [];
      isolateScope.fetch();
      $httpBackend.flush();
      expect(isolateScope.filtered.length).toEqual(1);
      expect(isolateScope.filtered[0].id).toEqual(mockGroups[1].id);
    }));

    it('should call updatecollapsestate', inject(['$timeout', function($timeout) {
      isolateScope.fetch();
      $timeout.flush();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
    }]));
  });

  describe('remove function', function() {
    beforeEach(function() {
      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId1').respond({});
    });

    it('should call TenantUserGroup delete', inject(function() {
      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId1');
      isolateScope.remove({
        tenantId: 'tenant-id',
        memberId: 'userId1',
        groupId: 'groupId1'
      });
      $httpBackend.flush();
    }));

    it('should call updatecollapsestate', inject(['$timeout', function($timeout) {
      isolateScope.updateCollapseState.calls.reset();
      isolateScope.remove({
        tenantId: 'tenant-id',
        memberId: 'userId1',
        groupId: 'groupId1'
      });
      $timeout.flush();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
    }]));
  });

  describe('reset function', function() {
    it('should exist', inject(function() {
      expect(isolateScope.reset).toBeDefined();
      expect(isolateScope.reset).toEqual(jasmine.any(Function));
    }));

    it('should reset the context', inject(function() {
      isolateScope.reset();
      expect(isolateScope.selectedgroup).toBeUndefined();
      expect(isolateScope.addGroup.name.$touched).toBeFalsy();
      expect(isolateScope.newGroupUser.groupId).toBeNull();
      expect(isolateScope.newGroupUser.userId).toEqual('userId1');
      expect(isolateScope.saving).toBeFalsy();
    }));
  });

  describe('save function', function() {
    beforeEach(function() {
      isolateScope.newGroupUser = {
        $save: function() {}
      };
    });

    it('should exist', inject(function() {
      expect(isolateScope.save).toBeDefined();
      expect(isolateScope.save).toEqual(jasmine.any(Function));
    }));

    it('should set the saving flag to true', inject(function() {
      isolateScope.saveUserGroup = function() {};
      isolateScope.selectedGroup = {
        id: 'g1'
      };
      isolateScope.save();
      expect(isolateScope.saving).toBeTruthy();
    }));

    it('should call creategroup if the user entered a new one', inject(function() {
      spyOn(isolateScope, 'saveUserGroup');
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups');
      isolateScope.selectedGroup = {
        tenantId: 'tenant-id'
      };
      isolateScope.save();
      $httpBackend.flush();
    }));
  });

  describe('saveUserGroup function', function() {
    beforeEach(function() {
      isolateScope.newGroupUser = {
        id: 'newthing',
        $save: function(success) {
          success();
        }
      };
      isolateScope.selectedGroup = {
        id: 'newgroup'
      };
    });

    it('should exist', inject(function() {
      expect(isolateScope.saveUserGroup).toBeDefined();
      expect(isolateScope.saveUserGroup).toEqual(jasmine.any(Function));
    }));

    it('should call save on newUserGroup', inject(function() {
      spyOn(isolateScope.newGroupUser, '$save');
      isolateScope.saveUserGroup();
      expect(isolateScope.newGroupUser.$save).toHaveBeenCalled();
    }));

    it('should call fetch on success', inject(function() {
      spyOn(isolateScope, 'fetch');
      isolateScope.saveUserGroup();
      expect(isolateScope.fetch).toHaveBeenCalled();
    }));

    it('should call reset on success', inject(function() {
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserGroup();
      expect(isolateScope.reset).toHaveBeenCalled();
    }));

    it('should not reset on failure', inject(function() {
      isolateScope.newGroupUser.$save = function(success, failure) {
        failure();
      };
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserGroup();
      expect(isolateScope.reset).not.toHaveBeenCalled();
    }));

    it('should set saving to false on failure', inject(function() {
      isolateScope.newGroupUser.$save = function(success, failure) {
        failure();
      };
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserGroup();
      expect(isolateScope.saving).toBeFalsy();
    }));
  });

  describe('updateCollapseState function', function() {
    it('should exist', inject(function() {
      expect(isolateScope.updateCollapseState).toBeDefined();
      expect(isolateScope.updateCollapseState).toEqual(jasmine.any(Function));
    }));

    it('should be called on the resizehandle:resize event', inject(function() {
      isolateScope.updateCollapseState.calls.reset();
      $scope.$broadcast('resizehandle:resize');
      isolateScope.$digest();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
    }));
  });

  describe('createGroup function', function() {
    it('should exist', inject(function() {
      expect(isolateScope.createGroup).toBeDefined();
      expect(isolateScope.createGroup).toEqual(jasmine.any(Function));
    }));

    xit('should make call to create a group', inject(function() {
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups');
      isolateScope.createGroup('groupname');
      $httpBackend.flush();

      expect(isolateScope.selectedGroup).toEqual(mockGroups[2]);
    }));

    xit('should call success callback on success', inject(function() {
      var successSpy = jasmine.createSpy('success');
      var failSpy = jasmine.createSpy('fail');
      isolateScope.createGroup('groupname', successSpy, failSpy);
      $httpBackend.flush();
      expect(successSpy).toHaveBeenCalled();
    }));

    xit('should call fail callback on success', inject(function() {
      var successSpy = jasmine.createSpy('success');
      var failSpy = jasmine.createSpy('fail');
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/groups').respond(500);
      isolateScope.createGroup('groupname', successSpy, failSpy);
      $httpBackend.flush();
      expect(failSpy).toHaveBeenCalled();
    }));
  });
});
