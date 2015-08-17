'use strict';

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
      expect($scope.selectedTenantUser.isNew()).toBeTruthy();
      
      expect($scope.selectedTenantUser.$user).toBeDefined();
      expect($scope.selectedTenantUser.$user.isNew()).toBeTruthy();
    }]));
});
