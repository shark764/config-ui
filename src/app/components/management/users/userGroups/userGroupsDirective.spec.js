'use strict';

describe('userGroups directive', function () {
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

  beforeEach(module('gulpAngular', 'liveopsConfigPanel', 'liveopsConfigPanel.tenant.user.mock', 
      'liveopsConfigPanel.tenant.group.mock', 'liveopsConfigPanel.tenant.user.group.mock', 'liveopsConfigPanel.mockutils'));

  var doDefaultCompile = function () {
    //Mock the group services
    element = $compile('<user-groups user="user"></user-groups>')($scope);
    $scope.$digest();
    $httpBackend.flush();

    isolateScope = element.isolateScope();
    spyOn(isolateScope, 'updateCollapseState'); //Stub this out so we dont trigger digests in the tests
  };

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname', 'mockTenantUsers', 'mockGroups', 'mockUserGroups', 'Session',
    function (_$compile, _$rootScope_, _$httpBackend_, _apiHostname_, _mockTenantUsers, _mockGroups, _mockUserGroups, _Session_) {
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

  beforeEach(inject(['tenantUserTransformer', function (tenantUserTransformer) {
    tenantUserTransformer.transform(mockTenantUsers[1]);
    $scope.user = mockTenantUsers[1];
    $scope.user.$original = angular.copy(mockTenantUsers[1]);
  }]));

  describe('USING defaultCompile', function () {
    beforeEach(function () {
      doDefaultCompile();
    });

    describe('ON fetchGroups', function () {
      it('should be defined', function () {
        expect(isolateScope.fetchGroups).toBeDefined();
      });

      it('should return groups on call', function () {
        var groups = isolateScope.fetchGroups();

        expect(groups).toBeDefined();
        expect(groups.length).toEqual(3);
      });
    });

    it('should have userGroups defined', inject(function () {
      expect(isolateScope.userGroups).toBeDefined();
    }));

    it('should load the user\'s groups', inject(function () {
      expect(isolateScope.userGroups.length).toEqual(1);
      expect(isolateScope.userGroups[0].userId).toEqual(mockUserGroups[0].userId);
      expect(isolateScope.userGroups[0].groupId).toEqual(mockUserGroups[0].groupId);
    }));

    describe('fetch function', function () {
      it('should be called when user changes', inject(['User', function (User) {
        spyOn(isolateScope, 'fetch');
        $scope.user = new User({
          id: 2
        });
        $scope.$digest();
        expect(isolateScope.fetch).toHaveBeenCalled();
      }]));

      it('should do nothing if there is no tenant selected', inject(function (Session) {
        Session.tenant = {};
        isolateScope.fetch();
        expect($scope.groups).not.toBeDefined();
        expect($scope.userGroups).not.toBeDefined();
      }));

      it('should call updatecollapsestate', inject(['$timeout', function ($timeout) {
        isolateScope.fetch();
        $timeout.flush();
        expect(isolateScope.updateCollapseState).toHaveBeenCalled();
      }]));
    });

    describe('remove function', function () {
      it('should call TenantUserGroup delete', inject(function () {
        isolateScope.remove({
          tenantId: 'tenant-id',
          memberId: 'userId1',
          groupId: 'groupId1'
        });
        $httpBackend.flush();
      }));

      it('should call updatecollapsestate', inject(['$timeout', function ($timeout) {
        isolateScope.updateCollapseState.calls.reset();
        isolateScope.remove({
          tenantId: 'tenant-id',
          memberId: 'userId1',
          groupId: 'groupId1'
        });
        $timeout.flush();
        expect(isolateScope.updateCollapseState).toHaveBeenCalled();
      }]));

      it('should remove the item from userGroups list', inject(function () {
        expect(isolateScope.userGroups.length).toBe(1);
        isolateScope.remove(isolateScope.userGroups[0]);
        $httpBackend.flush();
        expect(isolateScope.userGroups.length).toBe(0);
      }));
    });

    describe('reset function', function () {
      it('should exist', inject(function () {
        expect(isolateScope.reset).toBeDefined();
        expect(isolateScope.reset).toEqual(jasmine.any(Function));
      }));

      it('should reset the context', inject(function (mockModel) {
        isolateScope.addGroup.name = mockModel();

        isolateScope.reset();
        expect(isolateScope.selectedgroup).toBeUndefined();
        expect(isolateScope.addGroup.name.$setUntouched).toHaveBeenCalled();
        expect(isolateScope.newGroupUser.groupId).toBeNull();
        expect(isolateScope.newGroupUser.userId).toEqual('userId2');
        expect(isolateScope.saving).toBeFalsy();
      }));
    });

    describe('save function', function () {
      beforeEach(function () {
        isolateScope.newGroupUser = {
          $save: function () {}
        };
      });

      it('should exist', inject(function () {
        expect(isolateScope.save).toBeDefined();
        expect(isolateScope.save).toEqual(jasmine.any(Function));
      }));

      it('should not save if no group is selected', inject(function () {
        expect(isolateScope.save).toBeDefined();
        isolateScope.save(null);
      }));

      it('should set the saving flag to true', inject(function () {
        isolateScope.saveUserGroup = function () {};
        isolateScope.selectedGroup = {
          id: 'g1'
        };
        isolateScope.save();
        expect(isolateScope.saving).toBeTruthy();
      }));

      it('should call add a new group is given a string', inject(function () {
        spyOn(isolateScope, 'saveUserGroup');
        $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/groups');
        isolateScope.save('new-group');
        $httpBackend.flush();
      }));
    });

    describe('saveUserGroup function', function () {
      var saveSpy;
      beforeEach(inject(['$q', function ($q) {
        saveSpy = jasmine.createSpy('$save').and.callFake(function(success) {
          return $q.when(success());
        });

        isolateScope.newGroupUser = {
          id: 'newthing',
          $save: saveSpy
        };
      }]));

      it('should exist', inject(function () {
        expect(isolateScope.saveUserGroup).toBeDefined();
        expect(isolateScope.saveUserGroup).toEqual(jasmine.any(Function));
      }));

      it('should call save on newUserGroup', inject(function () {
        isolateScope.saveUserGroup({
          id: 'newgroup'
        });
        expect(saveSpy).toHaveBeenCalled();
      }));

      it('should call reset on success', inject(function () {
        spyOn(isolateScope, 'reset');
        isolateScope.saveUserGroup({
          id: 'newgroup'
        });
        expect(isolateScope.reset).toHaveBeenCalled();
      }));

      it('should add the group to the user object on success', inject(function () {
        expect(isolateScope.user.$groups.length).toBe(0);
        isolateScope.saveUserGroup({
          id: 'newgroup'
        });
        expect(isolateScope.user.$groups.length).toBe(1);
      }));

      it('should not reset on failure', inject(['$q', function ($q) {
        isolateScope.newGroupUser.$save = jasmine.createSpy('$save').and.callFake(function(success, failure) {
          var deferred = $q.defer();
          deferred.reject(failure());
          return deferred.promise;
        });

        spyOn(isolateScope, 'reset');
        isolateScope.saveUserGroup({
          id: 'newgroup'
        });
        expect(isolateScope.reset).not.toHaveBeenCalled();
      }]));

      it('should set saving to false on failure', inject(['$q', function ($q) {
        isolateScope.newGroupUser.$save = jasmine.createSpy('$save').and.callFake(function(success, failure) {
          var deferred = $q.defer();
          deferred.reject(failure());
          return deferred.promise;
        });

        spyOn(isolateScope, 'reset');
        isolateScope.saveUserGroup({
          id: 'newgroup'
        });
        expect(isolateScope.saving).toBeFalsy();
      }]));
    });
  });

  describe('updateCollapseState function', function () {
    it('should be called on the resizehandle:resize event', inject(function () {
      doDefaultCompile();

      isolateScope.updateCollapseState.calls.reset();
      $scope.$broadcast('resizehandle:resize');
      isolateScope.$digest();
      expect(isolateScope.updateCollapseState).toHaveBeenCalled();
    }));

    it('should set hideCollapseControls true if wrapperHeight is between 0 and 94', inject(function () {
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

    it('should set hideCollapseControls false if wrapperHeight is 0 or less', inject(function () {
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

    it('should set hideCollapseControls false if wrapperHeight is 94 or greater', inject(function () {
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
