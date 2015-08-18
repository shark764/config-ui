'use strict';

describe('usersDetailPanel controller', function () {
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

      controller = $controller('UserDetailPanelController', {
        '$scope': $scope
      });
    }
  ]));

  describe('ON $scope.scenario', function () {
    it('should return undefined when $scope.selectedTenantUser is undefined', function () {
      expect($scope.selectedTenantUser).not.toBeDefined();

      var scenario = $scope.scenario();

      expect(scenario).not.toBeDefined();
    });

    it('should return \'invite:new:user\' when $scope.selectedTenantUser isNew and $user isNew', function () {
      $scope.selectedTenantUser = new TenantUser();
      $scope.selectedTenantUser.$user = new User();

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
  });

  describe('ON fetchTenantUsers', function () {
    it('should be defined', function () {
      expect($scope.fetchTenantUsers).toBeDefined();
    });

    it('should return tenant userStatuses', inject(function () {
      var users = $scope.fetchTenantUsers();

      $httpBackend.flush();

      expect(users).toBeDefined();
      expect(users.length).toEqual(3);
    }));
  });

  describe('ON submit', function () {
    beforeEach(function () {
      controller.updateTenantUser = jasmine.createSpy('controller.updateTenantUser');
      controller.saveNewUserTenantUser = jasmine.createSpy('controller.saveNewUserTenantUser');
      controller.updateUser = jasmine.createSpy('controller.updateUser');
    });

    it('should be defined', function () {
      expect($scope.submit).toBeDefined();
    });

    it('should call controller.saveNewUserTenantUser WHEN $scope.selectedTenantUser isNew AND $scope.selectedTenantUser.$user.isNew',
      inject(function () {
        $scope.selectedTenantUser = new TenantUser();
        $scope.selectedTenantUser.$user = new User();
        
        $scope.submit();

        expect(controller.saveNewUserTenantUser).toHaveBeenCalled();
        expect(controller.updateTenantUser).not.toHaveBeenCalled();
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
        expect(controller.updateTenantUser).toHaveBeenCalled();
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
        expect(controller.updateTenantUser).not.toHaveBeenCalled();
        expect(controller.updateUser).toHaveBeenCalled();
      }));
  });

  describe('ON controller.updateTenantUser', function () {
    beforeEach(inject([function () {
        $scope.selectedTenantUser = new TenantUser({
          email: mockUsers[0].email
        });
        $scope.selectedTenantUser.$user = mockUsers[0];
      }
    ]));
    
    it('should attempt to save the tenantUser', function() {
      var result = new TenantUser({
        userId: mockUsers[0].id
      });
      
      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/users').respond(result);
      
      controller.updateTenantUser();
      
      $httpBackend.flush();
    });
  });
});