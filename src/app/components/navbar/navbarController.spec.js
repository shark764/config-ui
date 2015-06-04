'use strict';

describe('NavbarController', function() {
  var $scope, $location, $compile, $controller, $injector, $httpBackend, authService, createController, session, tenants, regions, apiHostname;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$compile', '$rootScope', '$location', '$controller', '$injector', 'AuthService', 'Session', 'apiHostname',
    function(_$compile_, _$rootScope_, _$location_, _$controller_, _$injector_, _authService_, _session_, _apiHostname_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $location = _$location_;
    $controller = _$controller_;
    $injector = _$injector_;
    $httpBackend = $injector.get('$httpBackend');
    authService = _authService_;
    session = _session_;
    apiHostname = _apiHostname_;

    tenants  = [
      {
        'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39'
      },
      {
        'id': '9f97f9d9-004c-469c-906d-b917bd79fbe8'
      }
    ];

    regions = [
      {
        'id' : 'c6aa45a6-b19e-49f5-bd3f-61f00b893e39'
      }
    ];

    session.activeRegionId = regions[0].id;

    $httpBackend.when('GET', apiHostname + '/v1/tenants?regionId=' + session.activeRegionId).respond({'result' : tenants});
    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : regions});

    createController = function () {
        return $controller('NavbarController', {
            '$scope': $scope,
        });
    };
  }]));

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
      session.set('abc', 'John');

      expect(session.isAuthenticated()).toBeTruthy();
      expect($location.path()).toBe('/users');

      $scope.logout();

      expect(session.isAuthenticated()).toBeFalsy(false);
  });

  it('should select the first tenant retrieved as the active tenant if no tenant is set in the session', function () {

    expect(session.tenantId).toBeNull();

    $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=' + session.activeRegionId);

    createController();

    $httpBackend.flush();

    expect(session.tenantId).toBe(tenants[0].id);
  });


	it('should load the tenants for the active region', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=' + session.activeRegionId);

      createController();

      $httpBackend.flush();

      expect($scope.tenants.length).toEqual(tenants.length);
  	});
});