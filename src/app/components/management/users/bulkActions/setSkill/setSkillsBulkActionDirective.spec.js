'use strict';

describe('userSkillsBulkAction directive', function () {
  var $scope,
    $compile,
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

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction', 'mockSkills', 'mockUsers', 'mockUserSkills', 'UserSkillsBulkAction',
    function (_$compile_, _$rootScope_, _BulkAction, _mockSkills, _mockUsers, _mockUserSkills, _UserSkillsBulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
      mockSkills = _mockSkills;
      mockUsers = _mockUsers;
      mockUserSkills = _mockUserSkills;
      UserSkillsBulkAction = _UserSkillsBulkAction;
    }
  ]));

  beforeEach(inject(['$httpBackend', function ($httpBackend) {
    $scope.bulkAction = new BulkAction();
    $scope.users = [mockUsers[0], mockUsers[1]];

    element = $compile('<ba-user-skills users="users" bulk-action="bulkAction"></ba-user-skills>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    $httpBackend.flush();
  }]));

  describe('ON bulkAction.execute', function () {
    it('should override bulkAction.execute', function () {
      expect(isolateScope.bulkAction.execute).toBeDefined();
    });

    it('should should call userkillBulkAction.selectedType.execute when user doesQualify', inject([function () {
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'doesQualify').and.returnValue(true);

      isolateScope.bulkAction.execute([mockUsers[0]]);

      expect(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType.execute).toHaveBeenCalled();
    }]));

    it('should not call userSkillsBulkAction.selectedType.execute if user !doesQualify', inject([function () {
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'execute');
      spyOn(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType, 'doesQualify').and.returnValue(false);

      isolateScope.bulkAction.execute([mockUsers[1]]);

      expect(isolateScope.bulkAction.userSkillsBulkActions[0].selectedType.execute).not.toHaveBeenCalled();
    }]));
  });

  describe('ON bulkAction.canExecute', function () {
    it('should override bulkAction.canExecute', function () {
      expect(isolateScope.bulkAction.canExecute).toBeDefined();
    });

    it('should return false when no userSkillsBulkActions exist', function () {
      isolateScope.bulkAction.userSkillsBulkActions = [];

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return false when a userSkillsBulkAction\'s canExecute fails', function () {
      var userSkillsBulkAction = new UserSkillsBulkAction();
      isolateScope.bulkAction.userSkillsBulkActions.push(userSkillsBulkAction);

      isolateScope.bulkAction.userSkillsBulkActions[1].selectedType.canExecute =
        jasmine.createSpy().and.callFake(function (action) {
          return action === userSkillsBulkAction;
        });

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeFalsy();
    });

    it('should return true when a userSkillsBulkAction\'s canExecute succeeds', function () {
      var userSkillsBulkAction = new UserSkillsBulkAction();
      isolateScope.bulkAction.userSkillsBulkActions.push(userSkillsBulkAction);

      isolateScope.bulkAction.userSkillsBulkActions[0].selectedType.canExecute =
        jasmine.createSpy().and.returnValue(true);

      var canExecute = isolateScope.bulkAction.canExecute();

      expect(canExecute).toBeTruthy();
    });
  });

  describe('ON removeBulkSkill', function () {
    it('should be defined', function () {
      expect(isolateScope.removeBulkSkill).toBeDefined();
    });

    it('should remove item from userSkillsBulkActions on call', function () {
      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(1);

      isolateScope.removeBulkSkill(isolateScope.bulkAction.userSkillsBulkActions[0]);

      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(0);
    });
  });

  describe('ON addBulkSkill', function () {
    it('should be defined', function () {
      expect(isolateScope.addBulkSkill).toBeDefined();
    });

    it('should add item to userSkillsBulkActions on call', function () {
      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(1);

      isolateScope.addBulkSkill();

      expect(isolateScope.bulkAction.userSkillsBulkActions.length).toEqual(2);
    });
  });

  describe('ON onChange', function () {
    it('should be defined', function () {
      expect(isolateScope.onChange).toBeDefined();
    });

    it('should fetch userSkills', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      isolateScope.bulkAction.userSkillsBulkActions[0].selectedSkill = isolateScope.fetchSkills()[0];

      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/skills/skillId1/users');

      isolateScope.onChange(isolateScope.bulkAction.userSkillsBulkActions[0]);

      $httpBackend.flush();
    }]));

    it('should set action.params.skillId', inject(['$httpBackend', function ($httpBackend) {
      isolateScope.bulkAction.userSkillsBulkActions[0].selectedSkill = isolateScope.fetchSkills()[0];

      isolateScope.onChange(isolateScope.bulkAction.userSkillsBulkActions[0]);

      $httpBackend.flush();

      expect(isolateScope.bulkAction.userSkillsBulkActions[0].params.skillId).toEqual(
        isolateScope.fetchSkills()[0].id);
    }]));
  });
});