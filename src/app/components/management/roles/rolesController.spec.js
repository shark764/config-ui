'use strict';

describe('roles controller', function () {
  var $scope,
    mockRoles;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.roles'));

  beforeEach(inject(['$rootScope', 'mockRoles', '$controller',
    function ($rootScope, _mockRoles, $controller) {
      $scope = $rootScope.$new();
      mockRoles = _mockRoles;

      $controller('RolesController', {
        '$scope': $scope
      });
      $scope.$digest();
    }
  ]));
  
  it('should catch the table create click event and call create', inject(['$rootScope', function ($rootScope) {
    spyOn($scope, 'create');
    $rootScope.$broadcast('table:on:click:create');
    $scope.$digest();
    expect($scope.create).toHaveBeenCalled();
  }]));
  
  describe('fetchTenantRoles function', function () {
    it('should be defined', inject(function () {
      expect($scope.fetchTenantRoles).toBeDefined();
    }));

    it('should query for tenant roles', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/roles');
      $scope.fetchTenantRoles();
      $httpBackend.flush();
    }]));
  });
  
  describe('create function', function () {
    it('should be defined', inject(function () {
      expect($scope.create).toBeDefined();
    }));

    it('should set default values for selectedTenantRole', inject(['Session', function (Session) {
      Session.tenant.tenantId = 'tenant-id';
      $scope.create();
      expect($scope.selectedTenantRole.tenantId).toEqual('tenant-id');
      expect($scope.selectedTenantRole.permissions.length).toBe(0);
    }]));
  });
  
  describe('submit function', function () {
    it('should be defined', inject(function () {
      expect($scope.submit).toBeDefined();
    }));

    it('should save selectedTenantRole', inject(['TenantRole', function (TenantRole) {
      $scope.selectedTenantRole = new TenantRole();
      spyOn($scope.selectedTenantRole, 'save');
      
      $scope.submit();
      expect($scope.selectedTenantRole.save).toHaveBeenCalled();
    }]));
  });
});
