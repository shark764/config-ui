'use strict';

describe('userGroupBulkAction', function() {
  var $httpBackend,
    apiHostname,
    UserGroupBulkAction,
    userGroupBulkActionTypes,
    userGroupBulkActionType,
    mockTenantUsers,
    mockGroups,
    mockUserGroups;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.group.mock'));

  beforeEach(inject(['$httpBackend', 'apiHostname', 'UserGroupBulkAction', 'userGroupBulkActionTypes', 'mockTenantUsers', 'mockGroups', 'mockUserGroups',
    function(_$httpBackend, _apiHostname, _UserGroupBulkAction, _userGroupBulkActionTypes, _mockTenantUsers, _mockGroups, _mockUserGroups) {
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      UserGroupBulkAction = _UserGroupBulkAction;
      userGroupBulkActionTypes = _userGroupBulkActionTypes;
      mockTenantUsers = _mockTenantUsers;
      mockGroups = _mockGroups;
      mockUserGroups = _mockUserGroups;
    }
  ]));

  beforeEach(inject(['tenantUserTransformer', function(tenantUserTransformer) {
    tenantUserTransformer.transform(mockTenantUsers[0]);
  }]));

  describe('canExecute', function() {
    it('should return false when no group is selected', function() {
      var userGroupBulkAction = new UserGroupBulkAction();
      var canExecute = userGroupBulkAction.canExecute();
      expect(canExecute).toBeFalsy();
    });
  });

  describe('execute', function() {
    it('should call POST end-point', function() {
      var userGroupBulkAction = new UserGroupBulkAction();
      userGroupBulkAction.selectedGroup = mockGroups[1];

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users');

      userGroupBulkAction.execute(mockTenantUsers[0]);

      $httpBackend.flush();
    });
  });

  describe('userGroupBulkActionType "add"', function() {
    beforeEach(function() {
      userGroupBulkActionType = userGroupBulkActionTypes[0];
    });

    it('should have functions defined', function() {
      expect(userGroupBulkActionType.execute).toBeDefined();
      expect(userGroupBulkActionType.canExecute).toBeDefined();
      expect(userGroupBulkActionType.doesQualify).toBeDefined();
    });

    describe('ON doesQualify', function() {
      it('should return false if the given user has the action\'s group', inject(function(User) {
        var user = new User({
          $groups: [{id: 'group1'}, {id: 'group2'}, {id: 'group3'}]
        });
        
        var action = {
          selectedGroup: {id: 'group2'}
        };

        var result = userGroupBulkActionType.doesQualify(user, action);
        expect(result).toBeFalsy();
      }));

      it('should return true if the given user does not have the action\'s group', inject(function(User) {
        var user = new User({
          $groups: [{id: 'group1'}, {id: 'group2'}, {id: 'group3'}]
        });
        
        var action = {
          selectedGroup: {id: 'group4'}
        };

        var result = userGroupBulkActionType.doesQualify(user, action);
        expect(result).toBeTruthy();
      }));
    });
    
    describe('ON canExecute', function() {
      it('should return true if the action\'s selected group exists', function() {
        var action = {
          selectedGroup: {id: 'group2'}
        };

        var result = userGroupBulkActionType.canExecute(action);
        expect(result).toBeTruthy();
      });

      it('should return false if the action\'s selected group does not exist', function() {
        var action = {};

        var result = userGroupBulkActionType.canExecute(action);
        expect(result).toBeFalsy();
      });
    });

    describe('ON execute', function() {
      it('should return tenantGroupUser', function() {
        var userGroupBulkAction = new UserGroupBulkAction();
        userGroupBulkAction.selectedGroup = mockGroups[1];

        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users');

        var tenantGroupUser = userGroupBulkActionType.execute(mockTenantUsers[0], userGroupBulkAction);

        $httpBackend.flush();

        expect(tenantGroupUser).toBeDefined();
        expect(tenantGroupUser.id).toEqual(mockUserGroups[1].id);
      });

      it('should add the new group to the given user\'s $groups', function() {
        var userGroupBulkAction = new UserGroupBulkAction();
        userGroupBulkAction.selectedGroup = mockGroups[1];
        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups/groupId2/users');

        var user = angular.copy(mockTenantUsers[0]);
        user.$groups = [];

        userGroupBulkActionType.execute(user, userGroupBulkAction);
        $httpBackend.flush();

        expect(user.$groups.length).toBe(1);
        expect(user.$groups[0].id).toEqual(mockGroups[1].id);
      });
    });
  });

  describe('userGroupBulkActionType "remove"', function() {
    beforeEach(function() {
      userGroupBulkActionType = userGroupBulkActionTypes[1];
    });

    describe('ON doesQualify', function() {
      it('should return true if the given user has the action\'s group', inject(function(User) {
        var user = new User({
          $groups: [{id: 'group1'}, {id: 'group2'}, {id: 'group3'}]
        });
        
        var action = {
          selectedGroup: {id: 'group2'}
        };

        var result = userGroupBulkActionType.doesQualify(user, action);
        expect(result).toBeTruthy();
      }));

      it('should return false if the given user does not have the action\'s group', inject(function(User) {
        var user = new User({
          $groups: [{id: 'group1'}, {id: 'group2'}, {id: 'group3'}]
        });
        
        var action = {
          selectedGroup: {id: 'group4'}
        };

        var result = userGroupBulkActionType.doesQualify(user, action);
        expect(result).toBeFalsy();
      }));
    });
    
    describe('ON canExecute', function() {
      it('should return true if the action\'s selected group exists', function() {
        var action = {
          selectedGroup: {id: 'group2'}
        };

        var result = userGroupBulkActionType.canExecute(action);
        expect(result).toBeTruthy();
      });

      it('should return false if the action\'s selected group does not exist', function() {
        var action = {};

        var result = userGroupBulkActionType.canExecute(action);
        expect(result).toBeFalsy();
      });
    });
    
    it('should return something on exe', function() {
      expect(userGroupBulkActionType.execute).toBeDefined();
      expect(userGroupBulkActionType.canExecute).toBeDefined();
      expect(userGroupBulkActionType.doesQualify).toBeDefined();
    });

    describe('ON execute', function() {
      it('should return tenantGroupUser', function() {
        var userGroupBulkAction = new UserGroupBulkAction();
        userGroupBulkAction.selectedGroup = mockGroups[0];

        $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId1');

        userGroupBulkActionType.execute(mockTenantUsers[0], userGroupBulkAction);

        $httpBackend.flush();
      });
      
      it('should remove the new group to the given user\'s $groups', function() {
        var userGroupBulkAction = new UserGroupBulkAction();
        userGroupBulkAction.selectedGroup = mockGroups[0];
        $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/groups/groupId1/users/userId1').respond(200, {
          result: {
            groupId: mockGroups[0].id
          }
        });

        var user = angular.copy(mockTenantUsers[0]);
        user.$groups = [mockGroups[1], mockGroups[0]];

        userGroupBulkActionType.execute(user, userGroupBulkAction);
        $httpBackend.flush();

        expect(user.$groups.length).toBe(1);
      });
    });
  });
});