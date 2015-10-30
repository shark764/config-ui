'use strict';

/* global spyOn: false  */

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';
var USERNAME = 'titan@liveops.com';
var PASSWORD = 'gKVnfF9wrs6XPSYs';
var TENANTS = [
  {
    tenantId: 1,
    name: 'test1',
    tenantPermissions: []
  },
  {
    tenantId: 2,
    name: 'test2',
    tenantPermissions: []
  }
];
var platformPermissions = [];

var LOGIN_RESPONSE;

describe('AuthService', function () {
  var $scope, $location, $httpBackend, AuthService, Session, apiHostname;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.user.mock'));
  
  beforeEach(inject(['$rootScope', '$location', '$httpBackend', 'AuthService', 'Session', 'apiHostname', 'mockUsers',
    function (_$rootScope_, _$location_, _$httpBackend_, _AuthService_, _Session_, _apiHostname_, mockUsers) {
      $scope = _$rootScope_.$new();
      $location = _$location_;
      $httpBackend = _$httpBackend_;
      AuthService = _AuthService_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      
      LOGIN_RESPONSE = {
        result : {
          userId: mockUsers[0].id,
          username: mockUsers[0].email,
          tenants: TENANTS,
          platformPermissions: platformPermissions
        }
      };
    }
  ]));

  it('should have a method get an authentication token', function () {
    var token = AuthService.generateToken(USERNAME, PASSWORD);
    expect(token).toBe(TOKEN);
  });

  it('should have a method to logout which destroys the session', function () {
    AuthService.logout();
    expect(Session.token).toBeNull();
  });

  describe('ON login', function() {
    it('should set the session when successful', function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).toHaveBeenCalledWith(
        jasmine.any(Object), TENANTS, AuthService.generateToken(USERNAME, PASSWORD), platformPermissions);
    });


    it('should validate on failure', function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(500, '');

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).not.toHaveBeenCalled();
      expect(Session.token).toBeNull();
    });
  });
  
  describe('refreshTenants function', function() {
    it('should set the tenants', inject([function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);
      spyOn(Session, 'setTenants');
      
      AuthService.refreshTenants();
      $httpBackend.flush();
      expect(Session.setTenants).toHaveBeenCalledWith(TENANTS);
    }]));
  });
});
