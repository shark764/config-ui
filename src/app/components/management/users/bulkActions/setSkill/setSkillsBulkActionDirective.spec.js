'use strict';

describe('setSkillsBulkAction directive', function() {
  var $scope,
    element,
    isolateScope,
    mockSkills,
    mockTenantUsers,
    mockUserSkills,
    UserSkillsBulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.skill.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'mockSkills', 'mockTenantUsers', 'mockUserSkills', 'UserSkillsBulkAction', '$httpBackend',
    function($compile, $rootScope, _mockSkills, _mockTenantUsers, _mockUserSkills, _UserSkillsBulkAction, $httpBackend) {
      $scope = $rootScope.$new();
      mockSkills = _mockSkills;
      mockTenantUsers = _mockTenantUsers;
      mockUserSkills = _mockUserSkills;
      UserSkillsBulkAction = _UserSkillsBulkAction;

      $scope.users = [mockTenantUsers[0], mockTenantUsers[1]];

      element = $compile('<ba-user-skills users="users"></ba-user-skills>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      $httpBackend.flush();
    }
  ]));

  describe('ON bulkAction.execute', function() {
    it('should override bulkAction.execute', function() {
      expect(isolateScope.bulkAction.execute).toBeDefined();
    });

    it('should should call userkillBulkAction.selectedType.execute when user doesQualify', inject([function() {
      isolateScope.bulkAction.userSkillsBulkActions[0].selectedSkill = mockSkills[0];
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'doesQualify').and.returnValue(true);


      isolateScope.bulkAction.execute([mockTenantUsers[0]]);

      expect(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType.execute).toHaveBeenCalled();
    }]));

    it('should not call userSkillsBulkAction.selectedType.execute if user !doesQualify', inject([function() {
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'doesQualify').and.returnValue(false);

      isolateScope.bulkAction.execute([mockTenantUsers[1]]);

      expect(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));
  });

  describe('ON bulkAction.canExecute', function() {
    it('should override bulkAction.canExecute', function() {
      expect(isolateScope.bulkAction.canExecute).toBeDefined();
    });

    it('should return false when no userSkillsBulkActions exist', function() {
      isolateScope.bulkAction.userSkillsBulkActions = [];

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return false when a userSkillsBulkAction\'s canExecute fails', function() {
      var userSkillsBulkAction = new UserSkillsBulkAction();
      isolateScope.bulkAction.userSkillsBulkActions.push(userSkillsBulkAction);

      isolateScope.bulkAction.userSkillsBulkActions[1].selectedType.canExecute =
        jasmine.createSpy().and.callFake(function(action) {
          return action === userSkillsBulkAction;
        });

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return true when a userSkillsBulkAction\'s canExecute succeeds', function() {
      var userSkillsBulkAction = new UserSkillsBulkAction();
      isolateScope.bulkAction.userSkillsBulkActions.push(userSkillsBulkAction);

      isolateScope.bulkAction.userSkillsBulkActions[0].selectedType.canExecute =
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
      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(1);

      isolateScope.removeBulkSkill(isolateScope.bulkAction.userSkillsBulkActions[0]);

      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(0);
    });
  });

  describe('ON addBulkSkill', function() {
    it('should be defined', function() {
      expect(isolateScope.addBulkSkill).toBeDefined();
    });

    it('should add item to userSkillsBulkActions on call', function() {
      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(1);

      isolateScope.addBulkSkill();

      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(2);
    });
  });

  describe('ON onChange', function() {
    it('should be defined', function() {
      expect(isolateScope.onChangeSkill).toBeDefined();
      expect(isolateScope.onChangeType).toBeDefined();
    });

    it('should set action.params.skillId', function() {
      isolateScope.bulkAction.userSkillsBulkActions[0].selectedSkill = isolateScope.availableSkills[0];

      isolateScope.onChangeSkill(isolateScope.bulkAction.userSkillsBulkActions[0]);

      expect(isolateScope.bulkAction.userSkillsBulkActions[0].params.skillId).toEqual(
        isolateScope.availableSkills[0].id);
    });
  });

  describe('fetchSkills function', function() {
    it('should include only skills with proficiency belong to at least one selected user on update', inject(function($httpBackend, queryCache) {
      isolateScope.currSelectedType = 'update';
      mockSkills[0].hasProficiency = true;
      mockSkills[1].hasProficiency = false;
      mockTenantUsers[0].$skills = [mockSkills[0]];
      mockTenantUsers[1].$skills = [mockSkills[1]];
      mockTenantUsers[0].checked = true;
      mockTenantUsers[1].checked = true;

      queryCache.remove('Skill');
      isolateScope.users = [mockTenantUsers[0], mockTenantUsers[1]];
      isolateScope.fetchSkills();
      $httpBackend.flush();
      isolateScope.$digest();
      expect(isolateScope.availableSkills.length).toBe(1);
      expect(isolateScope.availableSkills[0].id).toBe(mockSkills[0].id);
    }));
  });
});
