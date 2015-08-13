'use strict';

/* global spyOn: false  */

describe('users controller', function () {
  var $scope,
    $httpBackend,
    Session,
    controller,
    apiHostname,
    User,
    mockUsers,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'User', 'mockTenantUsers',
    function ($compile, $rootScope, _$httpBackend, $controller, _apiHostname, _mockUsers, _Session_, _User_, _mockTenantUsers) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockUsers = _mockUsers;
      mockTenantUsers = _mockTenantUsers;
      apiHostname = _apiHostname;
      Session = _Session_;
      User = _User_;

      controller = $controller('UsersController', {
        '$scope': $scope
      });
    }
  ]));

  it('should have fetchTenantUsers', inject(function () {
    var users = $scope.fetchTenantUsers();
    
    $httpBackend.flush();

    expect(users).toBeDefined();
    expect(users.length).toEqual(3);
  }));

  it('should catch the on:click:create event', inject([ function () {
      $scope.$broadcast('table:on:click:create');
      expect($scope.selectedTenantUser).toBeDefined();
      expect($scope.selectedTenantUser.status).toEqual('pending');
    }]));

  describe('postUpdate function', function () {
    it('should reset the session authentication token if user changes their own password',
      inject(['$injector', 'Session', function ($injector, Session) {

        var newPassword = 'anewpassword';
        var AuthService = $injector.get('AuthService');
        var token = AuthService.generateToken(mockUsers[0].email, newPassword);

        $scope.selectedTenantUser = mockUsers[0];
        $scope.selectedTenantUser.password = newPassword;

        spyOn(Session, 'setToken');

        $scope.selectedTenantUser.preUpdate($scope.selectedTenantUser);

        expect($scope.newPassword).toBeDefined();
        expect($scope.newPassword).toEqual(newPassword);

        $scope.selectedTenantUser.postUpdate($scope.selectedTenantUser);

        expect(Session.setToken).toHaveBeenCalledWith(token);
      }]));

    it('should reset the session authentication token if user changes their own password',
      inject(['$injector', 'Session', function ($injector, Session) {

        var newPassword = 'anewpassword';
        $scope.newPassword = newPassword;
        var AuthService = $injector.get('AuthService');
        var token = AuthService.generateToken(mockTenantUsers[0].email, newPassword);

        $scope.selectedTenantUser = mockTenantUsers[0];
        $scope.selectedTenantUser.password = newPassword;

        spyOn(Session, 'setToken');

        Session.user.id = 'nope';

        $scope.selectedTenantUser.postUpdate($scope.selectedTenantUser);

        expect(Session.setToken).not.toHaveBeenCalledWith(token);
      }]));
  });
});
