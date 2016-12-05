'use strict';

describe('TenantsController', function() {
  var $scope,
    controller,
    $httpBackend,
    apiHostname,
    Session,
    mockTenants,
    loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));
  beforeEach(module('liveopsConfigPanel.timezone.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'mockTenants', 'loEvents',
    function($rootScope, $controller, _$httpBackend, _apiHostname, _Session, _mockTenants, _loEvents) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      loEvents = _loEvents;
      apiHostname = _apiHostname;
      mockTenants = _mockTenants;
      Session = _Session;

      Session.tenant.tenantPermissions = ['MANAGE_TENANT'];
      Session.platformPermissions = ['PLATFORM_VIEW_ALL_TENANTS'];

      controller = $controller('TenantsController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    }
  ]));

  describe('loadTenants function', function() {
    beforeEach(inject(function(queryCache) {
      delete $scope.tenants;
      queryCache.removeAll();

      Session.platformPermissions = [];
      Session.tenant.tenantPermissions = [];
    }));

    it('should fetch the list of tenants if user has permission', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=regionId2').respond({
        'result': []
      });

      Session.activeRegionId = 'regionId2';
      Session.platformPermissions = ['PLATFORM_VIEW_ALL_TENANTS'];

      controller.loadTenants();
      $httpBackend.flush();
    });

    it('should return the current tenant if user has MANAGE_TENANT permission', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id').respond({
        'result': mockTenants[0]
      });

      Session.tenant.tenantPermissions = ['MANAGE_TENANT'];

      controller.loadTenants();
      $httpBackend.flush();
      expect($scope.tenants.length).toBe(1);
      expect($scope.tenants[0].id).toBe(mockTenants[0].id);
    });

    it('should return nothing if user doens\'t have permission', function() {
      expect(function() {
        controller.loadTenants();
      }).toThrow();

      expect($scope.tenants).toBeUndefined();
    });
  });

  describe('loadUsers function', function() {
    beforeEach(inject(['queryCache', function(queryCache) {
      queryCache.removeAll();
    }]));

    it('should fetch the list of users', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/users');

      controller.loadTenants();
      $httpBackend.flush();
    });
  });

  it('should have a function to create a new tenant and set it as selected', function() {
    $scope.$broadcast(loEvents.tableControls.itemCreate);
    expect($scope.selectedTenant).toBeDefined();
    expect($scope.selectedTenant.regionId).toBe(Session.activeRegionId);
  });

  describe('create function', function() {
    it('should set the adminUserId to the current active user', function() {
      Session.user = {
        id: 'me'
      };
      $scope.create();
      expect($scope.selectedTenant.adminUserId).toEqual('me');
    });
  });

  it('should refresh the tenants if user creates a tenant with themselves as admin', inject(function(AuthService, Tenant, $rootScope) {
    spyOn(AuthService, 'refreshTenants');
    $rootScope.$broadcast('created:resource:Tenant', new Tenant({
      adminUserId: Session.user.id
    }));
    $scope.$digest();

    expect(AuthService.refreshTenants).toHaveBeenCalled();
  }));

  it('should not refresh the tenants if user creates a tenant with someone else as admin', inject(function(AuthService, Tenant, $rootScope) {
    spyOn(AuthService, 'refreshTenants');
    $rootScope.$broadcast('created:resource:Tenant', new Tenant({
      adminUserId: 'someoneelse'
    }));
    $scope.$digest();

    expect(AuthService.refreshTenants).not.toHaveBeenCalled();
  }));
});
