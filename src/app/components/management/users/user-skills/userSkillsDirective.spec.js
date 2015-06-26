'use strict';

/* global spyOn, jasmine : false */
describe('userGroups directive', function(){
  var $scope,
    $httpBackend,
    apiHostname,
    element,
    Session,
    isolateScope,
    TenantUserSkills,
    userSkills,
    skills;

  beforeEach(module('gulpAngular'));

  beforeEach(function(){
    module('liveopsConfigPanel');
  });

  beforeEach(inject(['$compile', '$rootScope', 'TenantUserSkills', 'Skill', 'Session', '$httpBackend', 'apiHostname',
      function ($compile, _$rootScope_, _TenantUserSkills_, Skill, _Session_, _$httpBackend_, _apiHostname_) {
    $scope = _$rootScope_.$new();
    TenantUserSkills = _TenantUserSkills_;
    Session = _Session_;
    $httpBackend = _$httpBackend_;
    apiHostname = _apiHostname_;
    
    $scope.user = {
      id : '1'
    };
    
    Session.tenant = {tenantId : '1'};
    
    skills = [new Skill({id: 'a'}), 
              new Skill({id: '2'}), 
              new Skill({id: 'skillthree', name: 'Three'})
    ];

    userSkills = [new TenantUserSkills({skillId: 'a'}), 
                  new TenantUserSkills({skillId: '2'})
    ];
    
    spyOn(TenantUserSkills, 'query').and.callFake(function(param, callback){
      callback(); 
      return userSkills;
    });
    
    spyOn(Skill, 'query').and.callFake(function(param, callback){
      callback(); 
      return skills;
    });
    
    element = $compile('<user-skills user="user"></user-skills>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should have skills defined', function(){
    expect(isolateScope.skills).toBeDefined();
    expect(isolateScope.skills.length).toEqual(skills.length);
  });
  
  it('should have userSkills defined', function(){
    expect(isolateScope.userSkills).toBeDefined();
    expect(isolateScope.userSkills.length).toEqual(userSkills.length);
  });
  
  it('should not have skills or userSkill defined if no tenant is selected', inject(['$compile', function($compile){
    Session.tenant = {};
    element = $compile('<user-skills user="user"></user-skills>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    expect(isolateScope.userSkills).toBeUndefined();
    expect(isolateScope.skills).toBeUndefined();
  }]));
  
  describe('remove function', function(){
    it('should exist', function(){
      expect(isolateScope.remove).toBeDefined();
      expect(isolateScope.remove).toEqual(jasmine.any(Function));
    });
    
    it('should call delete on the item', function(){
      var tus = new TenantUserSkills();
      spyOn(tus, '$delete');
      isolateScope.remove(tus);
      expect(tus.$delete).toHaveBeenCalled();
    });
    
    it('should remove the deleted item from userSkills on success', function(){
      spyOn(isolateScope.userSkills[0], '$delete').and.callFake(function(param, successCallback){
        successCallback();
      });
      
      isolateScope.remove(isolateScope.userSkills[0]);
      expect(isolateScope.userSkills.length).toBe(1);
      expect(isolateScope.userSkills[0].skillId).toEqual('2');
    });
    
    it('should do nothing on failure', function(){
      spyOn(isolateScope.userSkills[0], '$delete').and.callFake(function(param, successCallback, failCallback){
        failCallback();
      });
      
      isolateScope.remove(isolateScope.userSkills[0]);
      expect(isolateScope.userSkills.length).toBe(2);
      expect(isolateScope.userSkills[0].skillId).toEqual('a');
    });
  });
  
  describe('fetch function', function(){
    it('should exist', function(){
      expect(isolateScope.fetch).toBeDefined();
      expect(isolateScope.fetch).toEqual(jasmine.any(Function));
    });
    
    it('should set saving to false', function(){
      isolateScope.saving = true;
      isolateScope.fetch();
      expect(isolateScope.saving).toBeFalsy();
      
      isolateScope.saving = true;
      delete Session.tenant.tenantId;
      isolateScope.fetch();
      expect(isolateScope.saving).toBeFalsy();
    });
    
    it('should not get userSkills if no tenant is selected', function(){
      delete Session.tenant.tenantId;
      TenantUserSkills.query.calls.reset();
      isolateScope.fetch();
      expect(TenantUserSkills.query).not.toHaveBeenCalled();
    });
    
    it('should query TenantuserSkills', function(){
      TenantUserSkills.query.calls.reset();
      isolateScope.fetch();
      expect(TenantUserSkills.query).toHaveBeenCalled();
    });
    
    it('should call reset on success', function(){
      spyOn(isolateScope, 'reset');
      isolateScope.fetch();
      expect(isolateScope.reset).toHaveBeenCalled();
    });
  });
  
  describe('reset function', function(){
    it('should exist', function(){
      expect(isolateScope.reset).toBeDefined();
      expect(isolateScope.reset).toEqual(jasmine.any(Function));
    });
    
    it('should reset selectedSkill', function(){
      isolateScope.selectedSkill = {id: 'id'};
      isolateScope.reset();
      expect(isolateScope.selectedSkill).toBeNull();
    });
    
    it('should reset newUserSkill', function(){
      isolateScope.newUserSkill = {
          skillId: 'someid'
      };
      
      isolateScope.reset();
      expect(isolateScope.newUserSkill.skillId).toBeNull();
    });
  });
  
  describe('save function', function(){
    beforeEach(function(){
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/users/1/skills').respond({});
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/skills').respond({result : {id : 'newid'}});
    });
    
    it('should exist', function(){
      expect(isolateScope.save).toBeDefined();
      expect(isolateScope.save).toEqual(jasmine.any(Function));
    });
    
    it('should set saving to true', function(){
      isolateScope.save();
      expect(isolateScope.saving).toBeTruthy();
    });
    
    it('should create a new skill if the user entered a new one', function(){
      isolateScope.selectedSkill = {name: 'totally new skill'};
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/skills');
      isolateScope.save();
      $httpBackend.flush();
    });
    
    it('should set hasProficiency for the new skill', function(){
      spyOn(isolateScope, 'saveUserSkill'); //Stub this out for this test
      isolateScope.selectedSkill = {name: 'totally new skill'};
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/skills', function(requestBody){
        var data = JSON.parse(requestBody);
        return data.hasProficiency === false;
      });
      isolateScope.save();
      $httpBackend.flush();
      
      isolateScope.selectedSkill = {name: 'totally new skill'};
      isolateScope.newUserSkill = {proficiency : '0'};
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/skills', function(requestBody){
        var data = JSON.parse(requestBody);
        return data.hasProficiency === true;
      });
      isolateScope.save();
      $httpBackend.flush();
    });
    
    it('should call save user skill on create skill success', function(){
      isolateScope.selectedSkill = {name: 'totally new skill'};
      spyOn(isolateScope, 'saveUserSkill');
      isolateScope.save();
      $httpBackend.flush();
      expect(isolateScope.selectedSkill.id).toEqual('newid');
      expect(isolateScope.saveUserSkill).toHaveBeenCalled();
    });
    
    it('should call save user skill if the skill already exists', function(){
      isolateScope.selectedSkill = skills[2];
      spyOn(isolateScope, 'saveUserSkill');
      isolateScope.save();
      expect(isolateScope.saveUserSkill).toHaveBeenCalled();
    });
  });
  
  describe('saveUserSkill function', function(){
    beforeEach(function(){
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/users/1/skills').respond({});
      isolateScope.selectedSkill = {id : 'skillthree', name: 'Three'};
    });
    
    it('should exist', function(){
      expect(isolateScope.saveUserSkill).toBeDefined();
      expect(isolateScope.saveUserSkill).toEqual(jasmine.any(Function));
    });
    
    it('should save a proficiency of 0 if the selected skill doesn\'t have proficiency', function(){
      isolateScope.saveUserSkill();
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/users/1/skills', function(requestBody){
        var data = JSON.parse(requestBody);
        return data.proficiency === 0;
      });
      $httpBackend.flush();
      
      isolateScope.selectedSkill = {id : 'skillthree', name: 'Three'};
      isolateScope.newUserSkill = new TenantUserSkills({proficiency : '100', tenantId: '1', userId: '1'});
      isolateScope.saveUserSkill();
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/users/1/skills', function(requestBody){
        var data = JSON.parse(requestBody);
        return data.proficiency === 0;
      });
      $httpBackend.flush();
    });
    
    it('should save the given proficiency if the selected skill hasProficiency', function(){
      isolateScope.selectedSkill.hasProficiency = true;
      isolateScope.newUserSkill.proficiency = '33';
      isolateScope.saveUserSkill();
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/users/1/skills', function(requestBody){
        var data = JSON.parse(requestBody);
        return data.proficiency === 33;
      });
    });
    
    it('should add the user skill if its new', function(){
      expect(isolateScope.userSkills.length).toBe(2);
      isolateScope.saveUserSkill();
      expect(isolateScope.userSkills.length).toBe(3);
    });
    
    it('should update the proficiency of an existing user skill', function(){
      isolateScope.selectedSkill = {id : 'a', hasProficiency: true};
      isolateScope.newUserSkill.proficiency = 33;
      isolateScope.saveUserSkill();
      expect(isolateScope.userSkills[0].proficiency).toEqual(33);
    });
    
    it('should reset on success', function(){
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserSkill();
      $httpBackend.flush();
      expect(isolateScope.reset).toHaveBeenCalled();
      expect(isolateScope.saving).toBeFalsy();
    });
    
    it('should fetch on error', function(){
      spyOn(isolateScope, 'fetch');
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/users/1/skills').respond(500);
      isolateScope.saveUserSkill();
      $httpBackend.flush();
      expect(isolateScope.fetch).toHaveBeenCalled();
    });
  });
});
