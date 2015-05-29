'use strict';

describe('search filter', function(){
  var filter,
    users;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function($filter) {
    users = [ {
        'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39',
        'status': false,
        'updatedBy': 'b9a14681-9912-437d-b72b-320bbebfa40c',
        'externalId': 73543,
        'extension': 9970,
        'state': 'WRAP',
        'created': 'Wed Nov 07 2001 21:32:07 GMT+0000 (UTC)',
        'lastName': 'Wazowski',
        'firstName': 'Mike',
        'updated': 'Sun Aug 31 1997 19:52:45 GMT+0000 (UTC)',
        'email': 'mike.Wazowski@hivedom.org',
        'displayName': 'Mike Wazowski',
        'password': '',
        'createdBy': '02f1eeff-8204-4902-9f4c-7960db3795fa',
        'role': 'Administrator'
      }];

    filter = $filter('search');
    
  }]));

  it('should return user if search is blank', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], '');
    expect(result.length).toBe(1);
  }));

  it('should not return user if search not included in user values', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'blahh');
    expect(result.length).toBe(0);
  }));

  it('should return user if search is included in user first name', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'ike');
    expect(result.length).toBe(1);
  }));

  it('should return user if search is included in user first and last name', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Mike Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should return user if search is included in user last name', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'ski');
    expect(result.length).toBe(1);
  }));

  it('should not return part search is included in user values', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Michael Wazowski');
    expect(result.length).toBe(0);
  }));

  it('should return user if search has wildcard value only', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], '*');
    expect(result.length).toBe(1);
  }));

  it('should return user with containing partial string using wildcard in user', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Mi*Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should only return user containing partial strings using several wildcards in user', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'i*e*a');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'i*l*e*a');
    expect(result.length).toBe(0);
  }));

  it('should return user regardless of character case', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'MIKE wAzoWsKi');
    expect(result.length).toBe(1);
  }));

  it('should not return user when search string does not match any user details', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Randall Boggs');
    expect(result.length).toBe(0);
  }));

  it('should not return user when search string with wild cards does not match any user', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], '*boo*');
    expect(result.length).toBe(0);
  }));

  it('should not use the asterisk as a repeat operator', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'q*');
    expect(result.length).toBe(0);
  }));

  it('should use the asterisk as 0 or more of any valid character', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'M*i*W*a*z*o*i');
    expect(result.length).toBe(1);
  }));

  it('should return the same result regardless of wildcard repeats', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'M*****');
    expect(result.length).toBe(1);
  }));

  it('should return the same result for strings starting and ending with wildcard', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'Wazow');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], '*Wazow');
    expect(result.length).toBe(1);
  }));
});