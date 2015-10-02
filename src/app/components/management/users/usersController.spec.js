'use strict';

describe('users controller', function () {
  var $scope,
    $httpBackend,
    Session,
    controller,
    apiHostname,
    User,
    TenantUser,
    mockUsers,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.roles'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'User', 'TenantUser', 'mockTenantUsers',
    function ($compile, $rootScope, _$httpBackend, $controller, _apiHostname, _mockUsers, _Session_, _User_, _TenantUser, _mockTenantUsers) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockUsers = _mockUsers;
      mockTenantUsers = _mockTenantUsers;
      apiHostname = _apiHostname;
      Session = _Session_;
      User = _User_;
      TenantUser = _TenantUser;

      controller = $controller('UsersController', {
        '$scope': $scope
      });
    }
  ]));

  it('should catch the on:click:create event', inject([function () {
    $scope.$broadcast('table:on:click:create');
    expect($scope.selectedTenantUser).toBeDefined();
    expect($scope.selectedTenantUser.isNew()).toBeTruthy();

    expect($scope.selectedTenantUser.$user).toBeDefined();
    expect($scope.selectedTenantUser.$user.isNew()).toBeTruthy();
  }]));

  describe('ON $scope.scenario', function () {
    it('should return undefined when $scope.selectedTenantUser is undefined', function () {
      expect($scope.selectedTenantUser).not.toBeDefined();

      var scenario = $scope.scenario();

      expect(scenario).not.toBeDefined();
    });

    it('should return \'invite:new:user\' when $scope.selectedTenantUser isNew and $user isNew', function () {
      $scope.create();

      var scenario = $scope.scenario();

      expect(scenario).toEqual('invite:new:user');
    });

    it('should return \'invite:existing:user\' when $scope.selectedTenantUser isNew and $user is existing', function () {
      $scope.selectedTenantUser = {
        isNew: jasmine.createSpy('$scope.selectedTenantUser.isNew()').and.returnValue(true),
        $user: mockUsers[0]
      };

      var scenario = $scope.scenario();

      expect(scenario).toEqual('invite:existing:user');
    });

    it('should return \'invite:existing:user\' when $scope.selectedTenantUser isNew and $user is existing', function () {
      $scope.selectedTenantUser = {
        isNew: jasmine.createSpy('$scope.selectedTenantUser.isNew()').and.returnValue(false),
        $user: mockUsers[0]
      };

      var scenario = $scope.scenario();

      expect(scenario).toEqual('update');
    });
    
    it('should do nothing if selectedTenantUser is undefined', function () {
      var scenario = $scope.scenario();

      expect(scenario).not.toBeDefined();
    });
  });

  describe('ON fetchTenantUsers', function () {
    it('should be defined', function () {
      expect($scope.fetchTenantUsers).toBeDefined();
    });

    it('should return tenant users', inject(function () {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/users');
      
      var users = $scope.fetchTenantUsers();

      $httpBackend.flush();

      expect(users).toBeDefined();
      expect(users.length).toEqual(2);
    }));
  });
  
  describe('ON fetchTenantRoles', function () {
    it('should be defined', function () {
      expect($scope.fetchTenantRoles).toBeDefined();
    });

    it('should return tenant roles', inject(function () {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/roles');
      
      var roles = $scope.fetchTenantRoles();
      
      $httpBackend.flush();

      expect(roles).toBeDefined();
      expect(roles.length).toEqual(2);
    }));
  });

  describe('ON create', function () {
    it('should be defined', function () {
      expect($scope.create).toBeDefined();
    });

    it('should set $scope.selectedTenantUser to new TenantUser with new User as $user',
      inject(function () {
        expect($scope.selectedTenantUser).not.toBeDefined();

        $scope.create();

        expect($scope.selectedTenantUser).toBeDefined();
        expect($scope.selectedTenantUser.$user).toBeDefined();
      }));
  });

  describe('ON submit', function () {
    beforeEach(function () {
      controller.saveNewTenantUser = jasmine.createSpy('controller.saveNewTenantUser');
      controller.saveNewUserTenantUser = jasmine.createSpy('controller.saveNewUserTenantUser');
      controller.updateUser = jasmine.createSpy('controller.updateUser');
    });

    it('should be defined', function () {
      expect($scope.submit).toBeDefined();
    });

    it('should call controller.saveNewUserTenantUser WHEN $scope.selectedTenantUser isNew AND $scope.selectedTenantUser.$user.isNew',
      inject(function () {
        $scope.create();

        $scope.submit();

        expect(controller.saveNewUserTenantUser).toHaveBeenCalled();
        expect(controller.saveNewTenantUser).not.toHaveBeenCalled();
        expect(controller.updateUser).not.toHaveBeenCalled();
      }));

    it('should call controller.saveNewUserTenantUser WHEN $scope.selectedTenantUser isNew AND $scope.selectedTenantUser.$user exists',
      inject(function () {
        $scope.selectedTenantUser = {
          isNew: jasmine.createSpy('$scope.selectedTenantUser.isNew()').and.returnValue(true),
          $user: mockUsers[0]
        };

        $scope.submit();

        expect(controller.saveNewUserTenantUser).not.toHaveBeenCalled();
        expect(controller.saveNewTenantUser).toHaveBeenCalled();
        expect(controller.updateUser).not.toHaveBeenCalled();
      }));

    it('should call controller.saveNewUserTenantUser WHEN $scope.selectedTenantUser exists AND $scope.selectedTenantUser.$user exists',
      inject(function () {
        $scope.selectedTenantUser = {
          isNew: jasmine.createSpy('$scope.selectedTenantUser.isNew()').and.returnValue(false),
          $user: mockUsers[0]
        };

        $scope.submit();

        expect(controller.saveNewUserTenantUser).not.toHaveBeenCalled();
        expect(controller.saveNewTenantUser).not.toHaveBeenCalled();
        expect(controller.updateUser).toHaveBeenCalled();
      }));
  });

  describe('ON controller.saveNewTenantUser', function () {
    beforeEach(inject([function () {
      $scope.selectedTenantUser = new TenantUser({
        email: mockUsers[0].email
      });
      $scope.selectedTenantUser.$user = mockUsers[0];
    }]));

    it('should attempt to save the tenantUser', function () {
      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/users');

      controller.saveNewTenantUser();

      $httpBackend.flush();
    });

    it('should reset $user', function () {
      controller.saveNewTenantUser();

      $httpBackend.flush();

      expect($scope.selectedTenantUser.$user).toBeDefined();
    });

    it('should GET tenant user once saved', function () {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/users/userId100');

      controller.saveNewTenantUser();

      $httpBackend.flush();
    });

    it('should set up the roleName', inject(['TenantRole', function (TenantRole) {
      controller.saveNewTenantUser();
      spyOn(TenantRole, 'getName');
      
      $httpBackend.flush();

      expect(TenantRole.getName).toHaveBeenCalled();
    }]));

    it('should call reset', function () {
      mockTenantUsers[2].reset = jasmine.createSpy('reset');

      controller.saveNewTenantUser();

      $httpBackend.flush();

      expect(mockTenantUsers[2].reset).toHaveBeenCalled();
    });
  });

  describe('ON controller.saveNewUserTenantUser', function () {
    var $timeout;
    beforeEach(inject(['$timeout', function (_$timeout) {
      $timeout = _$timeout;

      $scope.selectedTenantUser = new TenantUser({
        email: mockUsers[0].email
      });
      $scope.selectedTenantUser.$user = new User({});
    }]));

    it('should attempt to save the user', inject(function (TenantUserGroups) {
      $httpBackend.expect('POST', apiHostname + '/v1/users');
      spyOn(TenantUserGroups, 'query');
      
      controller.saveNewUserTenantUser();

      $httpBackend.flush();
      $timeout.flush();
    }));

    it('should attempt to save the tenantUser', inject(function (TenantUserGroups) {
      spyOn(TenantUserGroups, 'query');
      controller.saveNewUserTenantUser();
      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/users');
      $httpBackend.flush();
    }));
  });
  
  describe('ON controller.updateUser', function () {
    var $timeout;
    beforeEach(inject(['$timeout', function (_$timeout) {
      $timeout = _$timeout;

      $scope.selectedTenantUser = mockTenantUsers[1];
      $scope.selectedTenantUser.$original = mockTenantUsers[1];
      $scope.selectedTenantUser.$user = mockUsers[1];
      
      $scope.forms = {
        detailsForm: {
          roleId: {
            $dirty: false
          }
        }
      };
    }]));
    
    it('should not attempt to save the user if the user doesn\'t have permission', inject(['UserPermissions', function (UserPermissions) {
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(false);
      
      controller.updateUser();
      
      $scope.$digest();
    }]));
    
    it('should attempt to save the current Session.user and setToken', inject(['Session', 'UserPermissions', function (Session, UserPermissions) {
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(true);
      $scope.selectedTenantUser = mockTenantUsers[0];
      $scope.selectedTenantUser.$user = mockUsers[0];
      $scope.selectedTenantUser.$original = mockTenantUsers[0];
      Session.setUser = jasmine.createSpy('setUser');
      Session.setToken = jasmine.createSpy('setToken');
      
      $httpBackend.expect('PUT', apiHostname + '/v1/users/userId1').respond(200);
      
      controller.updateUser();
      
      $scope.$apply();
      $httpBackend.flush();
    }]));

    it('should attempt to save the tenantUser if roleId changed', inject(['UserPermissions', function (UserPermissions) {
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(true);
      $scope.selectedTenantUser = mockTenantUsers[1];
      $scope.selectedTenantUser.$user = mockUsers[1];
      $scope.selectedTenantUser.$original = angular.copy(mockTenantUsers[1]);
      $scope.selectedTenantUser.roleId = 'roleId2';
      
      $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId2').respond(200);
      $httpBackend.expect('PUT', apiHostname + '/v1/users/userId2').respond(200);
      
      controller.updateUser();
      
      $scope.$apply();
      $httpBackend.flush();
    }]));
    
    it('should attempt to save the tenantUser if status changed', inject(['UserPermissions', function (UserPermissions) {
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(true);
      $scope.selectedTenantUser = mockTenantUsers[1];
      $scope.selectedTenantUser.$user = mockUsers[1];
      $scope.selectedTenantUser.$original = angular.copy(mockTenantUsers[1]);
      $scope.selectedTenantUser.status = 'disabled';
      
      $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId2').respond(200);
      $httpBackend.expect('PUT', apiHostname + '/v1/users/userId2').respond(200);
      
      controller.updateUser();
      
      $scope.$apply();
      $httpBackend.flush();
    }]));
    
    it('should not attempt to save the tenantUser if the user doesn\'t have permission', inject(['UserPermissions', function (UserPermissions) {
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(false);
      
      controller.updateUser();
      
      $scope.$digest();
    }]));
  });
  
  describe('ON controller.saveTenantUser', function () {
    var $timeout;
    beforeEach(inject(['$timeout', function (_$timeout) {
      $timeout = _$timeout;

      $scope.selectedTenantUser = mockTenantUsers[0];
      $scope.selectedTenantUser.$user = mockUsers[0];
    }]));

    it('should attempt to save the user and not tenantUser', function () {
      var result = angular.copy(mockTenantUsers[0]);
      result.status = 'invited';
      
      $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId1').respond({
        result: result
      });
      
      $scope.saveTenantUser();
      
      $scope.$apply();
      $httpBackend.flush();
      
      expect($scope.selectedTenantUser.status).toEqual('invited');
    });
    
    it('should call Alert.success on tenantUser.save success', inject(['Alert', function (Alert) {
      Alert.success = jasmine.createSpy('Alert.success');
      
      $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200);
      
      $scope.saveTenantUser();
      
      $scope.$apply();
      $httpBackend.flush();
      
      expect(Alert.success).toHaveBeenCalled();
    }]));
    
    it('should call Alert.failure on tenantUser.save success', inject(['Alert', function (Alert) {
      Alert.failure = jasmine.createSpy('Alert.failure');
      
      $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(400);
      
      $scope.saveTenantUser();
      
      $scope.$apply();
      $httpBackend.flush();
      
      expect(Alert.failure).toHaveBeenCalled();
    }]));
  });
  
  it('should set $scope.selectedTenantUser $on email:validator:found', function() {
    expect($scope.selectedTenantUser).not.toBeDefined();
    
    $scope.$broadcast('email:validator:found', mockTenantUsers[0]);
    
    expect($scope.selectedTenantUser).toBeDefined();
  });
});