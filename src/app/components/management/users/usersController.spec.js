'use strict';

describe('users controller', function() {
  var $scope,
    $httpBackend,
    Session,
    controller,
    apiHostname,
    User,
    TenantUser,
    mockUsers,
    mockTenantUsers,
    $q,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.skill.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.role.mock'));

  beforeEach(module(function($provide) {
    $provide.value('tenantUserTransformer', {
      transform: jasmine.createSpy('transform')
    });
  }));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'User', 'TenantUser', 'mockTenantUsers', '$q', 'loEvents',
    function($compile, $rootScope, _$httpBackend, $controller, _apiHostname, _mockUsers, _Session, _User, _TenantUser, _mockTenantUsers, _$q, _loEvents) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockUsers = _mockUsers;
      mockTenantUsers = _mockTenantUsers;
      apiHostname = _apiHostname;
      Session = _Session;
      User = _User;
      TenantUser = _TenantUser;
      $q = _$q;
      loEvents = _loEvents;

      controller = $controller('UsersController', {
        '$scope': $scope
      });
    }
  ]));

  it('should catch the on:click:create event', function() {
    $scope.$broadcast(loEvents.tableControls.itemCreate);
    expect($scope.selectedTenantUser).toBeDefined();
    expect($scope.selectedTenantUser.isNew()).toBeTruthy();

    expect($scope.selectedTenantUser.$user).toBeDefined();
    expect($scope.selectedTenantUser.$user.isNew()).toBeTruthy();
    expect($scope.selectedTenantUser.status).toEqual('accepted');
  });

  describe('ON $scope.scenario', function() {
    it('should return undefined when $scope.selectedTenantUser is undefined', function() {
      expect($scope.selectedTenantUser).not.toBeDefined();

      var scenario = $scope.scenario();

      expect(scenario).not.toBeDefined();
    });

    it('should return \'invite:new:user\' when $scope.selectedTenantUser isNew and $user isNew', function() {
      $scope.create();

      var scenario = $scope.scenario();

      expect(scenario).toEqual('invite:new:user');
    });

    it('should return \'invite:existing:user\' when $scope.selectedTenantUser isNew and $user is existing', function() {
      $scope.selectedTenantUser = {
        isNew: jasmine.createSpy('$scope.selectedTenantUser.isNew()').and.returnValue(true),
        $user: mockUsers[0]
      };

      var scenario = $scope.scenario();

      expect(scenario).toEqual('invite:existing:user');
    });

    it('should return \'invite:existing:user\' when $scope.selectedTenantUser isNew and $user is existing', function() {
      $scope.selectedTenantUser = {
        isNew: jasmine.createSpy('$scope.selectedTenantUser.isNew()').and.returnValue(false),
        $user: mockUsers[0]
      };

      var scenario = $scope.scenario();

      expect(scenario).toEqual('update');
    });

    it('should do nothing if selectedTenantUser is undefined', function() {
      var scenario = $scope.scenario();

      expect(scenario).not.toBeDefined();
    });
  });

  describe('ON fetchTenantUsers', function() {
    it('should be defined', function() {
      expect($scope.fetchTenantUsers).toBeDefined();
    });

    it('should return tenant users', inject(function() {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/users');

      var users = $scope.fetchTenantUsers();

      $httpBackend.flush();

      expect(users).toBeDefined();
      expect(users.length).toEqual(2);
    }));
  });

  describe('ON fetchTenantRoles', function() {
    it('should be defined', function() {
      expect($scope.fetchTenantRoles).toBeDefined();
    });

    it('should return tenant roles', function() {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/roles');

      var roles = $scope.fetchTenantRoles();

      $httpBackend.flush();

      expect(roles).toBeDefined();
      expect(roles.length).toEqual(2);
    });
  });

  describe('ON create', function() {
    it('should be defined', function() {
      expect($scope.create).toBeDefined();
    });

    it('should set $scope.selectedTenantUser to new TenantUser with new User as $user',
      inject(function() {
        expect($scope.selectedTenantUser).not.toBeDefined();

        $scope.create();

        expect($scope.selectedTenantUser).toBeDefined();
        expect($scope.selectedTenantUser.$user).toBeDefined();
      }));
  });

  describe('ON submit', function() {
    beforeEach(function() {
      $scope.forms = {};

      $scope.selectedTenantUser = mockTenantUsers[0];
      $scope.selectedTenantUser.$user = mockUsers[0];

      //TODO use $httpBackend or something so the promise resolves
      $scope.selectedTenantUser.save = jasmine.createSpy('save').and.returnValue({
        then: jasmine.createSpy('then')
      });
      $scope.selectedTenantUser.$user.save = jasmine.createSpy('$user.save').and.returnValue($q.when());
    });

    it('should be defined', function() {
      expect($scope.submit).toBeDefined();
    });

    describe('WHEN tenantUser stuff is dirty', function() {
      beforeEach(function() {
        $scope.forms.detailsForm = {
          status: {
            $dirty: false
          },
          roleId: {
            $dirty: true
          },
          firstName: {
            $dirty: false
          },
          lastName: {
            $dirty: false
          }
        };
      });

      describe('WHEN permissions are sufficient', function() {
        beforeEach(inject(function(UserPermissions) {
          // $scope.selectedTenantUser = mockTenantUsers[3];
          UserPermissions.hasPermissionInList = jasmine.createSpy().and.returnValue(true);
          UserPermissions.hasPermission = jasmine.createSpy().and.returnValue(true);
        }));

        it('should PUT to /tenants/users', function() {
          $scope.submit();
          $scope.$digest();

          expect($scope.selectedTenantUser.save).toHaveBeenCalled();
        });
      });

      describe('WHEN permissions are insufficient', function() {
        beforeEach(inject(function(UserPermissions) {
          UserPermissions.hasPermissionInList = jasmine.createSpy().and.returnValue(false);
          UserPermissions.hasPermission = jasmine.createSpy().and.returnValue(false);
        }));

        it('should not call selectedTenantUser.save', function() {
          $scope.submit();

          expect($scope.selectedTenantUser.save).not.toHaveBeenCalled();
        });
      });
    });

    describe('WHEN user stuff is dirty', function() {
      beforeEach(function() {
        $scope.forms.detailsForm = {
          status: {
            $dirty: false
          },
          roleId: {
            $dirty: false
          },
          firstName: {
            $dirty: false
          },
          lastName: {
            $dirty: true
          }
        };
      });

      describe('WHEN permissions are sufficient', function() {
        beforeEach(inject(function(UserPermissions) {
          UserPermissions.hasPermissionInList = jasmine.createSpy().and.returnValue(true);
          UserPermissions.hasPermission = jasmine.createSpy().and.returnValue(true);
        }));

        it('should PUT to /tenants/users', function() {
          $scope.submit();

          expect($scope.selectedTenantUser.$user.save).toHaveBeenCalled();
          expect($scope.selectedTenantUser.$user.email).toEqual($scope.selectedTenantUser.email);
        });
      });

      describe('WHEN permissions are insufficient', function() {
        beforeEach(inject(function(UserPermissions) {
          UserPermissions.hasPermissionInList = jasmine.createSpy().and.returnValue(false);
          UserPermissions.hasPermission = jasmine.createSpy().and.returnValue(false);
        }));

        it('should PUT to /tenants/users', function() {
          $scope.submit();

          expect($scope.selectedTenantUser.$user.save).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('expireTenantUser function', function() {
    it('should show a confirm modal', inject(function(Modal) {
      spyOn(Modal, 'showConfirm');
      $scope.expireTenantUser();
      expect(Modal.showConfirm).toHaveBeenCalled();
    }));

    it('should set the user status to pending', inject(function(Modal) {
      $scope.selectedTenantUser = mockTenantUsers[4];
      $scope.selectedTenantUser.$user = {
        status: 'pending'
      };
      expect($scope.selectedTenantUser.status).toEqual('accepted');

      $httpBackend.whenPUT(apiHostname + '/v1/tenants/tenant-id/users/userId100', function() {
        var data = JSON.parse(requestBody);
        return data.status === 'pending';
      }).respond(200);

      spyOn(Modal, 'showConfirm').and.callFake(function(config) {
        config.okCallback();
      });

      $scope.expireTenantUser();
      $httpBackend.flush();
      expect($scope.selectedTenantUser.$user.status).toEqual('pending');
    }));
  });

  describe('isValid function', function() {
    it('should return true if no form errors', function() {
      $scope.forms = {
          detailsForm: {
            $error: {}
          }
      };

      var result = $scope.isValid();
      expect(result).toBeTruthy();
    });

    it('should return true if the only error is "duplicateEmail"', function() {
      $scope.forms = {
          detailsForm: {
            $error: {duplicateEmail: 'You have a duplicate email'}
          }
      };

      var result = $scope.isValid();
      expect(result).toBeTruthy();
    });

    it('should return true if the error is an extension error', function() {
      $scope.forms = {
          detailsForm: {}
      };

      var result;
      var extensionFields = [
         'extensions',
         'activeExtension',
         'type',
         'provider',
         'telValue',
         'phoneExtension',
         'extensiondescription'
     ];

      for (var i = 0; i < extensionFields.length; i++){
        $scope.forms.detailsForm.$error = {api: [{
          $name: extensionFields[i],
          $valid: false
        }]};

        result = $scope.isValid();
        expect(result).toBeTruthy();
      }
    });

    it('should return false if the only error is a valid error', function() {
      $scope.forms = {
          detailsForm: {
            $error: {name: 'Please enter a name'}
          }
      };

      var result = $scope.isValid();
      expect(result).toBeFalsy();
    });
  });

  describe('namesRequired function', function() {
    it('should return false if selectedTenantUser is not present', function() {
      $scope.selectedTenantUser = null;

      var result = $scope.namesRequired();
      expect(result).toBeFalsy();
    });

    it('should return true if updating an existing user', function() {
      spyOn($scope, 'scenario').and.returnValue('update');
      $scope.selectedTenantUser = new TenantUser();
      $scope.selectedTenantUser.$user = {
        status: 'accepted'
      };

      var result = $scope.namesRequired();
      expect(result).toBeTruthy();
    });

    it('should return true if updating a disabled user', function() {
      spyOn($scope, 'scenario').and.returnValue('update');
      $scope.selectedTenantUser = new TenantUser();
      $scope.selectedTenantUser.$user = {
        status: 'disabled'
      };

      var result = $scope.namesRequired();
      expect(result).toBeTruthy();
    });

    it('should return false if updating a new user', function() {
      spyOn($scope, 'scenario').and.returnValue('update');
      $scope.selectedTenantUser = new TenantUser();
      $scope.selectedTenantUser.$user = {
        status: 'pending'
      };

      var result = $scope.namesRequired();
      expect(result).toBeTruthy();
    });

    it('should return false if creating a new user', function() {
      spyOn($scope, 'scenario').and.returnValue('invite:new:user');

      var result = $scope.namesRequired();
      expect(result).toBeFalsy();
    });
  });

  describe('resend function', function() {
    it('should update the tenantuser record', inject(function(Session) {
      $scope.selectedTenantUser = new TenantUser({
        id: '1234'
      });

      $httpBackend.whenPUT(apiHostname + '/v1/tenants/myTenant/users/1234', function(requestBody) {
        var data = JSON.parse(requestBody);
        return data.status === 'accepted';
      }).respond(200);

      Session.tenant = {
          tenantId: 'myTenant'
      };

      $scope.resend();
      $httpBackend.flush();
    }));
  });

  describe('updateStatus function', function() {
    it('should save the user', function() {
      $scope.selectedTenantUser = new TenantUser({
        tenantId: 'myTenant',
        status: 'accepted',
        id: '1234'
      });
      $scope.selectedTenantUser.$original = $scope.selectedTenantUser;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/users/1234').respond(200);
      $scope.updateStatus();

      $httpBackend.flush();
    });

    it('should toggle the status property to accepted when it is disabled', function() {
      $scope.selectedTenantUser = new TenantUser({
        tenantId: 'myTenant',
        status: 'disabled',
        id: '1234'
      });
      $scope.selectedTenantUser.$original = $scope.selectedTenantUser;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/users/1234', {
        status: 'accepted'
      }).respond(200);
      $scope.updateStatus();

      $httpBackend.flush();
    });

    it('should toggle the status property to disabled when it is accepted', function() {
      $scope.selectedTenantUser = new TenantUser({
        tenantId: 'myTenant',
        status: 'accepted',
        id: '1234'
      });
      $scope.selectedTenantUser.$original = $scope.selectedTenantUser;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/users/1234', {
        status: 'disabled'
      }).respond(200);
      $scope.updateStatus();

      $httpBackend.flush();
    });

    it('should update only the status', function() {
      $scope.selectedTenantUser = new TenantUser({
        tenantId: 'myTenant',
        status: 'disabled',
        id: '1234',
        anotherProperty: 'somevalue'
      });

      $scope.selectedTenantUser.$original = $scope.selectedTenantUser;
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/users/1234', {
        status: 'accepted'
      }).respond(200);
      $scope.updateStatus();

      $httpBackend.flush();
    });

    it('should update the $original value on success', function() {
      $scope.selectedTenantUser = new TenantUser({
        tenantId: 'myTenant',
        status: 'disabled',
        id: '1234'
      });

      $scope.selectedTenantUser.$original = angular.copy($scope.selectedTenantUser);
      expect($scope.selectedTenantUser.$original.status).toEqual('disabled');

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/users/1234').respond(200, {
        result: {
          tenantId: 'myTenant',
          status: 'accepted',
          id: '1234'
        }
      });

      $scope.updateStatus();

      $httpBackend.flush();

      expect($scope.selectedTenantUser.$original.status).toEqual('accepted');
    });

    it('should do nothing if the status is pending', inject(function($http) {
      $scope.selectedTenantUser = new TenantUser({
        status: 'pending'
      });

      spyOn($http, 'put');
      $scope.updateStatus();

      expect($http.put).not.toHaveBeenCalled();
    }));
  });
});
