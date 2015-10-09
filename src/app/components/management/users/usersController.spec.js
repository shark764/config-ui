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
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.roles'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'User', 'TenantUser', 'mockTenantUsers',
    function($compile, $rootScope, _$httpBackend, $controller, _apiHostname, _mockUsers, _Session_, _User_, _TenantUser, _mockTenantUsers) {
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

  it('should catch the on:click:create event', inject([function() {
    $scope.$broadcast('table:on:click:create');
    expect($scope.selectedTenantUser).toBeDefined();
    expect($scope.selectedTenantUser.isNew()).toBeTruthy();

    expect($scope.selectedTenantUser.$user).toBeDefined();
    expect($scope.selectedTenantUser.$user.isNew()).toBeTruthy();
  }]));

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

    it('should return tenant roles', inject(function() {
      $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id/roles');

      var roles = $scope.fetchTenantRoles();

      $httpBackend.flush();

      expect(roles).toBeDefined();
      expect(roles.length).toEqual(2);
    }));
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
      $scope.forms = {}

      $scope.selectedTenantUser = mockTenantUsers[0];
      $scope.selectedTenantUser.$user = mockUsers[0]

      $scope.selectedTenantUser.save = jasmine.createSpy('save');
      $scope.selectedTenantUser.$user.save = jasmine.createSpy('$user.save');
    });

    it('should be defined', function() {
      expect($scope.submit).toBeDefined();
    });

    describe('WHEN tenantUser stuff is dirty', function() {
      beforeEach(function() {
        $scope.forms.detailsForm = {
          status: {$dirty: false},
          roleId: {$dirty: true},
          firstName: {$dirty: false},
          lastName: {$dirty: false},
          externalId: {$dirty: false}
        }
      });

      it('should PUT to /tenants/users', function() {
        $scope.submit()

        expect($scope.selectedTenantUser.save).toHaveBeenCalled();
        expect($scope.selectedTenantUser.status).not.toBeDefined();
      });
    });

    describe('WHEN user stuff is dirty', function() {
      beforeEach(function() {
        $scope.forms.detailsForm = {
          status: {$dirty: false},
          roleId: {$dirty: false},
          firstName: {$dirty: false},
          lastName: {$dirty: true},
          externalId: {$dirty: false}
        }
      });

      it('should PUT to /tenants/users', function() {
        $scope.submit()

        expect($scope.selectedTenantUser.$user.save).toHaveBeenCalled();
        expect($scope.selectedTenantUser.$user.email).toEqual($scope.selectedTenantUser.email);
      });
    });
  });

});
