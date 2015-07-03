'use strict';

describe('TenantsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    Session,
    mockUsers,
    mockTenants;
  
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.tenants'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'mockTenants', 'mockUsers',
    function ($rootScope, _$controller_, _$httpBackend, _apiHostname_, _Session_, _mockTenants, _mockUsers) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend;
      
      apiHostname = _apiHostname_;
      mockTenants = _mockTenants;
      mockUsers = _mockUsers;
      Session = _Session_;

      $controller('TenantsController', {
        '$scope': $scope
      });
      $httpBackend.flush();
    }
  ]));

  it('should fetch the list of tenants on create', function () {
    expect($scope.tenants).toBeDefined();
    expect($scope.tenants[0].id).toEqual(mockTenants[0].id);
    expect($scope.tenants[1].id).toEqual(mockTenants[1].id);
  });

  it('should fetch the list of users on create', function () {
    expect($scope.users).toBeDefined();
    expect($scope.users[0].id).toEqual(mockUsers[0].id);
    expect($scope.users[1].id).toEqual(mockUsers[1].id);
  });

  it('should have a function to create a new tenant and set it as selected', function () {
    $scope.$broadcast('on:click:create');
    expect($scope.selectedTenant).toBeDefined();
    expect($scope.selectedTenant.regionId).toBe(Session.activeRegionId);
  });
});