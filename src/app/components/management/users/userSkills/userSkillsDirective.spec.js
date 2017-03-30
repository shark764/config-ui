'use strict';

/* global spyOn, jasmine : false */
describe('userSkills directive', function(){
  var $scope,
    $httpBackend,
    Session,
    apiHostname,
    element,
    isolateScope,
    mockSkills,
    mockUserSkills,
    mockTenantUsers,
    TenantUserSkill;

  beforeEach(module('gulpAngular', 'liveopsConfigPanel', 'liveopsConfigPanel.mock',
      'liveopsConfigPanel.tenant.user.mock', 'liveopsConfigPanel.tenant.skill.mock', 'liveopsConfigPanel.mockutils'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'Session', 'apiHostname', 'mockSkills', 'mockUserSkills', 'mockTenantUsers', 'TenantUserSkill', 'tenantUserTransformer',
    function($compile, $rootScope, _$httpBackend, _Session, _apiHostname, _mockSkills, _mockUserSkills, _mockTenantUsers, _TenantUserSkill, tenantUserTransformer) {
      $scope = $rootScope.$new();

      $httpBackend = _$httpBackend;
      Session = _Session;
      apiHostname = _apiHostname;
      mockSkills = _mockSkills;
      mockUserSkills = _mockUserSkills;
      mockTenantUsers = _mockTenantUsers;
      TenantUserSkill = _TenantUserSkill;

      tenantUserTransformer.transform(mockTenantUsers[0]);
      $scope.user = mockTenantUsers[0];

      element = $compile('<user-skills user="user"></user-skills>')($scope);
      $scope.$digest();
      $httpBackend.flush();

      isolateScope = element.isolateScope();
    }
  ]));

  it('should call reset when the user changes', function() {
    spyOn(isolateScope, 'reset');
    $scope.user = {id: 'userId2', $skills: []};
    $scope.$digest();
    isolateScope.$digest();
    expect(isolateScope.reset).toHaveBeenCalled();
  });

  describe('ON fetchSkills', function() {
    it('should be defined', function() {
      expect(isolateScope.fetchSkills);
    });

    it('should return skills on call', function() {
      var skills = isolateScope.fetchSkills();

      expect(skills).toBeDefined();
      expect(skills.length).toEqual(2);
    });
  });

  describe('remove function', function() {
    it('should exist', function() {
      expect(isolateScope.remove).toBeDefined();
      expect(isolateScope.remove).toEqual(jasmine.any(Function));
    });

    it('should call delete on the item', function() {
      var tus = new TenantUserSkill();
      spyOn(tus, '$delete');
      isolateScope.remove(tus);
      expect(tus.$delete).toHaveBeenCalled();
    });

    it('should remove the deleted item from userSkill cache on success', function() {
      // This functionality is handled by the interceptor on TenantUserSkill
      isolateScope.remove(isolateScope.userSkills[0]);
      $httpBackend.flush();
      isolateScope.$digest();
      expect(isolateScope.userSkills.length).toBe(1);
      expect(isolateScope.userSkills[0].skillId).toEqual('skillId2');
    });

    it('should do nothing on failure', function() {
      spyOn(isolateScope.userSkills[0], '$delete').and.callFake(function(param, successCallback, failCallback) {
        failCallback();
      });

      isolateScope.remove(isolateScope.userSkills[0]);
      expect(isolateScope.userSkills.length).toBe(2);
      expect(isolateScope.userSkills[0].skillId).toEqual('skillId1');
    });

    it('should remove the deleted item from the user\'s skills array', function() {
      isolateScope.user.$skills = [{
        id: isolateScope.userSkills[0].skillId
      }, {
        id: isolateScope.userSkills[1].skillId
      }];

      isolateScope.remove(isolateScope.userSkills[0]);
      $httpBackend.flush();
      isolateScope.$digest();

      expect(isolateScope.user.$skills.length).toBe(1);
      expect(isolateScope.user.$skills[0].id).toEqual('skillId2');
    });
  });

  describe('reset function', function() {
    it('should exist', function() {
      expect(isolateScope.reset).toBeDefined();
      expect(isolateScope.reset).toEqual(jasmine.any(Function));
    });

    it('should reset selectedSkill', function() {
      isolateScope.selectedSkill = {
        id: 'id'
      };
      isolateScope.reset();
      expect(isolateScope.selectedSkill).toBeNull();
    });

    it('should reset newUserSkill', function() {
      isolateScope.newUserSkill = {
        skillId: 'someid'
      };

      isolateScope.reset();
      expect(isolateScope.newUserSkill.skillId).toBeNull();
    });

    it('should reset the form name field', inject(function(mockForm) {
      isolateScope.skillsForm = mockForm(['name']);

      isolateScope.reset();
      expect(isolateScope.skillsForm.name.$setPristine).toHaveBeenCalled();
      expect(isolateScope.skillsForm.name.$setUntouched).toHaveBeenCalled();
    }));
  });

  describe('save function', function() {
    it('should exist', function() {
      expect(isolateScope.save).toBeDefined();
      expect(isolateScope.save).toEqual(jasmine.any(Function));
    });

    it('should do nothing if the selected skill is null', function() {
      spyOn(isolateScope, 'saveUserSkill');

      isolateScope.save(null);
      isolateScope.$digest();
      expect(isolateScope.saveUserSkill).not.toHaveBeenCalled();
    });

    it('should set saving to true', function() {
      isolateScope.save({});
      expect(isolateScope.saving).toBeTruthy();
    });

    it('should create a new skill if given a string', function() {
      spyOn(isolateScope, 'saveUserSkill'); //Stub this out for this test
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/skills');
      isolateScope.save('totally new skill');
      $httpBackend.flush();
    });

    it('should set hasProficiency for the new skill', function() {
      spyOn(isolateScope, 'saveUserSkill'); //Stub this out for this test

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/skills', function(requestBody) {
        var data = JSON.parse(requestBody);
        return data.hasProficiency === false;
      });
      isolateScope.save('totally new skill');
      $httpBackend.flush();

      isolateScope.newUserSkill = {
        proficiency: '0'
      };
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/skills', function(requestBody) {
        var data = JSON.parse(requestBody);
        return data.hasProficiency === true;
      });
      isolateScope.save('totally new skill');
      $httpBackend.flush();
    });

    it('should call save user skill on create skill success', function() {
      spyOn(isolateScope, 'saveUserSkill');
      isolateScope.save('totally new skill');
      $httpBackend.flush();
      expect(isolateScope.saveUserSkill).toHaveBeenCalled();
    });

    it('should call save user skill if the skill already exists', function() {
      spyOn(isolateScope, 'saveUserSkill');
      isolateScope.save(mockSkills[2]);
      expect(isolateScope.saveUserSkill).toHaveBeenCalled();
    });
  });

  describe('saveUserSkill function', function() {
    it('should exist', function() {
      expect(isolateScope.saveUserSkill).toBeDefined();
      expect(isolateScope.saveUserSkill).toEqual(jasmine.any(Function));
    });

    it('should not send proficiency if the selected skill doesn\'t have proficiency', function() {
      isolateScope.newUserSkill = new TenantUserSkill({
        proficiency: '100',
        tenantId: 'tenant-id',
        userId: 'userId1'
      });
      isolateScope.saveUserSkill({
        id: 'skillthree',
        name: 'Three'
      });
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills', function(requestBody) {
        var data = JSON.parse(requestBody);
        return data.proficiency === undefined;
      });
      $httpBackend.flush();
    });

    it('should save the given proficiency if the selected skill hasProficiency', function() {
      mockSkills[0].hasProficiency = true;
      isolateScope.newUserSkill.proficiency = '33';
      isolateScope.saveUserSkill(mockSkills[0]);
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills', function(requestBody) {
        var data = JSON.parse(requestBody);
        return data.proficiency === 33;
      });
    });

    it('should set a default proficiency of 1 if the selected skill hasProficiency', function() {
      mockSkills[0].hasProficiency = true;
      isolateScope.saveUserSkill(mockSkills[0]);
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills', function(requestBody) {
        var data = JSON.parse(requestBody);
        return data.proficiency === 1;
      });
    });

    it('should add the user skill to the userSkills list', function() {
      expect(isolateScope.userSkills.length).toBe(2);
      isolateScope.saveUserSkill(mockSkills[0]);
      $httpBackend.flush();
      isolateScope.$digest();
      expect(isolateScope.userSkills.length).toBe(3);
    });

    it('should reset on success', function() {
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserSkill(mockSkills[0]);
      $httpBackend.flush();
      expect(isolateScope.reset).toHaveBeenCalled();
      expect(isolateScope.saving).toBeFalsy();
    });
  });

  describe('updateUserSkill function', function() {
    it('should be defined', function() {
      expect(isolateScope.updateUserSkill).toBeDefined();
      expect(isolateScope.updateUserSkill).toEqual(jasmine.any(Function));
    });

    it('should save the given userSkill', function() {
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1').respond(200);
      isolateScope.updateUserSkill(mockUserSkills[0]);
      $httpBackend.flush();
    });
  });
});
