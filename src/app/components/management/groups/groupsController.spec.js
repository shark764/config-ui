'use strict';

/* global jasmine: false  */

describe('groups controller', function () {
  var $scope,
    mockUsers,
    mockGroups;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users.groups'));

  beforeEach(inject(['$rootScope', '$httpBackend', '$controller', 'apiHostname', 'Session', 'mockUsers', 'mockGroups',
    function ($rootScope, $httpBackend, $controller, apiHostname, Session, _mockUsers, _mockGroups) {
      $scope = $rootScope.$new();
      mockUsers = _mockUsers;
      mockGroups = _mockGroups;

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
      $scope.$broadcast('table:on:click:create');
      expect($scope.selectedGroup).toBeDefined();
      expect($scope.selectedGroup.tenantId).toEqual(Session.tenant.tenantId);
    }]));

    it('should set selectedGroup to default values', inject(function () {
      $scope.$broadcast('table:on:click:create');
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
  });
  
  describe('gotoUserPage function', function () {
    it('should be defined', inject(function () {
      expect($scope.gotoUserPage).toBeDefined();
      expect($scope.gotoUserPage).toEqual(jasmine.any(Function));
    }));
    
    it('should call $state transition to with the users page and given userId', inject(['$state', function ($state) {
      spyOn($state, 'transitionTo');
      $scope.gotoUserPage('1234');
      expect($state.transitionTo).toHaveBeenCalledWith('content.management.users', {id: '1234'});
    }]));
  });
});
