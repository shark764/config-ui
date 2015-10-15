'use strict';

describe('SkillsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    Session,
    apiHostname,
    Skill;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'Session', 'apiHostname', 'Skill',
    function ($rootScope, _$controller_, _$httpBackend_, _Session_, _apiHostname_, _Skill) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      Skill = _Skill;
    }
  ]));

  beforeEach(function() {
    $controller('SkillsController', {'$scope': $scope});
  });
  
  describe('ON fetchSkills', function() {
    it('should be defined', function() {
      expect($scope.fetchSkills);
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
    $scope.$broadcast('table:on:click:create');

    expect($scope.selectedSkill).toBeDefined();
    expect($scope.selectedSkill.tenantId).toEqual(Session.tenant.tenantId);
  });
  
  it('should save the selected skill on submit', function() {
    $scope.selectedSkill = new Skill();
    spyOn($scope.selectedSkill, 'save');
    
    $scope.submit();
    expect($scope.selectedSkill.save).toHaveBeenCalled();
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
      
      expect(skill.members).toBeDefined();
      expect(skill.members.length).toEqual(2);
    });
  });
  
  describe('remove user function', function() {
    it('should delete the skill from the given user', inject(['mockSkills', 'TenantSkillUser', function(mockSkills, TenantSkillUser) {
      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1');
      $scope.selectedSkill = mockSkills[0];

      var skillUser = new TenantSkillUser({
        tenantId: 'tenant-id',
        userId: 'userId1',
        skillId: 'skillId1'
      });
      $scope.removeUser(skillUser);
      $httpBackend.flush();
    }]));
    
    it('should remove the skill from the cached tenant user', inject(['mockSkills', 'TenantSkillUser', 'queryCache', 'mockTenantUsers', function(mockSkills, TenantSkillUser, queryCache, mockTenantUsers) {
      mockTenantUsers[0].$skills = [{
        id: 'skillId1'
      }];
      
      var originalGet = queryCache.get;
      spyOn(queryCache, 'get').and.callFake(function(key){
        if (key === 'TenantUser'){
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
    }]));
    
    it('should show an error if the delete fails', inject(['mockSkills', 'TenantSkillUser', 'queryCache', 'mockTenantUsers', 'Alert', function(mockSkills, TenantSkillUser, queryCache, mockTenantUsers, Alert) {
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
    }]));
  });

});
