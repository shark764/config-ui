'use strict';

/* global spyOn: false  */

describe('NavbarController', function () {
  var $rootScope,
    $scope,
    $state,
    $compile,
    $controller,
    $httpBackend,
    Session,
    apiHostname,
    mockTenants;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.tenants'));

  beforeEach(inject(['$compile', '$rootScope', '$state', '$controller', '$httpBackend', 'Session', 'apiHostname', 'mockTenants',
    function (_$compile_, _$rootScope_, _$state_, _$controller_, _$httpBackend, _Session_, _apiHostname_, _mockTenants) {
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $state = _$state_;
      $controller = _$controller_;
      $httpBackend = $httpBackend;
      apiHostname = _apiHostname_;
      mockTenants = _mockTenants;
      Session = _Session_;
    }
  ]));

  describe('initialized with no tenants', function() {
    beforeEach(function() {
      Session.tenants = [];

      $controller('NavbarController', {
        '$scope': $scope
      });

      $rootScope.$apply();
    });

    it('should have a method to check if the path is active', function () {
      $state.go('content.management.users').then(function (){
        expect($scope.isActive('/management')).toBe(true);
        expect($scope.isActive('/configuration')).toBe(false);
      });
      $rootScope.$apply();
    });

    it('should have a method to log the user out and redirect them to the login page', function () {
      Session.token = 'abc';

      $state.transitionTo('content.management.users');

      expect(Session.isAuthenticated()).toBeTruthy();

      $scope.logout();

      expect(Session.isAuthenticated()).toBeFalsy();
    });
  });

  describe('initialized with tenants', function() {
    beforeEach(function() {
      Session.token = 'abc';
      Session.tenants = mockTenants;

      $controller('NavbarController', {
        '$scope': $scope,
      });

      $scope.$apply();

      expect(Session.tenants).toBeDefined();
      expect(Session.tenants.length).toEqual(2);
    });

    it('should select the first tenant retrieved as the active tenant if no tenant is set in the Session', function () {
      expect(Session.tenant.tenantId).toBe(mockTenants[0].id);
    });

    it('should switch the tenant on drop down click', function() {
      expect($scope.tenantDropdownItems).toBeDefined();
      expect($scope.tenantDropdownItems[1]).toBeDefined();
      expect($scope.tenantDropdownItems[1].onClick).toBeDefined();

      $scope.tenantDropdownItems[1].onClick();
      expect(Session.tenant.tenantId).toEqual(mockTenants[1].tenantId);
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
    Session.token = null;

    $controller('NavbarController', {
      '$scope': $scope,
    });

    $scope.populateTenantsHandler();

    expect($scope.tenantDropdownItems).not.toBeDefined();
  });
});
