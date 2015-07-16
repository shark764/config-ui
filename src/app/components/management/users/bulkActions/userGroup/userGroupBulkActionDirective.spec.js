'use strict';

describe('userGroupBulkAction directive', function() {
  var $scope,
    $compile,
    $httpBackend,
    element,
    isolateScope,
    BulkAction,
    mockGroups,
    mockUsers,
    UserGroupBulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users.groups'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'BulkAction', 'mockGroups', 'mockUsers', 'UserGroupBulkAction',
    function(_$compile_, _$rootScope_, _$httpBackend, _BulkAction, _mockGroups, _mockUsers, _UserGroupBulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $httpBackend = _$httpBackend;
      BulkAction = _BulkAction;
      mockGroups = _mockGroups;
      mockUsers = _mockUsers;
      UserGroupBulkAction = _UserGroupBulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();
    $scope.users = [mockUsers[0], mockUsers[1]];

    element = $compile('<ba-user-groups users="users" bulk-action="bulkAction"></ba-user-groups>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    $httpBackend.flush();
  });

  describe('ON bulkAction.execute', function() {
    it('should override bulkAction.execute', function() {
      expect(isolateScope.bulkAction.execute).toBeDefined();
    });

    it('should should call userkillBulkAction.selectedType.execute when user doesQualify', inject([function() {
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'doesQualify').and.returnValue(true);

      isolateScope.bulkAction.execute([mockUsers[0]]);

      expect(isolateScope.bulkAction.userGroupBulkActions[0].selectedType.execute).toHaveBeenCalled();
    }]));

    it('should not call userGroupBulkAction.selectedType.execute if user !doesQualify', inject([function() {
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userGroupBulkActions[0].selectedType, 'doesQualify').and.returnValue(false);

      isolateScope.bulkAction.execute([mockUsers[1]]);

      expect(isolateScope.bulkAction.userGroupBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));
  });

  describe('ON bulkAction.canExecute', function() {
    it('should override bulkAction.canExecute', function() {
      expect(isolateScope.bulkAction.canExecute).toBeDefined();
    });

    it('should return false when no userGroupBulkActions exist', function() {
      isolateScope.bulkAction.userGroupBulkActions = [];

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return false when a userGroupBulkAction\'s canExecute fails', function() {
      var userGroupBulkAction = new UserGroupBulkAction();
      isolateScope.bulkAction.userGroupBulkActions.push(userGroupBulkAction);

      isolateScope.bulkAction.userGroupBulkActions[1].selectedType.canExecute =
        jasmine.createSpy().and.callFake(function(action) {
          return action === userGroupBulkAction;
        });

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return true when a userGroupBulkAction\'s canExecute succeeds', function() {
      var userGroupBulkAction = new UserGroupBulkAction();
      isolateScope.bulkAction.userGroupBulkActions.push(userGroupBulkAction);

      isolateScope.bulkAction.userGroupBulkActions[0].selectedType.canExecute =
        jasmine.createSpy().and.returnValue(true);

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeTruthy();
    });
  });

  describe('ON removeUserGroupBulkAction', function() {
    it('should be defined', function() {
      expect(isolateScope.removeUserGroupBulkAction).toBeDefined();
    });

    it('should remove item from userGroupBulkActions on call', function() {
      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(1);

      isolateScope.removeUserGroupBulkAction(isolateScope.bulkAction.userGroupBulkActions[0]);

      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(0);
    });
  });

  describe('ON addUserGroupBulkAction', function() {
    it('should be defined', function() {
      expect(isolateScope.addUserGroupBulkAction).toBeDefined();
    });

    it('should add item to userGroupBulkActions on call', function() {
      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(1);

      isolateScope.addUserGroupBulkAction();

      expect(isolateScope.bulkAction.userGroupBulkActions.length).toEqual(2);
    });
  });

  describe('ON refreshAffectedUsers', function() {
    it('should be defined', function() {
      expect(isolateScope.refreshAffectedUsers).toBeDefined();
    });

    it('should have 2 usersAffected when they both qualify and both are checked', function () {
      var theFuture = {
        userId1: true,
        userId2: true
      };

      var userGroupBulkAction = isolateScope.bulkAction.userGroupBulkActions[0];

      spyOn(userGroupBulkAction.selectedType, 'canExecute')
        .and.returnValue(true);

      spyOn(userGroupBulkAction.selectedType, 'doesQualify')
        .and.callFake(function (user) {
          return theFuture[user.id];
        });

      isolateScope.users[0].checked = true;
      isolateScope.users[1].checked = true;

      var usersAffected = isolateScope.refreshAffectedUsers(userGroupBulkAction);
      expect(usersAffected.length).toEqual(2);
    });

    it('should have 1 usersAffected when one qualifies and both are checked', function () {
      var theFuture = {
        userId1: true,
        userId2: false
      };

      var userGroupBulkAction = isolateScope.bulkAction.userGroupBulkActions[0];

      spyOn(userGroupBulkAction.selectedType, 'canExecute')
        .and.returnValue(true);

      spyOn(userGroupBulkAction.selectedType, 'doesQualify')
        .and.callFake(function (user) {
          return theFuture[user.id];
        });

      isolateScope.users[0].checked = true;
      isolateScope.users[1].checked = true;

      var usersAffected = isolateScope.refreshAffectedUsers(userGroupBulkAction);
      expect(usersAffected.length).toEqual(1);
    });

    it('should have 1 usersAffected when they both qualify but one is checked', function () {
      var theFuture = {
        userId1: true,
        userId2: true
      };

      var userGroupBulkAction = isolateScope.bulkAction.userGroupBulkActions[0];

      spyOn(userGroupBulkAction.selectedType, 'canExecute')
        .and.returnValue(true);

      spyOn(userGroupBulkAction.selectedType, 'doesQualify')
        .and.callFake(function (user) {
          return theFuture[user.id];
        });

      isolateScope.users[0].checked = true;
      isolateScope.users[1].checked = false;

      var usersAffected = isolateScope.refreshAffectedUsers(userGroupBulkAction);
      expect(usersAffected.length).toEqual(1);
    });
  });
});
