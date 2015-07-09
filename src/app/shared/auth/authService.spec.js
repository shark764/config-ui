'use strict';

/* global spyOn: false  */

var USER;

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

  beforeEach(inject(['$rootScope', '$location', '$httpBackend', 'AuthService', 'Session', 'apiHostname', 'User',
    function (_$rootScope_, _$location_, _$httpBackend_, _AuthService_, _Session_, _apiHostname_, User) {
      $scope = _$rootScope_.$new();
      $location = _$location_;
      $httpBackend = _$httpBackend_;
      AuthService = _AuthService_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      
      USER = new User({
          'role': 'admin',
          'email': 'titan@liveops.com',
          'createdBy': '00000000-0000-0000-0000-000000000000',
          'displayName': 'titan',
          'updated': '2015-06-02T08:29:03Z',
          'firstName': 'titan',
          'created': '2015-06-02T08:29:03Z',
          'state': null,
          'extension': null,
          'externalId': null,
          'updatedBy': '00000000-0000-0000-0000-000000000000',
          'status': true,
          'id': '6d094710-0901-11e5-87f2-b1d420920055',
          'lastName': 'user'
        });
      
      LOGIN_RESPONSE = {
          result : {
            user: USER,
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
    it('should set the session when successful', function () {
      $httpBackend.expectPOST(apiHostname + '/v1/login').respond(LOGIN_RESPONSE);

      spyOn(Session, 'set');

      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).toHaveBeenCalledWith(
        USER, TENANTS, AuthService.generateToken(USERNAME, PASSWORD));
    });


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
});
