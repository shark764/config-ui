'use strict';

/* global jasmine: false  */

describe('groups controller', function() {
  var $scope,
    mockUsers,
    mockGroups,
    loEvents,
    apiHostname,
    $httpBackend;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.group.mock'));
  beforeEach(module('liveopsConfigPanel.user.mock'));

  beforeEach(inject(['$rootScope', '$httpBackend', '$controller', 'apiHostname', 'Session', 'mockUsers', 'mockGroups', 'loEvents',
    function($rootScope, _$httpBackend, $controller, _apiHostname, Session, _mockUsers, _mockGroups, _loEvents) {
      $scope = $rootScope.$new();
      mockUsers = _mockUsers;
      mockGroups = _mockGroups;
      loEvents = _loEvents;
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;

      $controller('GroupsController', {
        '$scope': $scope
      });
      $scope.$digest();
    }
  ]));

  describe('fetch function', function() {
    it('should be defined', inject(function() {
      expect($scope.fetchGroups).toBeDefined();
    }));

    it('should query for groups', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups');
      $scope.fetchGroups();
      $httpBackend.flush();
    });
  });

  describe('createGroup function', function() {
    it('should catch the on:click:create event', inject(function(Session) {
      $scope.$broadcast(loEvents.tableControls.itemCreate);
      expect($scope.selectedGroup).toBeDefined();
      expect($scope.selectedGroup.tenantId).toEqual(Session.tenant.tenantId);
    }));

    it('should set selectedGroup to default values', function() {
      $scope.$broadcast(loEvents.tableControls.itemCreate);
      expect($scope.selectedGroup.tenantId).toEqual('tenant-id');
      expect($scope.selectedGroup.active).toBeTruthy();
      expect($scope.selectedGroup.owner).toEqual('userId1');
    });
  });

  describe('Group.fetchGroupUsers function', function() {
    it('should be defined', inject(function(Group) {
      expect(Group.prototype.fetchGroupUsers).toBeDefined();
      expect(Group.prototype.fetchGroupUsers).toEqual(jasmine.any(Function));

      expect(mockGroups[0].fetchGroupUsers).toBeDefined();
    }));

    it('should query for the members list', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users');
      mockGroups[0].fetchGroupUsers();
      $httpBackend.flush();
    });

    it('should set the member property on the item', inject(function(mockGroupUsers) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users').respond(200, mockGroupUsers);
      expect(mockGroups[0].members).toBeUndefined();
      mockGroups[0].fetchGroupUsers();
      $httpBackend.flush();
      expect(mockGroups[0].members.length).toBe(3);
    }));

    it('should set the memberList property on the selected group', inject(function(mockGroupUsers) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users').respond(200, mockGroupUsers);

      $scope.selectedGroup = mockGroups[0];
      expect($scope.selectedGroup.$memberList).toBeUndefined();
      mockGroups[0].fetchGroupUsers();
      $httpBackend.flush();
      expect($scope.selectedGroup.$memberList.length).toBe(3);
    }));
  });

  describe('fetchUsers function', function() {
    it('should query for the tenant users list', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/users').respond(200);
      $scope.fetchUsers();
      $httpBackend.flush();
    });
  });

  describe('addMember function', function() {
    it('should post to tenant-group-users', inject(function(Group) {
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/group-id/users').respond(200);

      $scope.selectedGroup = new Group({
        id: 'group-id'
      });
      $scope.selectedGroup.$memberList = [];

      $scope.addMember({
        id: 'user-id'
      });

      $httpBackend.flush();
    }));

    it('should reset the TenantUser cache', inject(function(Group, queryCache) {
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/group-id/users').respond(200);

      $scope.selectedGroup = new Group({
        id: 'group-id'
      });
      $scope.selectedGroup.$memberList = [];

      spyOn(queryCache, 'remove');

      $scope.addMember({
        id: 'user-id'
      });

      $httpBackend.flush();
      expect(queryCache.remove).toHaveBeenCalledWith('TenantUser');

    }));
  });

  describe('removeMember function', function() {
    it('should delete the record', inject(function(Session) {
      $scope.selectedGroup = {
        id: '1234',
        $memberList: []
      };

      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/groups/1234/users/6543').respond(200);

      $scope.removeMember({
        memberId: '6543'
      });

      $httpBackend.flush();
    }));
  });

  describe('submit function', function() {
    it('should save the selected group', inject(function(Session, Group) {
      $scope.selectedGroup = new Group({
        tenantId: 'tenant-id'
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/groups/1234/users').respond(200);
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups').respond(200, {
        result: {
          id: '1234',
          tenantId: 'tenant-id'
        }
      });

      $scope.submit();

      $httpBackend.flush();
    }));
  });
  
  describe('ON updateActive', function() {
    it('should save the group', inject(function(Group) {
      $scope.selectedGroup = new Group({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      $scope.selectedGroup.$original = $scope.selectedGroup;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/groups/1234').respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));
    
    it('should toggle the active property to true when it is false', inject(function(Group) {
      $scope.selectedGroup = new Group({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      $scope.selectedGroup.$original = $scope.selectedGroup;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/groups/1234', {
        active: true
      }).respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));
    
    it('should toggle the active property to false when it is true', inject(function(Group) {
      $scope.selectedGroup = new Group({
        tenantId: 'myTenant',
        active: true,
        id: '1234'
      });
      $scope.selectedGroup.$original = $scope.selectedGroup;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/groups/1234', {
        active: false
      }).respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should update only the active status', inject(function(Group) {
      $scope.selectedGroup = new Group({
        tenantId: 'myTenant',
        active: false,
        id: '1234',
        anotherProperty: 'somevalue'
      });

      $scope.selectedGroup.$original = $scope.selectedGroup;
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/groups/1234', {
        active: true
      }).respond(200);
      $scope.updateActive();

      $httpBackend.flush();
    }));

    it('should update the $original value on success', inject(function(Group) {
      $scope.selectedGroup = new Group({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });

      $scope.selectedGroup.$original = angular.copy($scope.selectedGroup);
      expect($scope.selectedGroup.$original.active).toBeFalsy();

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/groups/1234').respond(200, {
        result: {
          tenantId: 'myTenant',
          active: true,
          id: '1234'
        }
      });
      
      $scope.updateActive();

      $httpBackend.flush();
      
      expect($scope.selectedGroup.$original.active).toBeTruthy();
    }));
  });
});
