'use strict';

describe('setSkillsBulkAction', function () {
  var $httpBackend,
    apiHostname,
    UserSkillsBulkAction,
    userSkillsBulkActionTypes,
    userSkillsBulkActionType,
    mockUsers,
    mockSkills,
    mockUserSkills;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));

  beforeEach(inject(['$httpBackend', 'apiHostname', 'UserSkillsBulkAction', 'userSkillsBulkActionTypes', 'mockUsers', 'mockSkills', 'mockUserSkills',
    function (_$httpBackend, _apiHostname, _UserSkillsBulkAction, _userSkillsBulkActionTypes, _mockUsers, _mockSkills, _mockUserSkills) {
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      UserSkillsBulkAction = _UserSkillsBulkAction;
      userSkillsBulkActionTypes = _userSkillsBulkActionTypes;
      mockUsers = _mockUsers;
      mockSkills = _mockSkills;
      mockUserSkills = _mockUserSkills;
    }
  ]));

  describe('canExecute', function () {
    it('should return false when no skill is selected', function () {
      var userSkillBulkAction = new UserSkillsBulkAction();
      var canExecute = userSkillBulkAction.canExecute();
      expect(canExecute).toBeFalsy();
    });
  });

  describe('execute', function () {
    it('should call POST end-point', function () {
      var userSkillBulkAction = new UserSkillsBulkAction();
      userSkillBulkAction.selectedSkill = mockSkills[1];

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills');

      userSkillBulkAction.execute(mockUsers[0]);

      $httpBackend.flush();
    });
  });

  describe('userSkillsBulkActionType "add"', function () {
    beforeEach(function () {
      userSkillsBulkActionType = userSkillsBulkActionTypes[0];
    });

    it('should have functions defined', function () {
      expect(userSkillsBulkActionType.execute).toBeDefined();
      expect(userSkillsBulkActionType.canExecute).toBeDefined();
      expect(userSkillsBulkActionType.doesQualify).toBeDefined();
    });

    describe('ON execute', function () {
      it('should call POST end-point', function () {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.selectedSkill = mockSkills[1];

        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills');

        var tenantSkillUser = userSkillsBulkActionType.execute(mockUsers[0], userSkillBulkAction);

        $httpBackend.flush();

        expect(tenantSkillUser).toBeDefined();
        expect(tenantSkillUser.id).toEqual(mockUserSkills[1].id);
      });
    });
    
    describe('ON canExecute', function () {
      it('should return true when skill and type is selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.selectedSkill = mockSkills[0];
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeTruthy();
      });
      
      it('should return false when skill is not selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
      
      it('should return false when type is not selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.selectedType = null;
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
    });
    
    describe('ON doesQualify', function () {
      it('should do something', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
      });
    });
  });
  
  describe('userSkillsBulkActionType "update"', function () {
    beforeEach(function () {
      userSkillsBulkActionType = userSkillsBulkActionTypes[1];
    });

    it('should have functions defined', function () {
      expect(userSkillsBulkActionType.execute).toBeDefined();
      expect(userSkillsBulkActionType.canExecute).toBeDefined();
      expect(userSkillsBulkActionType.doesQualify).toBeDefined();
    });

    describe('ON execute', function () {
      it('should call PUT end-point', function () {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.params.skillId = mockSkills[0].id

        $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1');

        var tenantSkillUser = userSkillsBulkActionType.execute(mockUsers[0], userSkillBulkAction);

        $httpBackend.flush();

        expect(tenantSkillUser).toBeDefined();
        expect(tenantSkillUser.id).toEqual(mockUserSkills[0].id);
      });
    });
    
    describe('ON canExecute', function () {
      it('should return true when skill and type is selected and proficiency is defined', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.params.proficiency = 5;
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeTruthy();
      });
      
      it('should return false when skill is not selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
      
      it('should return false when type is not selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        userSkillBulkAction.selectedType = null;
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
      
      it('should return false when proficiency is not selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
    });
  });

  describe('userSkillsBulkActionType "remove"', function () {
    beforeEach(function () {
      userSkillsBulkActionType = userSkillsBulkActionTypes[2];
    });

    it('should return something on exe', function () {
      expect(userSkillsBulkActionType.execute).toBeDefined();
      expect(userSkillsBulkActionType.canExecute).toBeDefined();
      expect(userSkillsBulkActionType.doesQualify).toBeDefined();
    })

    describe('ON execute', function () {
      it('should call DELETE end-point', function () {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.params.skillId =  mockSkills[0].id;

        $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1');

        var tenantSkillUser = userSkillsBulkActionType.execute(mockUsers[0], userSkillBulkAction);

        $httpBackend.flush();
      });
    });
    
    describe('ON canExecute', function () {
      it('should return true when skill and type is selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.params.skillId = mockSkills[0].id;
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeTruthy();
      });
      
      it('should return false when skill is not selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
      
      it('should return false when type is not selected', function() {
        var userSkillBulkAction = new UserSkillsBulkAction();
        userSkillBulkAction.selectedType = null;
        
        var canExecute = userSkillsBulkActionType.canExecute(userSkillBulkAction);
        expect(canExecute).toBeFalsy();
      });
    });
  });

});