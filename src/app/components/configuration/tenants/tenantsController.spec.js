'use strict';

describe('TenantsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    Session,
    mockTenants;
  
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.tenants'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'mockTenants',
    function ($rootScope, _$controller_, _$httpBackend, _apiHostname_, _Session_, _mockTenants) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend;
      
      apiHostname = _apiHostname_;
      mockTenants = _mockTenants;
      Session = _Session_;

      $controller('TenantsController', {
        '$scope': $scope
      });
    }
  ]));

  describe('fetchTenants function', function(){
    it('should fetch the list of tenants if user has permission', inject(['queryCache', 'UserPermissions', function (queryCache, UserPermissions) {
      queryCache.removeAll();
      
      $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=regionId2').respond({
          'result': []
        });

      Session.activeRegionId = 'regionId2';
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
      
      $scope.tenants = null;
      $scope.fetchTenants();
      $httpBackend.flush();
    }]));
    
    it('should return the current tenant if user has MANAGE_TENANT permission', inject(['UserPermissions', function (UserPermissions) {

      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);
      spyOn(UserPermissions, 'hasPermission').and.callFake(function(permission){
        if (permission === 'MANAGE_TENANT'){
          return true;
        }
        
        return false;
      });
      
      Session.tenant.tenantId = 'tenant-id';
      var result = $scope.fetchTenants();
      $httpBackend.flush();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(mockTenants[0].id);
    }]));
    
    it('should return nothing if user doens\'t have permission', inject(['UserPermissions', function (UserPermissions) {
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(false);
      var result = $scope.fetchTenants();
      expect(result).toBeUndefined();
    }]));
  });
  
  describe('fetchUsers function', function(){
    it('should fetch the list of users', inject(['queryCache', function (queryCache) {
      queryCache.removeAll();
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/users').respond({
          'result': []
        });

      $scope.fetchUsers();
      $httpBackend.flush();
    }]));
  });

  it('should have a function to create a new tenant and set it as selected', function () {
    $scope.$broadcast('table:on:click:create');
    expect($scope.selectedTenant).toBeDefined();
    expect($scope.selectedTenant.regionId).toBe(Session.activeRegionId);
  });
    
  describe('create function', function(){
    it('should set the adminUserId to the current active user', function () {
      Session.user = {id: 'me'};
      $scope.create();
      expect($scope.selectedTenant.adminUserId).toEqual('me');
    });
  });
  
  it('should refresh the tenants if user creates a tenant with themselves as admin', inject(['AuthService', 'Tenant', '$rootScope', function (AuthService, Tenant, $rootScope) {
    spyOn(AuthService, 'refreshTenants');
    $rootScope.$broadcast('created:resource:Tenant', new Tenant({adminUserId: Session.user.id}));
    $scope.$digest();
    
    expect(AuthService.refreshTenants).toHaveBeenCalled();
  }]));
  
  it('should not refresh the tenants if user creates a tenant with someone else as admin', inject(['AuthService', 'Tenant', '$rootScope', function (AuthService, Tenant, $rootScope) {
    spyOn(AuthService, 'refreshTenants');
    $rootScope.$broadcast('created:resource:Tenant', new Tenant({adminUserId: 'someoneelse'}));
    $scope.$digest();
    
    expect(AuthService.refreshTenants).not.toHaveBeenCalled();
  }]));
  
  it('should refresh the tenants if user updates a tenant', inject(['AuthService', function (AuthService) {
    spyOn(AuthService, 'refreshTenants');
    $scope.$broadcast('updated:resource:Tenant');
    $scope.$digest();
    
    expect(AuthService.refreshTenants).toHaveBeenCalled();
  }]));
});
