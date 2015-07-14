'use strict';

describe('userGroupBulkAction', function () {
  var $httpBackend,
    apiHostname,
    UserGroupBulkAction,
    userGroupBulkActionTypes,
    userGroupBulkActionType,
    mockUsers,
    mockGroups,
    mockUserGroups;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users.groups'));

  beforeEach(inject(['$httpBackend', 'apiHostname', 'UserGroupBulkAction', 'userGroupBulkActionTypes', 'mockUsers', 'mockGroups', 'mockUserGroups',
    function (_$httpBackend, _apiHostname, _UserGroupBulkAction, _userGroupBulkActionTypes, _mockUsers, _mockGroups, _mockUserGroups) {
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      UserGroupBulkAction = _UserGroupBulkAction;
      userGroupBulkActionTypes = _userGroupBulkActionTypes;
      mockUsers = _mockUsers;
      mockGroups = _mockGroups;
      mockUserGroups = _mockUserGroups;
    }
  ]));

  describe('canExecute', function () {
    it('should return false when no group is selected', function () {
      var userGroupBulkAction = new UserGroupBulkAction();
      var canExecute = userGroupBulkAction.canExecute();
      expect(canExecute).toBeFalsy();
    });
  });

  describe('execute', function () {
    it('should call POST end-point', function () {
      var userGroupBulkAction = new UserGroupBulkAction();
      userGroupBulkAction.selectedGroup = mockGroups[1];

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users');

      userGroupBulkAction.execute(mockUsers[0]);

      $httpBackend.flush();
    });
  });

  describe('userGroupBulkActionType "add"', function () {
    beforeEach(function () {
      userGroupBulkActionType = userGroupBulkActionTypes[0];
    });

    it('should have functions defined', function () {
      expect(userGroupBulkActionType.execute).toBeDefined();
      expect(userGroupBulkActionType.canExecute).toBeDefined();
      expect(userGroupBulkActionType.doesQualify).toBeDefined();
    });

    describe('ON execute', function () {
      it('should return tenantGroupUser', function () {
        var userGroupBulkAction = new UserGroupBulkAction();
        userGroupBulkAction.selectedGroup = mockGroups[1];

        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users');

        var tenantGroupUser = userGroupBulkActionType.execute(mockUsers[0], userGroupBulkAction);

        $httpBackend.flush();

        expect(tenantGroupUser).toBeDefined();
        expect(tenantGroupUser.id).toEqual(mockUserGroups[1].id);
      });
    });
  });

  describe('userGroupBulkActionType "remove"', function () {
    beforeEach(function () {
      userGroupBulkActionType = userGroupBulkActionTypes[1];
    });

    it('should return something on exe', function () {
      expect(userGroupBulkActionType.execute).toBeDefined();
      expect(userGroupBulkActionType.canExecute).toBeDefined();
      expect(userGroupBulkActionType.doesQualify).toBeDefined();
    });

    describe('ON execute', function () {
      it('should return tenantGroupUser', function () {
        var userGroupBulkAction = new UserGroupBulkAction();
        userGroupBulkAction.selectedGroup = mockGroups[0];

        $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId1');

        userGroupBulkActionType.execute(mockUsers[0], userGroupBulkAction);

        $httpBackend.flush();
      });
    });
  });
});
