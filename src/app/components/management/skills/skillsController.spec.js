'use strict';

describe('SkillsController', function() {
  var $scope,
    $httpBackend,
    Session,
    apiHostname,
    Skill,
    mockSkills,
    mockTenantUsers,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.skill.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'Session', 'apiHostname', 'Skill', 'mockSkills', 'mockTenantUsers', 'loEvents',
    function($rootScope, $controller, _$httpBackend, _Session, _apiHostname, _Skill, _mockSkills, _mockTenantUsers, _loEvents) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      Session = _Session;
      apiHostname = _apiHostname;
      Skill = _Skill;
      mockSkills = _mockSkills;
      mockTenantUsers = _mockTenantUsers;
      loEvents = _loEvents;

      $controller('SkillsController', {
        '$scope': $scope
      });
    }
  ]));

  describe('ON fetchSkills', function() {
    it('should be defined', function() {
      expect($scope.fetchSkills).toBeDefined();
    });

    it('should return skills on call', function() {
      var skills = $scope.fetchSkills();

      $httpBackend.flush();

      expect(skills.length).toEqual(2);
    });
  });

  it('should have stuff defined at startup', function() {
    expect($scope.Session).toBeDefined();
    expect($scope.tableConfig).toBeDefined();
  });

  it('should set selectedSkill on createSkill', function() {
    $scope.$broadcast(loEvents.tableControls.itemCreate);

    expect($scope.selectedSkill).toBeDefined();
    expect($scope.selectedSkill.tenantId).toEqual(Session.tenant.tenantId);
  });

  it('should save the selected skill on submit', function() {
    $scope.selectedSkill = new Skill();
    spyOn($scope.selectedSkill, 'save');

    $scope.submit();
    expect($scope.selectedSkill.save).toHaveBeenCalled();
  });

  describe('fetchTenantUsers function', function() {
    it('should be defined', function() {
      expect($scope.fetchTenantUsers).toBeDefined();
    });

    it('should return the list of tenant users', function() {
      var users = $scope.fetchTenantUsers();

      $httpBackend.flush();

      expect(users.length).toEqual(2);
    });
  });

  describe('fetchSkillUsers prototype function', function() {
    it('should return the list of skill users', function() {
      var skill = new Skill({
        id: 'skillId1',
        tenantId: 'tenant-id'
      });

      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/skills/skillId1/users');
      var result = skill.fetchSkillUsers();
      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toEqual(2);
    });

    it('should set the members property of the skill', function() {
      var skill = new Skill({
        id: 'skillId1',
        tenantId: 'tenant-id'
      });

      skill.fetchSkillUsers();
      $httpBackend.flush();

      expect(skill.$members).toBeDefined();
      expect(skill.$members.length).toEqual(2);
    });
  });

  describe('remove user function', function() {
    it('should delete the skill from the given user', inject(function(TenantSkillUser) {
      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1');
      $scope.selectedSkill = mockSkills[0];

      var skillUser = new TenantSkillUser({
        tenantId: 'tenant-id',
        userId: 'userId1',
        skillId: 'skillId1'
      });
      $scope.removeUser(skillUser);
      $httpBackend.flush();
    }));

    it('should remove the skill from the cached tenant user', inject(function(TenantSkillUser, queryCache) {
      mockTenantUsers[0].$skills = [{
        id: 'skillId1'
      }];

      var originalGet = queryCache.get;
      spyOn(queryCache, 'get').and.callFake(function(key) {
        if (key === 'TenantUser') {
          return [mockTenantUsers[0]];
        } else {
          return originalGet(key);
        }
      });

      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1').respond(200);
      $scope.selectedSkill = mockSkills[0];

      var skillUser = new TenantSkillUser({
        tenantId: 'tenant-id',
        userId: 'userId1',
        skillId: 'skillId1'
      });
      $scope.removeUser(skillUser);
      $httpBackend.flush();

      expect(mockTenantUsers[0].$skills.length).toBe(0);
    }));

    it('should show an error if the delete fails', inject(function(TenantSkillUser, queryCache, Alert) {
      spyOn(Alert, 'error');
      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1').respond(500);
      $scope.selectedSkill = mockSkills[0];
      var skillUser = new TenantSkillUser({
        tenantId: 'tenant-id',
        userId: 'userId1',
        skillId: 'skillId1'
      });
      $scope.removeUser(skillUser);
      $httpBackend.flush();

      expect(Alert.error).toHaveBeenCalled();
    }));
  });

  describe('addUser function', function() {
    it('save the new user skill', inject([function() {
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills');
      $scope.selectedSkill = mockSkills[0];
      $scope.selectedSkill.$original = mockSkills[0];

      $scope.addUser(mockTenantUsers[0]);
      $httpBackend.flush();
    }]));

    it('should set saving to true', inject([function() {
      $scope.selectedSkill = mockSkills[0];
      $scope.selectedSkill.$original = mockSkills[0];

      $scope.addUser(mockTenantUsers[0]);
      expect($scope.saving).toBeTruthy();
    }]));

    it('should do nothing if selectedUser is null', inject([function() {
      $scope.addUser(null);
      expect($scope.saving).toBeFalsy();
    }]));

    it('should add the skill to the existing tenantskilluser cache', inject(function(queryCache) {
      var originalCacheGet = queryCache.get;
      spyOn(queryCache, 'get').and.callFake(function(key) {
        if (key === 'TenantUser') {
          return [mockTenantUsers[0]];
        } else {
          return originalCacheGet(key);
        }
      });

      mockTenantUsers[0].$skills = [];

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills');
      $scope.selectedSkill = mockSkills[0];
      $scope.selectedSkill.$original = mockSkills[0];

      $scope.addUser(mockTenantUsers[0]);
      $httpBackend.flush();
      expect(mockTenantUsers[0].$skills.length).toBe(1);
    }));

    it('should set proficiency if the skill has proficiency', function() {

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills', {
        skillId: 'skillId1',
        tenantId: 'tenant-id',
        userId: 'userId1',
        proficiency: 20
      });
      mockSkills[0].hasProficiency = true;
      $scope.selectedSkill = mockSkills[0];
      $scope.selectedSkill.$original = mockSkills[0];

      $scope.params.proficiency = 20;
      $scope.addUser(mockTenantUsers[0]);
      $httpBackend.flush();
    });

    it('should show an error message if save fails', inject(function(Alert) {
      spyOn(Alert, 'error');
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills').respond(500);
      $scope.selectedSkill = mockSkills[0];
      $scope.selectedSkill.$original = mockSkills[0];

      $scope.addUser(mockTenantUsers[0]);
      $httpBackend.flush();
      expect(Alert.error).toHaveBeenCalled();
    }));
  });
});
