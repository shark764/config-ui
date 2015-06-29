'use strict';

/* global spyOn, jasmine : false */
describe('userGroups directive', function(){
  var $scope,
    $httpBackend,
    element,
    isolateScope,
    groups,
    userGroups,
    TenantUserGroups,
    apiHostname,
    Session;

  beforeEach(module('gulpAngular'));

  beforeEach(function(){
    module('liveopsConfigPanel', function($provide) {
      Session = {
        tenant : {
          tenantId : 1
        },
        isAuthenticated : function(){
          return true;
        },
        user : {
          id : 1
        }
      };

      $provide.service('Session', function() {
        return Session;
      });
    });
  });

  beforeEach(inject(['$compile', '$rootScope', 'User', '$httpBackend', 'apiHostname', 'Group', 'TenantUserGroups', 
                     function ($compile, _$rootScope_, User, _$httpBackend_, _apiHostname_, Group, _TenantUserGroups_) {
    $scope = _$rootScope_.$new();
    $httpBackend = _$httpBackend_;
    TenantUserGroups = _TenantUserGroups_;
    apiHostname = _apiHostname_;

    $scope.user = new User({id : 1});

    //Mock the group services
    groups = [{id: 'g1'}, {id: 'g2'}, {id: 'g3'}];
    userGroups = [{id: 'g2'}, {id: 'g3'}];
    userGroups.$promise = {then : function(callback){callback();}};
    spyOn(TenantUserGroups, 'query').and.returnValue(userGroups);
    spyOn(Group, 'query').and.callFake(function(params, successCallback){if (typeof successCallback !== 'undefined') {successCallback();} return groups;});
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups').respond({'result' : groups});
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/users/1/groups').respond({'result' : userGroups});

    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }]});

    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
      'tenants': []
    }});

    element = $compile('<user-groups user="user"></user-groups>')($scope);
    $scope.$digest();

    isolateScope = element.isolateScope();
    spyOn(isolateScope, 'updateCollapseState'); //Stub this out so we dont trigger digests in the tests
  }]));

  it('should have groups defined', inject(function() {
    expect(isolateScope.groups).toBeDefined();
  }));

  it('should load the groups for the tenant', inject(function() {
    expect(isolateScope.groups.length).toEqual(groups.length);
    expect(isolateScope.groups).toEqual(groups);
  }));

  it('should have userGroups defined', inject(function() {
    expect(isolateScope.userGroups).toBeDefined();
  }));

  it('should load the user\'s groups', inject(function() {
    expect(isolateScope.userGroups.length).toEqual(userGroups.length);
    expect(isolateScope.userGroups).toEqual(userGroups);
   }));

  describe('fetch function', function(){
    it('should be called when user changes', inject(['User', function(User) {
      spyOn(isolateScope, 'fetch');
      $scope.user = new User({id: 2});
      $scope.$digest();
      expect(isolateScope.fetch).toHaveBeenCalled();
    }]));

    it('should do nothing if there is no tenant selected', inject(function() {
      Session.tenant = {};
      TenantUserGroups.query.calls.reset(); //Reset the spy since it's called on init
      isolateScope.fetch();
      expect(TenantUserGroups.query).not.toHaveBeenCalled();
    }));

    it('should load the user\'s groups', inject(function() {
      isolateScope.groups = [];
      isolateScope.fetch();
      expect(isolateScope.groups.length).toEqual(groups.length);
      expect(isolateScope.groups).toEqual(groups);
    }));

    it('should update filtered', inject(function() {
      isolateScope.filtered = [];
      isolateScope.fetch();
      expect(isolateScope.filtered.length).toEqual(groups.length);
      expect(isolateScope.filtered).toEqual(groups);
    }));

    it('should call updatecollapsestate', inject(['$timeout', function($timeout) {
      isolateScope.fetch();
      $timeout.flush();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
    }]));
  });

  describe('remove function', function(){
    beforeEach(function(){
      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/1/groups/g2/users/1').respond({});
    });

    it('should call TenantUserGroup delete', inject(function() {
      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/1/groups/g2/users/1');
      isolateScope.remove({tenantId : 1, memberId:1, groupId : 'g2'});
      $httpBackend.flush();
    }));

    it('should call updatecollapsestate', inject(['$timeout', function($timeout) {
      isolateScope.updateCollapseState.calls.reset();
      isolateScope.remove({tenantId : 1, memberId:1, groupId : 'g2'});
      $timeout.flush();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
    }]));
  });

  describe('reset function', function(){
    it('should exist', inject(function() {
     expect(isolateScope.reset).toBeDefined();
     expect(isolateScope.reset).toEqual(jasmine.any(Function));
    }));

    it('should reset the context', inject(function() {
      isolateScope.reset();
      expect(isolateScope.selectedgroup).toBeUndefined();
      expect(isolateScope.addGroup.name.$touched).toBeFalsy();
      expect(isolateScope.newGroupUser.groupId).toBeNull();
      expect(isolateScope.newGroupUser.userId).toEqual(1);
      expect(isolateScope.saving).toBeFalsy();
     }));
  });

  describe('save function', function(){
    beforeEach(function(){
      isolateScope.newGroupUser = {$save : function(){}};
    });

    it('should exist', inject(function() {
     expect(isolateScope.save).toBeDefined();
     expect(isolateScope.save).toEqual(jasmine.any(Function));
    }));

    it('should set the saving flag to true', inject(function() {
      isolateScope.saveUserGroup = function(){};
      isolateScope.selectedGroup = {id : 'g1'};
      isolateScope.save();
      expect(isolateScope.saving).toBeTruthy();
     }));

    it('should call creategroup if the user entered a new one', inject(function() {
      isolateScope.saveUserGroup = function(){};
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/groups').respond({});
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/groups');
      isolateScope.selectedGroup = {};
      isolateScope.save();
      $httpBackend.flush();
     }));
  });

  describe('saveUserGroup function', function(){
    beforeEach(function(){
      isolateScope.newGroupUser = {id : 'newthing', $save : function(success){success();}};
      isolateScope.selectedGroup = {id : 'newgroup'};
    });

    it('should exist', inject(function() {
     expect(isolateScope.saveUserGroup).toBeDefined();
     expect(isolateScope.saveUserGroup).toEqual(jasmine.any(Function));
    }));

    it('should call save on newUserGroup', inject(function() {
      spyOn(isolateScope.newGroupUser, '$save');
      isolateScope.saveUserGroup();
      expect(isolateScope.newGroupUser.$save).toHaveBeenCalled();
     }));

    it('should call updateFiltered on success', inject(function() {
      spyOn(isolateScope, 'updateFiltered');
      isolateScope.saveUserGroup();
      expect(isolateScope.updateFiltered).toHaveBeenCalled();
     }));

    it('should call reset on success', inject(function() {
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserGroup();
      expect(isolateScope.reset).toHaveBeenCalled();
     }));

    it('should not reset on failure', inject(function() {
      isolateScope.newGroupUser.$save = function(success, failure){failure();};
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserGroup();
      expect(isolateScope.reset).not.toHaveBeenCalled();
     }));

    it('should set saving to false on failure', inject(function() {
      isolateScope.newGroupUser.$save = function(success, failure){failure();};
      spyOn(isolateScope, 'reset');
      isolateScope.saveUserGroup();
      expect(isolateScope.saving).toBeFalsy();
     }));
  });

  describe('updateCollapseState function', function(){
    it('should exist', inject(function() {
     expect(isolateScope.updateCollapseState).toBeDefined();
     expect(isolateScope.updateCollapseState).toEqual(jasmine.any(Function));
    }));

    it('should be called on the resizehandle:resize event', inject(function() {
      isolateScope.updateCollapseState.calls.reset();
      $scope.$broadcast('resizehandle:resize');
      isolateScope.$digest();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
     }));
  });

  describe('createGroup function', function(){
    it('should exist', inject(function() {
     expect(isolateScope.createGroup).toBeDefined();
     expect(isolateScope.createGroup).toEqual(jasmine.any(Function));
    }));

    it('should make call to create a group', inject(function() {
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/groups').respond({});
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/groups');
      isolateScope.createGroup('groupname');
      $httpBackend.flush();
     }));

    it('should call success callback on success', inject(function() {
      var successSpy = jasmine.createSpy('success');
      var failSpy = jasmine.createSpy('fail');
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/groups').respond({});
      isolateScope.createGroup('groupname', successSpy, failSpy);
      $httpBackend.flush();
      expect(successSpy).toHaveBeenCalled();
     }));

    it('should call fail callback on success', inject(function() {
      var successSpy = jasmine.createSpy('success');
      var failSpy = jasmine.createSpy('fail');
      $httpBackend.when('POST', apiHostname + '/v1/tenants/1/groups').respond(500);
      isolateScope.createGroup('groupname', successSpy, failSpy);
      $httpBackend.flush();
      expect(failSpy).toHaveBeenCalled();
     }));
  });
});
