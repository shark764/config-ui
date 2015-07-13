'use strict';

describe('setSkillsBulkAction', function() {
  var $httpBackend,
    apiHostname,
    UserSkillsBulkAction,
    userSkillsBulkActionTypes,
    mockUsers,
    mockSkills,
    mockUserSkills;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));

  beforeEach(inject(['$httpBackend', 'apiHostname', 'UserSkillsBulkAction', 'userSkillsBulkActionTypes', 'mockUsers', 'mockSkills', 'mockUserSkills',
    function(_$httpBackend, _apiHostname, _UserSkillsBulkAction, _userSkillsBulkActionTypes, _mockUsers, _mockSkills, _mockUserSkills) {
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      UserSkillsBulkAction = _UserSkillsBulkAction;
      userSkillsBulkActionTypes = _userSkillsBulkActionTypes;
      mockUsers = _mockUsers;
      mockSkills = _mockSkills;
      mockUserSkills = _mockUserSkills;
    }
  ]));

  describe('canExecute', function() {
    it('should return false when no skill is selected', function() {
      var userSkillBulkAction = new UserSkillsBulkAction();
      var canExecute = userSkillBulkAction.canExecute();
      expect(canExecute).toBeFalsy();
    });
  });

  describe('execute', function() {
    it('should call POST end-point', function() {
      var userSkillBulkAction = new UserSkillsBulkAction();
      userSkillBulkAction.selectedSkill = mockSkills[1];

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills');

      userSkillBulkAction.execute(mockUsers[0]);

      $httpBackend.flush();
    });
  });

  describe('userSkillsBulkActionType "add"', function() {
    var userSkillBulkAction;

    beforeEach(function() {
      userSkillBulkAction = new UserSkillsBulkAction();
      userSkillBulkAction.selectedType = userSkillsBulkActionTypes[0];
    });

    it('should have functions defined', function() {
      expect(userSkillBulkAction.selectedType.execute).toBeDefined();
      expect(userSkillBulkAction.selectedType.canExecute).toBeDefined();
      expect(userSkillBulkAction.selectedType.doesQualify).toBeDefined();
    });

    describe('ON execute', function() {
      it('should call POST end-point', function() {
        userSkillBulkAction.selectedSkill = mockSkills[1];

        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills');

        var tenantSkillUser = userSkillBulkAction.selectedType.execute(mockUsers[0], userSkillBulkAction);

        $httpBackend.flush();

        expect(tenantSkillUser).toBeDefined();
        expect(tenantSkillUser.id).toEqual(mockUserSkills[1].id);
      });
    });

    describe('ON canExecute', function() {
      it('should return true when skill and type is selected', function() {
        userSkillBulkAction.selectedSkill = mockSkills[0];

        var canExecute = userSkillBulkAction.selectedType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeTruthy();
      });

      it('should return false when skill is not selected', function() {
        var canExecute = userSkillBulkAction.selectedType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
    });

    describe('ON doesQualify', function() {
      it('should return true if user does not have the skill', function() {
        mockSkills[2].users = [mockUsers[1]];
        userSkillBulkAction.selectedSkill = mockSkills[2];
        userSkillBulkAction.params.proficiency = 0;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeTruthy();
      });

      it('should return true if user has the skill but different proficiency', function() {
        mockSkills[0].users = [mockUserSkills[0]];
        userSkillBulkAction.selectedSkill = mockSkills[0];
        userSkillBulkAction.params.proficiency = mockUserSkills[0].proficiency + 1;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeTruthy();
      });

      it('should return false if user has the skill and same proficiency', function() {
        mockSkills[0].users = [mockUserSkills[0]];
        userSkillBulkAction.selectedSkill = mockSkills[0];
        userSkillBulkAction.params.proficiency = mockUserSkills[0].proficiency;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeFalsy();
      });
    });
  });

  describe('userSkillsBulkActionType "update"', function() {
    var userSkillBulkAction;

    beforeEach(function() {
      userSkillBulkAction = new UserSkillsBulkAction();
      userSkillBulkAction.selectedType = userSkillsBulkActionTypes[1];
    });

    it('should have functions defined', function() {
      expect(userSkillBulkAction.selectedType.execute).toBeDefined();
      expect(userSkillBulkAction.selectedType.canExecute).toBeDefined();
      expect(userSkillBulkAction.selectedType.doesQualify).toBeDefined();
    });

    describe('ON execute', function() {
      it('should call PUT end-point', function() {
        userSkillBulkAction.params.skillId = mockSkills[0].id;

        $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1');

        var tenantSkillUser = userSkillBulkAction.selectedType.execute(mockUsers[0], userSkillBulkAction);

        $httpBackend.flush();

        expect(tenantSkillUser).toBeDefined();
        expect(tenantSkillUser.id).toEqual(mockUserSkills[0].id);
      });
    });

    describe('ON canExecute', function() {
      it('should return true when skill and type is selected and proficiency is defined', function() {
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.params.proficiency = 5;

        var canExecute = userSkillBulkAction.selectedType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeTruthy();
      });

      it('should return false when skill is not selected', function() {
        var canExecute = userSkillBulkAction.selectedType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });

      it('should return false when proficiency is not selected', function() {
        userSkillBulkAction.params.skillId = mockSkills[0].id;

        var canExecute = userSkillBulkAction.selectedType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
    });

    describe('ON doesQualify', function() {
      it('should return false if user does not have the skill', function() {
        mockSkills[2].users = [mockUsers[1]];
        userSkillBulkAction.selectedSkill = mockSkills[2];
        userSkillBulkAction.params.proficiency = 0;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeFalsy();
      });

      it('should return true if user has the skill but different proficiency', function() {
        mockSkills[0].users = [mockUserSkills[0]];
        userSkillBulkAction.selectedSkill = mockSkills[0];
        userSkillBulkAction.params.proficiency = mockUserSkills[0].proficiency + 1;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeTruthy();
      });

      it('should return false if user has the skill and same proficiency', function() {
        mockSkills[0].users = [mockUserSkills[0]];
        userSkillBulkAction.selectedSkill = mockSkills[0];
        userSkillBulkAction.params.proficiency = mockUserSkills[0].proficiency;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeFalsy();
      });
    });
  });

  describe('userSkillsBulkActionType "remove"', function() {
    var userSkillBulkAction;

    beforeEach(function() {
      userSkillBulkAction = new UserSkillsBulkAction();
      userSkillBulkAction.selectedType = userSkillsBulkActionTypes[2];
    });

    it('should return something on exe', function() {
      expect(userSkillBulkAction.selectedType.execute).toBeDefined();
      expect(userSkillBulkAction.selectedType.canExecute).toBeDefined();
      expect(userSkillBulkAction.selectedType.doesQualify).toBeDefined();
    });

    describe('ON execute', function() {
      it('should call DELETE end-point', function() {
        userSkillBulkAction.params.skillId = mockSkills[0].id;

        $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1');

        userSkillBulkAction.selectedType.execute(mockUsers[0], userSkillBulkAction);

        $httpBackend.flush();
      });
    });

    describe('ON canExecute', function() {
      it('should return true when skill and type is selected', function() {
        userSkillBulkAction.params.skillId = mockSkills[0].id;

        var canExecute = userSkillBulkAction.selectedType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeTruthy();
      });

      it('should return false when skill is not selected', function() {
        var canExecute = userSkillBulkAction.selectedType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
    });

    describe('ON doesQualify', function() {
      it('should return false if user does not have the skill', function() {
        mockSkills[2].users = [mockUsers[1]];
        userSkillBulkAction.selectedSkill = mockSkills[2];

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeFalsy();
      });

      it('should return true if user has the skill', function() {
        mockSkills[0].users = [mockUserSkills[0]];
        userSkillBulkAction.selectedSkill = mockSkills[0];

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeTruthy();
      });
    });
  });

  describe('hasSkill', function() {
    var hasSkill;

    beforeEach(inject(['hasSkill', function(_hasSkill) {
      hasSkill = _hasSkill;
    }]));

    it('should return userSkill userId1 skillId1', function() {
      var userSkill = hasSkill(mockUsers[0], [mockUserSkills[0], mockUserSkills[1]]);
      expect(userSkill.id).toEqual(mockUserSkills[0].id);
    });

    it('should return undefined since userId3 does not have skillId1', function() {
      var userSkills = hasSkill(mockUsers[2], [mockUserSkills[0], mockUserSkills[1]]);
      expect(userSkills).not.toBeDefined();
    });
  });

});
