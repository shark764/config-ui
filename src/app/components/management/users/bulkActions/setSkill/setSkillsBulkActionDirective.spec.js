'use strict';

describe('userSkillsBulkAction directive', function() {
  var $scope,
    $compile,
    $httpBackend,
    element,
    isolateScope,
    BulkAction,
    mockSkills,
    mockUsers,
    mockUserSkills,
    UserSkillsBulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'BulkAction', 'mockSkills', 'mockUsers', 'mockUserSkills', 'UserSkillsBulkAction',
    function(_$compile_, _$rootScope_, _$httpBackend, _BulkAction, _mockSkills, _mockUsers, _mockUserSkills, _UserSkillsBulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $httpBackend = _$httpBackend;
      BulkAction = _BulkAction;
      mockSkills = _mockSkills;
      mockUsers = _mockUsers;
      mockUserSkills = _mockUserSkills;
      UserSkillsBulkAction = _UserSkillsBulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();
    $scope.users = [mockUsers[0], mockUsers[1]];

    element = $compile('<ba-user-skills users="users" bulk-action="bulkAction"></ba-user-skills>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    $httpBackend.flush();
  });

  describe('ON bulkAction.execute', function() {
    it('should override bulkAction.execute', function() {
      expect(isolateScope.bulkAction.execute).toBeDefined();
    });

    it('should should call userkillBulkAction.selectedType.execute when user doesQualify', inject([function() {
      spyOn(isolateScope.userSkillsBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.userSkillsBulkActions[0].selectedType, 'doesQualify').and.returnValue(true);

      isolateScope.bulkAction.execute([mockUsers[0]]);

      expect(isolateScope.userSkillsBulkActions[0].selectedType.execute).toHaveBeenCalled();
    }]));

    it('should not call userSkillsBulkAction.selectedType.execute if user !doesQualify', inject([function() {
      spyOn(isolateScope.userSkillsBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.userSkillsBulkActions[0].selectedType, 'doesQualify').and.returnValue(false);

      isolateScope.bulkAction.execute([mockUsers[1]]);

      expect(isolateScope.userSkillsBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));

    it('should call fetchUserSkills on all userSkillsBulkAction.selectedType.executes success', inject([function() {
      spyOn(isolateScope, 'fetchSkillUsers');
      spyOn(isolateScope.userSkillsBulkActions[0].selectedType, 'doesQualify').and.returnValue(true);
      isolateScope.bulkAction.execute([mockUsers[0]]);

      $httpBackend.flush();

      expect(isolateScope.fetchSkillUsers).toHaveBeenCalled();
    }]));
  });

  describe('ON bulkAction.canExecute', function() {
    it('should override bulkAction.canExecute', function() {
      expect(isolateScope.bulkAction.canExecute).toBeDefined();
    });

    it('should return false when no userSkillsBulkActions exist', function() {
      isolateScope.userSkillsBulkActions = [];

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return false when a userSkillsBulkAction\'s canExecute fails', function() {
      var userSkillsBulkAction = new UserSkillsBulkAction();
      isolateScope.userSkillsBulkActions.push(userSkillsBulkAction);

      isolateScope.userSkillsBulkActions[1].selectedType.canExecute =
        jasmine.createSpy().and.callFake(function(action) {
          return action === userSkillsBulkAction;
        });

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return true when a userSkillsBulkAction\'s canExecute succeeds', function() {
      var userSkillsBulkAction = new UserSkillsBulkAction();
      isolateScope.userSkillsBulkActions.push(userSkillsBulkAction);

      isolateScope.userSkillsBulkActions[0].selectedType.canExecute =
        jasmine.createSpy().and.returnValue(true);

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeTruthy();
    });
  });

  describe('ON removeBulkSkill', function() {
    it('should be defined', function() {
      expect(isolateScope.removeBulkSkill).toBeDefined();
    });

    it('should remove item from userSkillsBulkActions on call', function() {
      expect(isolateScope.userSkillsBulkActions.length).toEqual(1);

      isolateScope.removeBulkSkill(isolateScope.userSkillsBulkActions[0]);

      expect(isolateScope.userSkillsBulkActions.length).toEqual(0);
    });
  });

  describe('ON addBulkSkill', function() {
    it('should be defined', function() {
      expect(isolateScope.addBulkSkill).toBeDefined();
    });

    it('should add item to userSkillsBulkActions on call', function() {
      expect(isolateScope.userSkillsBulkActions.length).toEqual(1);

      isolateScope.addBulkSkill();

      expect(isolateScope.userSkillsBulkActions.length).toEqual(2);
    });
  });

  describe('ON onSelectSkill', function() {
    it('should be defined', function() {
      expect(isolateScope.onSelectSkill).toBeDefined();
    });

    it('should add item to userSkillsBulkActions on call', function() {
      spyOn(isolateScope, 'refreshAffectedUsers');

      isolateScope.userSkillsBulkActions[0].selectedSkill = isolateScope.skills[0];

      isolateScope.onSelectSkill(isolateScope.userSkillsBulkActions[0]);

      expect(isolateScope.userSkillsBulkActions[0].params.skillId).toEqual(
        isolateScope.skills[0].id);
      expect(isolateScope.refreshAffectedUsers).toHaveBeenCalledWith(
        isolateScope.userSkillsBulkActions[0]);
    });
  });

  describe('ON refreshAffectedUsers', function() {
    it('should be defined', function() {
      expect(isolateScope.refreshAffectedUsers).toBeDefined();
    });

    it('should have 2 usersAffected when they both qualify and both are checked', function() {
      var theFuture = {
        userId1: true,
        userId2: true
      };

      spyOn(isolateScope.userSkillsBulkActions[0].selectedType,
          'canExecute')
        .and.returnValue(true);

      spyOn(isolateScope.userSkillsBulkActions[0].selectedType,
          'doesQualify')
        .and.callFake(function(user) {
          return theFuture[user.id];
        });
      isolateScope.users[0].checked = true;
      isolateScope.users[1].checked = true;

      isolateScope.refreshAllAffectedUsers();

      expect(isolateScope.userSkillsBulkActions[0].usersAffected).toBeDefined();
      expect(isolateScope.userSkillsBulkActions[0].usersAffected.length).toEqual(2);
    });

    it('should have 1 usersAffected when one qualifies and both are checked', function() {
      var theFuture = {
        userId1: true,
        userId2: false
      };

      spyOn(isolateScope.userSkillsBulkActions[0].selectedType,
          'canExecute')
        .and.returnValue(true);

      spyOn(isolateScope.userSkillsBulkActions[0].selectedType,
          'doesQualify')
        .and.callFake(function(user) {
          return theFuture[user.id];
        });
      isolateScope.users[0].checked = true;
      isolateScope.users[1].checked = true;

      isolateScope.refreshAllAffectedUsers();

      expect(isolateScope.userSkillsBulkActions[0].usersAffected).toBeDefined();
      expect(isolateScope.userSkillsBulkActions[0].usersAffected.length).toEqual(1);
    });

    it('should have 1 usersAffected when they both qualify but one is checked', function() {
      var theFuture = {
        userId1: true,
        userId2: true
      };

      spyOn(isolateScope.userSkillsBulkActions[0].selectedType,
          'canExecute')
        .and.returnValue(true);

      spyOn(isolateScope.userSkillsBulkActions[0].selectedType,
          'doesQualify')
        .and.callFake(function(user) {
          return theFuture[user.id];
        });
      isolateScope.users[0].checked = true;
      isolateScope.users[1].checked = false;

      isolateScope.refreshAllAffectedUsers();

      expect(isolateScope.userSkillsBulkActions[0].usersAffected).toBeDefined();
      expect(isolateScope.userSkillsBulkActions[0].usersAffected.length).toEqual(1);
    });
  });
});
