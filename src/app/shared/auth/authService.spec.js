'use strict';

/* global spyOn: false  */

var USERNAME = 'titan@liveops.com';
var PASSWORD = 'gKVnfF9wrs6XPSYs';
var TENANTS = [{
  tenantId: 1,
  name: 'test1',
  tenantPermissions: []
}, {
  tenantId: 2,
  name: 'test2',
  tenantPermissions: []
}];
var platformPermissions = [];

var LOGIN_RESPONSE;
var TOKEN_RESPONSE;

describe('AuthService', function() {
  var $scope,
    $location,
    $httpBackend,
    AuthService,
    Session,
    apiHostname,
    Token;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.user.mock'));

  beforeEach(inject(['$rootScope', '$location', '$httpBackend', 'AuthService', 'Session', 'apiHostname', 'mockUsers', 'Token',
    function($rootScope, _$location, _$httpBackend, _AuthService, _Session, _apiHostname, mockUsers, _Token) {
      $scope = $rootScope.$new();
      $location = _$location;
      $httpBackend = _$httpBackend;
      AuthService = _AuthService;
      Session = _Session;
      apiHostname = _apiHostname;
      Token = _Token;

      LOGIN_RESPONSE = {
        result: {
          userId: mockUsers[0].id,
          username: mockUsers[0].email,
          tenants: TENANTS,
          platformPermissions: platformPermissions
        }
      };

      TOKEN_RESPONSE = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyLWlkIjoiYzA5NTFkNTAtNjU2Yy0xMWU2LWIxYjktY2E4MTQ4NDQ4OGRmIiwidHlwZSI6InRva2VuIiwiZXhwIjoxNDc4NzEwMzk0LCJpYXQiOjE0Nzg2MjM5OTR9.JhUVmcBiJ3GvroQ3HfX8hZYAiEjfXHO2EI1J-XhJt88',
        ttl: 86400
      };
    }
  ]));

  it('should have a method get an authentication token', function() {
    var token = AuthService.generateToken(USERNAME, PASSWORD, Token);
    expect(token).toBeTruthy();
  });

  it('should have a method to logout which destroys the session', function() {
    AuthService.logout();
    expect(Session.token).toBeNull();
  });

  describe('ON login', function() {
    it('should set the session when successful', function() {
      $httpBackend.whenPOST(apiHostname + '/v1/tokens').respond(TOKEN_RESPONSE);
      $httpBackend.expectPOST(apiHostname + '/v1/tokens');

      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).toHaveBeenCalledWith(
        jasmine.any(Object), TENANTS, TOKEN_RESPONSE.token, platformPermissions);
    });


    it('should validate on failure', function() {
      $httpBackend.whenPOST(apiHostname + '/v1/tokens').respond(TOKEN_RESPONSE);
      $httpBackend.expectPOST(apiHostname + '/v1/tokens');

      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(500, '');

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).not.toHaveBeenCalled();
      expect(Session.token).toBeNull();
    });
  });

  describe('refreshTenants function', function() {
    it('should set the tenants', function() {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);
      spyOn(Session, 'setTenants');

      AuthService.refreshTenants();
      $httpBackend.flush();
      expect(Session.setTenants).toHaveBeenCalledWith(TENANTS);
    });
  });
});
