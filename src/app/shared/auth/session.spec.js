'use strict';

/* global localStorage: false */

var USER;

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';

describe('Session', function() {
  var $scope, session;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$rootScope','Session', 'User', function(_$rootScope_, _session_, User) {
    $scope = _$rootScope_.$new();
    session = _session_;
    
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
  }]));

  it('should have a method to set the session information', function() {
    session.set(USER, [], TOKEN);

    expect(session.token).toBe(TOKEN);
    expect(session.user.displayName).toBe(USER.fullName());
    expect(session.isAuthenticated()).toBeTruthy(true);

    var stringifiedSession = localStorage.getItem(session.userSessionKey);
    expect(stringifiedSession).toBeDefined();
  });


  it('should have a method to destroy the session information', function() {
    session.set(USER, [], TOKEN);

    session.destroy();

    expect(session.token).toBeNull();
    expect(session.user).toBeNull();
    expect(session.isAuthenticated()).toBeFalsy();
    expect(localStorage.getItem(session.userSessionKey)).toBe(null);
  });


  it('should have a method to restore the session information', function() {
    session.set(USER, [], TOKEN);

    session.token = null;
    session.user = null;

    expect(session.token).toBeNull();
    expect(session.user).toBeNull();
    expect(session.isAuthenticated()).toBeFalsy();

    session.restore();

    expect(session.token).toBe(TOKEN);
    expect(session.user.displayName).toBe(USER.fullName());
    expect(session.isAuthenticated()).toBeTruthy();
  });
});
