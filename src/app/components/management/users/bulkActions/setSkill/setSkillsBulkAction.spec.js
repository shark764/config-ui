'use strict';

describe('setSkillsBulkAction', function() {
  var $httpBackend,
    apiHostname,
    UserSkillsBulkAction,
    userSkillsBulkActionTypes,
    mockTenantUsers,
    mockSkills,
    mockUserSkills;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.skill.mock'));

  beforeEach(inject(['$httpBackend', 'apiHostname', 'UserSkillsBulkAction', 'userSkillsBulkActionTypes', 'mockTenantUsers', 'mockSkills', 'mockUserSkills',
    function(_$httpBackend, _apiHostname, _UserSkillsBulkAction, _userSkillsBulkActionTypes, _mockTenantUsers, _mockSkills, _mockUserSkills) {
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      UserSkillsBulkAction = _UserSkillsBulkAction;
      userSkillsBulkActionTypes = _userSkillsBulkActionTypes;
      mockTenantUsers = _mockTenantUsers;
      mockSkills = _mockSkills;
      mockUserSkills = _mockUserSkills;
    }
  ]));
  
  beforeEach(inject(['tenantUserTransformer', function(tenantUserTransformer) {
    tenantUserTransformer.transform(mockTenantUsers[0]);
  }]));

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

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills').respond(200, mockTenantUsers[0]);

      userSkillBulkAction.execute(mockTenantUsers[0]);

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

        var tenantSkillUser = userSkillBulkAction.selectedType.execute(mockTenantUsers[0], userSkillBulkAction);

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
        userSkillBulkAction.params.skillId = mockSkills[2].id;
        userSkillBulkAction.params.proficiency = 0;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(mockTenantUsers[0],
          userSkillBulkAction);

        expect(doesQualify).toBeTruthy();
      });

      it('should return true if user has the skill but different proficiency', function() {
        var user = mockTenantUsers[0];
        user.$skills = [{id: mockSkills[0].id, proficiency: 5}];
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.params.proficiency = 10;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(user,
          userSkillBulkAction);

        expect(doesQualify).toBeTruthy();
      });

      it('should return false if user has the skill and same proficiency', function() {
        var user = mockTenantUsers[0];
        user.$skills = [{id: mockSkills[0].id, proficiency: 10}];
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.params.proficiency = 10;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(user,
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

        var tenantSkillUser = userSkillBulkAction.selectedType.execute(mockTenantUsers[0], userSkillBulkAction);

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
        var user = mockTenantUsers[0];
        user.$skills = [{id: mockSkills[2].id, proficiency: 5}];
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.params.proficiency = 0;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(user,
          userSkillBulkAction);

        expect(doesQualify).toBeFalsy();
      });

      it('should return true if user has the skill but different proficiency', function() {
        var user = mockTenantUsers[0];
        user.$skills = [{id: mockSkills[0].id, proficiency: 5}];
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.params.proficiency = 10;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(user,
          userSkillBulkAction);

        expect(doesQualify).toBeTruthy();
      });

      it('should return false if user has the skill and same proficiency', function() {
        var user = mockTenantUsers[0];
        user.$skills = [{id: mockSkills[0].id, proficiency: 10}];
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.params.proficiency = 10;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(user,
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

        userSkillBulkAction.selectedType.execute(mockTenantUsers[0], userSkillBulkAction);

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
        var user = mockTenantUsers[0];
        user.$skills = [{id: mockSkills[1].id}];
        userSkillBulkAction.params.skillId = mockSkills[2].id;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(user,
          userSkillBulkAction);

        expect(doesQualify).toBeFalsy();
      });

      it('should return true if user has the skill', function() {
        var user = mockTenantUsers[0];
        user.$skills = [{id: mockSkills[0].id}];
        
        userSkillBulkAction.params.skillId = mockSkills[0].id;

        var doesQualify = userSkillBulkAction.selectedType.doesQualify(user,
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

    it('should return true if the user has the skill matching the given id', function() {
      var user = mockTenantUsers[0];
      user.$skills = [{id: mockUserSkills[0].skillId}, {id: mockUserSkills[1].skillId}];
      
      var result = hasSkill(user, mockUserSkills[0].skillId);
      expect(result).toBeTruthy();
    });

    it('should return false if the user doesn\'t have a skill matching the given id', function() {
      var user = mockTenantUsers[0];
      user.$skills = [{id: mockUserSkills[0].skillId}, {id: mockUserSkills[1].skillId}];
      
      var result = hasSkill(user, mockUserSkills[3].skillId);
      expect(result).toBeFalsy();
    });
  });

});
