'use strict';

describe('roles controller', function() {
  var $scope,
    mockRoles,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.role.mock'));

  beforeEach(inject(['$rootScope', 'mockRoles', '$controller', 'loEvents',
    function($rootScope, _mockRoles, $controller, _loEvents) {
      $scope = $rootScope.$new();
      mockRoles = _mockRoles;
      loEvents = _loEvents;

      $controller('RolesController', {
        '$scope': $scope
      });
      $scope.$digest();
    }
  ]));

  it('should catch the table create click event and call create', inject(function($rootScope) {
    spyOn($scope, 'create');
    $rootScope.$broadcast(loEvents.tableControls.itemCreate);
    $scope.$digest();
    expect($scope.create).toHaveBeenCalled();
  }));

  describe('fetchTenantRoles function', function() {
    it('should be defined', inject(function() {
      expect($scope.fetchTenantRoles).toBeDefined();
    }));

    it('should query for tenant roles', inject(function($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/roles');
      $scope.fetchTenantRoles();
      $httpBackend.flush();
    }));
  });

  describe('create function', function() {
    it('should be defined', inject(function() {
      expect($scope.create).toBeDefined();
    }));

    it('should set default values for selectedTenantRole', inject(function(Session) {
      Session.tenant.tenantId = 'tenant-id';
      $scope.create();
      expect($scope.selectedTenantRole.tenantId).toEqual('tenant-id');
      expect($scope.selectedTenantRole.permissions.length).toBe(0);
    }));
  });

  describe('submit function', function() {
    it('should be defined', inject(function() {
      expect($scope.submit).toBeDefined();
    }));

    it('should save selectedTenantRole', inject(function(TenantRole) {
      $scope.selectedTenantRole = new TenantRole();
      spyOn($scope.selectedTenantRole, 'save');

      $scope.submit();
      expect($scope.selectedTenantRole.save).toHaveBeenCalled();
    }));
  });
});
