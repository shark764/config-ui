'use strict';

/* global spyOn: false  */

describe('users controller', function () {
  var $scope,
    $httpBackend,
    Session,
    controller,
    apiHostname,
    User,
    mockUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'User',
    function ($compile, $rootScope, _$httpBackend, $controller, _apiHostname, _mockUsers, _Session_, _User_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockUsers = _mockUsers;
      apiHostname = _apiHostname;
      Session = _Session_;
      User = _User_;

      controller = $controller('UsersController', {
        '$scope': $scope
      });

      $scope.user = mockUsers[0];
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
      expect($scope.selectedTenantUser.status).toEqual('enabled');
    }]));

  describe('postSave function', function () {
    it('should reset the session authentication token if user changes their own password',
      inject(['$injector', 'Session', function ($injector, Session) {

        var newPassword = 'anewpassword';
        var AuthService = $injector.get('AuthService');
        var token = AuthService.generateToken(mockUsers[0].email, newPassword);

        $scope.selectedTenantUser = mockUsers[0];
        $scope.selectedTenantUser.password = newPassword;

        spyOn(Session, 'setToken');

        $scope.selectedTenantUser.preUpdate($scope.selectedTenantUser);

        expect(controller.newPassword).toBeDefined();
        expect(controller.newPassword).toEqual(newPassword);

        $scope.selectedTenantUser.postUpdate($scope.selectedTenantUser);

        expect(Session.setToken).toHaveBeenCalledWith(token);
      }]));

    it('should reset the session authentication token if user changes their own password',
      inject(['$injector', 'Session', function ($injector, Session) {

        var newPassword = 'anewpassword';
        var AuthService = $injector.get('AuthService');
        var token = AuthService.generateToken(mockUsers[0].email, newPassword);

        $scope.selectedTenantUser = mockUsers[0];
        $scope.selectedTenantUser.password = newPassword;

        spyOn(Session, 'setToken');

        $scope.selectedTenantUser.preUpdate($scope.selectedTenantUser);

        expect(controller.newPassword).toBeDefined();
        expect(controller.newPassword).toEqual(newPassword);

        Session.user.id = 'nope';

        $scope.selectedTenantUser.postUpdate($scope.selectedTenantUser);

        expect(Session.setToken).not.toHaveBeenCalledWith(token);
      }]));
  });
});
