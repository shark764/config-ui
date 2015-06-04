'use strict';

/* global spyOn: false  */

var USER = {
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
};

var OTHER_USER = {
  'role': 'admin',
  'email': 'titan2@liveops.com',
  'createdBy': '00000000-0000-0000-0000-000000000000',
  'displayName': 'titan',
  'updated': '2015-06-02T08:29:03Z',
  'firstName': 'titan2',
  'created': '2015-06-02T08:29:03Z',
  'state': null,
  'extension': null,
  'externalId': null,
  'updatedBy': '00000000-0000-0000-0000-000000000000',
  'status': true,
  'id': '6d094710-0901-11e5-87f2-b1d420920055',
  'lastName': 'user'
};

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';
var USERNAME = 'titan@liveops.com';
var PASSWORD = 'gKVnfF9wrs6XPSYs';

describe('AuthService', function () {
  var $scope, $location, $httpBackend, AuthService, Session;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$rootScope', '$location', '$httpBackend', 'AuthService', 'Session',
    function (_$rootScope_, _$location_, _$httpBackend_, _AuthService_, _Session_) {
      $scope = _$rootScope_.$new();
      $location = _$location_;
      $httpBackend = _$httpBackend_;
      AuthService = _AuthService_;
      Session = _Session_;
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
      $httpBackend.expectGET('fakendpoint.com/v1/users').respond({
        'result': [USER]
      });
      
      spyOn(Session, 'set');
      
      AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();

      expect(Session.set).toHaveBeenCalledWith(
        USER, AuthService.generateToken(USERNAME, PASSWORD));
    });
    
    it('should throw an error if the user is not returned', function () {
      $httpBackend.expectGET('fakendpoint.com/v1/users').respond({
        'result': [OTHER_USER]
      });
      
      spyOn(Session, 'set');
      
      var promise = AuthService.login(USERNAME, PASSWORD);
      
      $httpBackend.flush();
      
      expect(promise.$$state.status).toEqual(2); //rejected
      expect(promise.$$state.value.name).toEqual('UserNotFoundException');
      expect(promise.$$state.value.message).toEqual('Username was not found under /v1/users');
      
      expect(Session.set).not.toHaveBeenCalled();
      expect(Session.token).toBeNull();
    });
    
    it('should validate on failure', function () {
      $httpBackend.expectGET('fakendpoint.com/v1/users').respond(500, '');
      
      spyOn(Session, 'set');
      
      var promise = AuthService.login(USERNAME, PASSWORD);
      $httpBackend.flush();
      
      expect(promise.$$state.status).toEqual(1); //resolved
      expect(promise.$$state.value.status).toEqual(500);
      expect(promise.$$state.value.data).toEqual('');

      expect(Session.set).not.toHaveBeenCalled();
      expect(Session.token).toBeNull();
    });
  });
});