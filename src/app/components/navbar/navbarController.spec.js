'use strict';

var USER = {
  displayName: 'titan',
  id: 'id'
};

var TOKEN = 'token';

describe('NavbarController', function() {
  var $rootScope,
    $scope,
    $location,
    $compile,
    $controller,
    $injector,
    $httpBackend,
    authService,
    session,
    tenants,
    regions,
    apiHostname;

  var createController = function() {
    return $controller('NavbarController', {
      '$scope': $scope,
    });
  };

  var login = function() {
    session.set(USER, TOKEN);
  };

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$compile', '$rootScope', '$location', '$controller', '$injector', 'AuthService', 'Session', 'apiHostname', 'Tenant',
    function(_$compile_, _$rootScope_, _$location_, _$controller_, _$injector_, _authService_, _session_, _apiHostname_, Tenant) {
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $location = _$location_;
      $controller = _$controller_;
      $injector = _$injector_;
      $httpBackend = $injector.get('$httpBackend');
      authService = _authService_;
      session = _session_;
      apiHostname = _apiHostname_;

      session.destroy();

      tenants = [new Tenant({
        'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39'
      }), new Tenant({
        'id': '9f97f9d9-004c-469c-906d-b917bd79fbe8'
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

  it('should have a method to check if the path is active', function() {
    createController();

    $location.path('/users');

    expect($location.path()).toBe('/users');
    expect($scope.isActive('/users')).toBe(true);
    expect($scope.isActive('/contact')).toBe(false);
  });

  it('should have a method to log the user out and redirect them to the login page', function() {
    createController();

    $location.path('/users');
    login();

    expect(session.isAuthenticated()).toBeTruthy();
    expect($location.path()).toBe('/users');

    $scope.logout();

    expect(session.isAuthenticated()).toBeFalsy(false);
  });

  it('should select the first tenant retrieved as the active tenant if no tenant is set in the session', function() {
    login();
    expect(session.tenant).toBeNull();

    $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=' + session.activeRegionId);

    createController();
    $rootScope.$broadcast('Session:login');

    $httpBackend.flush();

    expect(Session.tenant.tenantId).toBe(tenants[0].id);
  });

  it('should load the tenants for the active region', function() {
    login();
    $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=' + session.activeRegionId);

    createController();

    $httpBackend.flush();

    expect($scope.tenants.length).toEqual(tenants.length);
  });

  it('should have Session.tenant not reset when already set', function() {
    login();
    session.tenant = tenants[0];

    $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=' + session.activeRegionId);

    createController();

    $httpBackend.flush();

    expect(session.tenant).toEqual(tenants[0]);
  });
});
