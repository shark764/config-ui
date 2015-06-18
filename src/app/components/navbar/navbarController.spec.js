'use strict';

/* global spyOn: false  */

describe('NavbarController', function () {
  var $rootScope,
    $scope,
    $state,
    $compile,
    $controller,
    $injector,
    $httpBackend,
    authService,
    session,
    tenants,
    regions,
    apiHostname;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$state', '$controller', '$injector', 'AuthService', 'Session', 'apiHostname', 'Tenant',
    function (_$compile_, _$rootScope_, _$state_, _$controller_, _$injector_, _authService_, _session_, _apiHostname_, Tenant) {
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $state = _$state_;
      $controller = _$controller_;
      $injector = _$injector_;
      $httpBackend = $injector.get('$httpBackend');
      authService = _authService_;
      session = _session_;
      apiHostname = _apiHostname_;

      session.destroy();
      session.token = 'abc';

      tenants = [new Tenant({
        'tenantId': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39',
        'name': 'Tenant'
      }), new Tenant({
        'tenantId': '9f97f9d9-004c-469c-906d-b917bd79fbe8',
        'name': 'Tenant2'
      })];

      regions = [{
        'id': 'c6aa45a6-b19e-49f5-bd3f-61f00b893e39'
      }];

      session.activeRegionId = regions[0].id;

      $httpBackend.when('GET', apiHostname + '/v1/tenants?regionId=' + session.activeRegionId).respond({
        'result': tenants
      });
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
        'result': regions
      });
    }
  ]));
  
  describe('initialized with no tenants', function() {
    beforeEach(function() {
      session.tenants = [];
      
      $controller('NavbarController', {
        '$scope': $scope,
      });
      
      $rootScope.$apply();
    });
    
    it('should have a method to check if the path is active', function () {
      $state.transitionTo('content.management.users');
      $rootScope.$apply();

      expect($scope.isActive('/management')).toBe(true);
      expect($scope.isActive('/configuration')).toBe(false);
    });

    it('should have a method to log the user out and redirect them to the login page', function () {
      $state.transitionTo('content.management.users');

      expect(session.isAuthenticated()).toBeTruthy();

      $scope.logout();

      expect(session.isAuthenticated()).toBeFalsy(false);
    });
  });
  
  describe('initialized with tenants', function() {
    beforeEach(function() {
      session.tenants = tenants;
      
      $controller('NavbarController', {
        '$scope': $scope,
      });
      
      $scope.$apply();
      
      expect($scope.Session.tenants).toBeDefined();
      expect($scope.Session.tenants.length).toEqual(2);
    });
    
    it('should select the first tenant retrieved as the active tenant if no tenant is set in the session', function () {
      expect($scope.Session.tenant.tenantId).toBe(tenants[0].tenantId);
    });
    
    it('should switch the tenant on drop down click', function() {
      expect($scope.tenantDropdownItems).toBeDefined();
      expect($scope.tenantDropdownItems[1]).toBeDefined();
      expect($scope.tenantDropdownItems[1].onClick).toBeDefined();
      
      $scope.tenantDropdownItems[1].onClick();
      expect($scope.Session.tenant.tenantId).toEqual(tenants[1].tenantId);
    });
    
    it('should call $scope.logout on logout click', function() {
      spyOn($scope, 'logout');
      
      $scope.userDropdownItems[0].onClick();
      
      expect($scope.logout).toHaveBeenCalled();
    });
    
    it('should call $scope.logout on logout click', function() {
      spyOn($state, 'transitionTo');
      
      $scope.userDropdownItems[1].onClick();
      
      expect($state.transitionTo).toHaveBeenCalled();
    });
  });
  
  it('should return null if user is not authenticated', function() {
    session.token = null;
    
    $controller('NavbarController', {
      '$scope': $scope,
    });

    $scope.populateTenantsHandler();
    
    expect($scope.tenantDropdownItems).not.toBeDefined();
  });
});