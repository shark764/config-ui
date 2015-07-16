'use strict';

/* global spyOn: false  */

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';
var USERNAME = 'titan@liveops.com';
var PASSWORD = 'gKVnfF9wrs6XPSYs';
var TENANTS = [
  {
    tenantId: 1,
    name: 'test1'
  },
  {
    tenantId: 2,
    name: 'test2'
  }
];

var LOGIN_RESPONSE;

describe('AuthService', function () {
  var $scope, $location, $httpBackend, AuthService, Session, apiHostname;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  
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
          user: mockUsers[0],
          tenants: TENANTS
        }
      };
    }
  ]));

  it('should have a method get an authentication token', function () {
    var token = AuthService.generateToken(USERNAME, PASSWORD);
    expect(token).toBe(TOKEN);
  });

  it('should have a method to logout which destroys the session', function () {
    spyOn(Session, 'destroy');

    AuthService.logout();

    expect(Session.destroy).toHaveBeenCalled();
    expect(Session.token).toBeNull();
  });

  describe('ON login', function() {
    it('should set the session when successful', inject(['mockUsers', function (mockUsers) {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).toHaveBeenCalledWith(
        mockUsers[0], TENANTS, AuthService.generateToken(USERNAME, PASSWORD));
    }]));


    it('should validate on failure', function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(500, '');

      spyOn(Session, 'set');

      var promise = AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(promise.$$state.status).toEqual(2); //rejected
      expect(promise.$$state.value.status).toEqual(500);
      expect(promise.$$state.value.data).toEqual('');

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
