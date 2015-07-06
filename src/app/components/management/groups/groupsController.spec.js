'use strict';

/* global spyOn, jasmine: false  */

describe('groups controller', function () {
  var $scope,
    mockUsers,
    mockGroups;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$rootScope', '$httpBackend', '$controller', 'apiHostname', 'Session', 'mockUsers', 'mockGroups',
    function ($rootScope, $httpBackend, $controller, apiHostname, Session, _mockUsers, _mockGroups) {
      $scope = $rootScope.$new();
      mockUsers = _mockUsers;
      mockGroups = _mockGroups;

      $controller('GroupsController', {
        '$scope': $scope
      });
      $scope.$digest();
      $httpBackend.flush();
    }
  ]));

  it('should have groups', inject(function () {
    expect($scope.groups).toBeDefined();
    expect($scope.groups.length).toEqual(2);
  }));

  it('should refetch groups when tenant changes', function () {
    expect($scope.fetch).toBeDefined();
    spyOn($scope, 'fetch');

    $scope.Session.tenant = {
      tenantId: 'tenant-id-2'
    };

    $scope.$digest();
    expect($scope.fetch).toHaveBeenCalled();
  });

  describe('fetch function', function () {
    it('should be defined', inject(function () {
      expect($scope.fetch).toBeDefined();
    }));

    it('should query for groups', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups');
      $scope.fetch();
      $httpBackend.flush();
    }]));
  });

  describe('createGroup function', function () {
    it('should catch the on:click:create event', inject(['Session', function (Session) {
      $scope.$broadcast('on:click:create');
      expect($scope.selectedGroup).toBeDefined();
      expect($scope.selectedGroup.tenantId).toEqual(Session.tenant.tenantId);
    }]));

    it('should set selectedGroup to default values', inject(function () {
      $scope.$broadcast('on:click:create');
      expect($scope.selectedGroup.tenantId).toEqual('tenant-id');
      expect($scope.selectedGroup.status).toBeTruthy();
      expect($scope.selectedGroup.owner).toEqual('userId1');
    }));
  });

  describe('updateMembers function', function () {
    it('should be defined', inject(function () {
      expect($scope.updateMembers).toBeDefined();
      expect($scope.updateMembers).toEqual(jasmine.any(Function));
    }));

    it('should query for the members list', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users');
      $scope.updateMembers(mockGroups[0]);
      $httpBackend.flush();
    }]));
  });
});
