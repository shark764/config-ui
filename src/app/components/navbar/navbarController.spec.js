'use strict';

describe('NavbarController', function() {
  var $rootScope,
    $scope,
    $state,
    $rootScope,
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

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope' '$state', '$controller', '$injector', 'AuthService', 'Session', 'apiHostname', 'Tenant',
    function(_$compile_, _$rootScope_, _$state, _$controller_, _$injector_, _authService_, _session_, _apiHostname_, Tenant) {
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $state = _$state;
      $controller = _$controller_;
      $injector = _$injector_;
      $httpBackend = $injector.get('$httpBackend');
      authService = _authService_;
      session = _session_;
      apiHostname = _apiHostname_;

      session.destroy();
      session.token = 'abc';

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

    $state.transitionTo('content.management.users');
    $rootScope.$apply();

    expect($scope.isActive('/management')).toBe(true);
    expect($scope.isActive('/configuration')).toBe(false);
  });

  it('should have a method to log the user out and redirect them to the login page', function() {
    createController();

    $state.transitionTo('content.management.users');

    expect(session.isAuthenticated()).toBeTruthy();

    $scope.logout();

    expect(session.isAuthenticated()).toBeFalsy(false);
  });

  it('should select the first tenant retrieved as the active tenant if no tenant is set in the session', function() {
    expect(session.tenant.id).toBe('');

    createController();

    session.tenants = [{tenantId: 1}, {tenantId: 2}];

    $scope.populateTenantsHandler();

    expect(session.tenant.tenantId).toBe(tenants[0].id);
  });
});
