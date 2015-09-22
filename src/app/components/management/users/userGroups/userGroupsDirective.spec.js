'use strict';

describe('userGroups directive', function() {
  var $scope,
    $httpBackend,
    $compile,
    element,
    isolateScope,
    apiHostname,
    mockGroups,
    mockUserGroups,
    Session,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users.groups'));
  
  var doDefaultCompile = function(){
    //Mock the group services
    element = $compile('<user-groups user="user"></user-groups>')($scope);
    $scope.$digest();
    $httpBackend.flush();

    isolateScope = element.isolateScope();
    spyOn(isolateScope, 'updateCollapseState'); //Stub this out so we dont trigger digests in the tests
  };
  
  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname', 'mockTenantUsers', 'mockGroups', 'mockUserGroups', 'Session',
    function(_$compile, _$rootScope_, _$httpBackend_, _apiHostname_, _mockTenantUsers, _mockGroups, _mockUserGroups, _Session_) {
      $compile = _$compile;
      $scope = _$rootScope_.$new();
      $httpBackend = _$httpBackend_;
      apiHostname = _apiHostname_;
      mockGroups = _mockGroups;
      mockUserGroups = _mockUserGroups;
      mockTenantUsers = _mockTenantUsers;
      Session = _Session_;
    }
  ]));
  
  beforeEach(function() {
    $scope.user = mockTenantUsers[1];
    $scope.user.$original = angular.copy(mockTenantUsers[1]);
  });
  
  describe('USING defaultCompile', function() {
    beforeEach(function() {
      doDefaultCompile();
    });
    
    describe('ON fetchGroups', function() {
      it('should be defined', function() {
        expect(isolateScope.fetchGroups).toBeDefined();
      });
      
      it('should return groups on call', function() {
        var groups = isolateScope.fetchGroups();
        
        expect(groups).toBeDefined();
        expect(groups.length).toEqual(3);
      });
    });
    
    it('should have userGroups defined', inject(function() {
      expect(isolateScope.userGroups).toBeDefined();
    }));

    it('should load the user\'s groups', inject(function() {
      expect(isolateScope.userGroups.length).toEqual(1);
      expect(isolateScope.userGroups[0].userId).toEqual(mockUserGroups[0].userId);
      expect(isolateScope.userGroups[0].groupId).toEqual(mockUserGroups[0].groupId);
    }));
    
    describe('fetch function', function() {
      it('should be called when user changes', inject(['User', function(User) {
        spyOn(isolateScope, 'fetch');
        $scope.user = new User({
          id: 2
        });
        $scope.$digest();
        expect(isolateScope.fetch).toHaveBeenCalled();
      }]));

      it('should do nothing if there is no tenant selected', inject(function(Session) {
        Session.tenant = {};
        isolateScope.fetch();
        expect($scope.groups).not.toBeDefined();
        expect($scope.userGroups).not.toBeDefined();
      }));

      it('should update filtered', inject(function() {
        isolateScope.filtered = [];
        isolateScope.fetch();
        $httpBackend.flush();
        expect(isolateScope.filtered.length).toEqual(2);
      }));

      it('should call updatecollapsestate', inject(['$timeout', function($timeout) {
        isolateScope.fetch();
        $timeout.flush();
        expect(isolateScope.updateCollapseState).toHaveBeenCalled();
      }]));
    });
    
    describe('remove function', function() {
      it('should call TenantUserGroup delete', inject(function() {
        isolateScope.remove({
          tenantId: 'tenant-id',
          memberId: 'userId1',
          groupId: 'groupId1'
        });
        $httpBackend.flush();
      }));

      it('should call updatecollapsestate', inject(['$timeout', function($timeout) {
        isolateScope.updateCollapseState.calls.reset();
        isolateScope.remove({
          tenantId: 'tenant-id',
          memberId: 'userId1',
          groupId: 'groupId1'
        });
        $timeout.flush();
        expect(isolateScope.updateCollapseState).toHaveBeenCalled();
      }]));

      it('should remove the item from userGroups list', inject(function() {
        isolateScope.updateFiltered();
        expect(isolateScope.userGroups.length).toBe(1);
        isolateScope.remove(isolateScope.userGroups[0]);
        $httpBackend.flush();
        expect(isolateScope.userGroups.length).toBe(0);
      }));

      it('should add the removed group to the filtered list', inject(function() {
        isolateScope.updateFiltered();
        expect(isolateScope.filtered.length).toBe(2);
        isolateScope.remove(isolateScope.userGroups[0]);
        $httpBackend.flush();
        expect(isolateScope.filtered.length).toBe(3);
      }));
    });
    
    describe('reset function', function() {
      it('should exist', inject(function() {
        expect(isolateScope.reset).toBeDefined();
        expect(isolateScope.reset).toEqual(jasmine.any(Function));
      }));

      it('should reset the context', inject(function() {
        isolateScope.addGroup.name = {
          $setUntouched : jasmine.createSpy('$setUntouched'),
          $setPristine : jasmine.createSpy('$setPristine')
        };

        isolateScope.reset();
        expect(isolateScope.selectedgroup).toBeUndefined();
        expect(isolateScope.addGroup.name.$setUntouched).toHaveBeenCalled();
        expect(isolateScope.newGroupUser.groupId).toBeNull();
        expect(isolateScope.newGroupUser.userId).toEqual('userId2');
        expect(isolateScope.saving).toBeFalsy();
      }));
    });
    
    describe('save function', function() {
      beforeEach(function() {
        isolateScope.newGroupUser = {
          $save: function() {}
        };
      });

      it('should exist', inject(function() {
        expect(isolateScope.save).toBeDefined();
        expect(isolateScope.save).toEqual(jasmine.any(Function));
      }));

      it('should not save if no group is selected', inject(function() {
        expect(isolateScope.save).toBeDefined();
        $scope.selectedGroup = null;
        isolateScope.save();
      }));

      it('should set the saving flag to true', inject(function() {
        isolateScope.saveUserGroup = function() {};
        isolateScope.selectedGroup = {
          id: 'g1'
        };
        isolateScope.save();
        expect(isolateScope.saving).toBeTruthy();
      }));

      it('should call creategroup if the user entered a new one', inject(function() {
        spyOn(isolateScope, 'saveUserGroup');
        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups');
        isolateScope.selectedGroup = {
          tenantId: 'tenant-id'
        };
        isolateScope.save();
        $httpBackend.flush();
      }));
      
      it('should alert if creating a group failed', inject(['Alert', function(Alert) {
        spyOn(Alert, 'error');
        spyOn(isolateScope, 'createGroup').and.callFake(function(name, success, fail){
          fail();
        });
        
        isolateScope.selectedGroup = {name: 'a group'};
        isolateScope.save();
        expect(Alert.error).toHaveBeenCalled();
      }]));
    });
    
    describe('createGroup function', function() {
      it('should exist', inject(function() {
        expect(isolateScope.createGroup).toBeDefined();
        expect(isolateScope.createGroup).toEqual(jasmine.any(Function));
      }));

      it('should make call to create a group', inject(function() {
        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups');
        isolateScope.createGroup('groupname');
        $httpBackend.flush();

        expect(isolateScope.selectedGroup.id).toEqual('groupId100');
      }));

      it('should call success callback on success', inject(function() {
        var successSpy = jasmine.createSpy('success');
        var failSpy = jasmine.createSpy('fail');
        isolateScope.createGroup('groupname', successSpy, failSpy);
        $httpBackend.flush();
        expect(successSpy).toHaveBeenCalled();
      }));

      it('should call fail callback on success', inject(function() {
        var successSpy = jasmine.createSpy('success');
        var failSpy = jasmine.createSpy('fail');
        Session.tenant.tenantId = '2';
        $httpBackend.when('POST', apiHostname + '/v1/tenants/2/groups').respond(500);
        isolateScope.createGroup('groupname', successSpy, failSpy);
        $httpBackend.flush();
        expect(failSpy).toHaveBeenCalled();
        expect(successSpy).not.toHaveBeenCalled();
      }));
    });
    
    describe('saveUserGroup function', function() {
      beforeEach(function() {
        isolateScope.newGroupUser = {
          id: 'newthing',
          $save: function(success) {
            success();
          }
        };
        isolateScope.selectedGroup = {
          id: 'newgroup'
        };
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
      
      it('should add the group to the user object on success', inject(function() {
        expect(isolateScope.user.groups.length).toBe(0);
        isolateScope.saveUserGroup();
        expect(isolateScope.user.groups.length).toBe(1);
      }));

      it('should not reset on failure', inject(function() {
        isolateScope.newGroupUser.$save = function(success, failure) {
          failure();
        };
        spyOn(isolateScope, 'reset');
        isolateScope.saveUserGroup();
        expect(isolateScope.reset).not.toHaveBeenCalled();
      }));

      it('should set saving to false on failure', inject(function() {
        isolateScope.newGroupUser.$save = function(success, failure) {
          failure();
        };
        spyOn(isolateScope, 'reset');
        isolateScope.saveUserGroup();
        expect(isolateScope.saving).toBeFalsy();
      }));
    });
  });

  describe('updateCollapseState function', function() {
    it('should be called on the resizehandle:resize event', inject(function() {
      doDefaultCompile();
      
      isolateScope.updateCollapseState.calls.reset();
      $scope.$broadcast('resizehandle:resize');
      isolateScope.$digest();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
    }));
    
    it('should set hideCollapseControls true if wrapperHeight is between 0 and 94', inject(function() {
      element = $compile('<user-groups user="user"></user-groups>')($scope);
      $scope.$digest();
      $httpBackend.flush();
      isolateScope = element.isolateScope();
      
      isolateScope.updateCollapseState(1);
      isolateScope.$digest();
      expect(isolateScope.hideCollapseControls).toBeTruthy();
      
      isolateScope.updateCollapseState(93);
      isolateScope.$digest();
      expect(isolateScope.hideCollapseControls).toBeTruthy();
    }));
    
    it('should set hideCollapseControls false if wrapperHeight is 0 or less', inject(function() {
      element = $compile('<user-groups user="user"></user-groups>')($scope);
      $scope.$digest();
      $httpBackend.flush();
      isolateScope = element.isolateScope();
      
      isolateScope.updateCollapseState(0);
      isolateScope.$digest();
      expect(isolateScope.hideCollapseControls).toBeFalsy();
      
      isolateScope.updateCollapseState(-1);
      isolateScope.$digest();
      expect(isolateScope.hideCollapseControls).toBeFalsy();
    }));
    
    it('should set hideCollapseControls false if wrapperHeight is 94 or greater', inject(function() {
      element = $compile('<user-groups user="user"></user-groups>')($scope);
      $scope.$digest();
      $httpBackend.flush();
      isolateScope = element.isolateScope();
      
      isolateScope.updateCollapseState(94);
      isolateScope.$digest();
      expect(isolateScope.hideCollapseControls).toBeFalsy();
      
      isolateScope.updateCollapseState(10000);
      isolateScope.$digest();
      expect(isolateScope.hideCollapseControls).toBeFalsy();
    }));
  });
});
