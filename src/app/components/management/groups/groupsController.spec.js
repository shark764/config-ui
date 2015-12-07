'use strict';

/* global jasmine: false  */

describe('groups controller', function () {
  var $scope,
    mockUsers,
    mockGroups,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.group.mock'));
  beforeEach(module('liveopsConfigPanel.user.mock'));

  beforeEach(inject(['$rootScope', '$httpBackend', '$controller', 'apiHostname', 'Session', 'mockUsers', 'mockGroups', 'loEvents',
    function ($rootScope, $httpBackend, $controller, apiHostname, Session, _mockUsers, _mockGroups, _loEvents) {
      $scope = $rootScope.$new();
      mockUsers = _mockUsers;
      mockGroups = _mockGroups;
      loEvents = _loEvents;

      $controller('GroupsController', {
        '$scope': $scope
      });
      $scope.$digest();
    }
  ]));

  describe('fetch function', function () {
    it('should be defined', inject(function () {
      expect($scope.fetchGroups).toBeDefined();
    }));

    it('should query for groups', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups');
      $scope.fetchGroups();
      $httpBackend.flush();
    }]));
  });

  describe('createGroup function', function () {
    it('should catch the on:click:create event', inject(['Session', function (Session) {
      $scope.$broadcast(loEvents.tableControls.itemCreate);
      expect($scope.selectedGroup).toBeDefined();
      expect($scope.selectedGroup.tenantId).toEqual(Session.tenant.tenantId);
    }]));

    it('should set selectedGroup to default values', inject(function () {
      $scope.$broadcast(loEvents.tableControls.itemCreate);
      expect($scope.selectedGroup.tenantId).toEqual('tenant-id');
      expect($scope.selectedGroup.active).toBeTruthy();
      expect($scope.selectedGroup.owner).toEqual('userId1');
    }));
  });

  describe('Group.fetchGroupUsers function', function () {
    it('should be defined', inject(function (Group) {
      expect(Group.prototype.fetchGroupUsers).toBeDefined();
      expect(Group.prototype.fetchGroupUsers).toEqual(jasmine.any(Function));

      expect(mockGroups[0].fetchGroupUsers).toBeDefined();
    }));

    it('should query for the members list', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users');
      mockGroups[0].fetchGroupUsers();
      $httpBackend.flush();
    }]));

    it('should set the member property on the item', inject(['$httpBackend', 'apiHostname', 'mockGroupUsers', function ($httpBackend, apiHostname, mockGroupUsers) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users').respond(200, mockGroupUsers);
      expect(mockGroups[0].members).toBeUndefined();
      mockGroups[0].fetchGroupUsers();
      $httpBackend.flush();
      expect(mockGroups[0].members.length).toBe(3);
    }]));
    
    it('should set the memberList property on the selected group', inject(['$httpBackend', 'apiHostname', 'mockGroupUsers', function ($httpBackend, apiHostname, mockGroupUsers) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users').respond(200, mockGroupUsers);
      
      $scope.selectedGroup = mockGroups[0];
      expect($scope.selectedGroup.$memberList).toBeUndefined();
      mockGroups[0].fetchGroupUsers();
      $httpBackend.flush();
      expect($scope.selectedGroup.$memberList.length).toBe(3);
    }]));
  });
  
  describe('fetchUsers function', function () {
    it('should query for the tenant users list', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/users').respond(200);
      $scope.fetchUsers();
      $httpBackend.flush();
    }]));
  });
  
  describe('addMember function', function () {
    it('should post to tenant-group-users', inject(['$httpBackend', 'apiHostname', 'Group', function ($httpBackend, apiHostname, Group) {
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/group-id/users').respond(200);
      
      $scope.selectedGroup = new Group({id: 'group-id'});
      $scope.selectedGroup.$memberList = [];
      
      $scope.addMember({
        id: 'user-id'
      });
      
      $httpBackend.flush();
    }]));
    
    it('should reset the TenantUser cache', inject(['$httpBackend', 'apiHostname', 'Group', 'queryCache', function ($httpBackend, apiHostname, Group, queryCache) {
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/group-id/users').respond(200);
      
      $scope.selectedGroup = new Group({id: 'group-id'});
      $scope.selectedGroup.$memberList = [];
      
      spyOn(queryCache, 'remove');
      
      $scope.addMember({
        id: 'user-id'
      });
      
      $httpBackend.flush();
      expect(queryCache.remove).toHaveBeenCalledWith('TenantUser');
      
    }]));
  });
});
