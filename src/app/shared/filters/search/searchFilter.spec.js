'use strict';

describe('search filter', function(){
  var filter,
    users;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$filter', function($filter) {
    users = [ {
        'id': '3',
        'status': false,
        'state': 'WRAP',
        'lastName': 'Wazowski',
        'firstName': 'Mike',
        'email': 'mike.Wazowski@hivedom.org',
        'displayName': 'Mike Wazowski'
      }];

    filter = $filter('search');
    
  }]));

  it('should return all items if search is blank', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], '');
    expect(result.length).toBe(1);
  }));
  
  it('should return all items if fields are blank', inject(function() {
    var result = filter(users, null, 'ssssss');
    expect(result.length).toBe(1);
  }));

  it('should not return item if search not included in item\'s values', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'blahh');
    expect(result.length).toBe(0);
  }));

  it('should return item if search is included in first given field', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'ike');
    expect(result.length).toBe(1);
  }));

  it('should return item if search is included in multiple given fields', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Mike Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should return item if search is included in last given field', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'ski');
    expect(result.length).toBe(1);
  }));

  it('should not return if only part search is included in item fields', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Michael Wazowski');
    expect(result.length).toBe(0);
  }));

  it('should return item if search has wildcard value only', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], '*');
    expect(result.length).toBe(1);
  }));

  it('should return item with containing partial string using wildcard in query', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Mi*Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should only return item containing partial strings using several wildcards in query', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'i*e*a');
    expect(result.length).toBe(1);

    result = filter(users, ['firstName', 'lastName'], 'i*l*e*a');
    expect(result.length).toBe(0);
  }));

  it('should return matching item regardless of character case', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'MIKE wAzoWsKi');
    expect(result.length).toBe(1);
  }));

  it('should not return item when search string does not match any fields', inject(function() {
    var result = filter(users, ['firstName', 'lastName'], 'Randall Boggs');
    expect(result.length).toBe(0);
  }));

  it('should not return item when search string with wild cards does not match any fields', inject(function() {
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
  
  describe('on multiple items', function(){
    beforeEach(function(){
      users = [ {
        'id': '3',
        'status': 'true',
        'state': 'WRAP',
        'lastName': 'Wazowski',
        'firstName': 'Mike',
        'email': 'mike.Wazowski@hivedom.org',
        'displayName': 'Mike Wazowski'
      },{
        'id': '7',
        'status': true,
        'state': 'OFFLINE',
        'lastName': 'Walter',
        'firstName': 'Serge',
        'email': 'serge.walter@example.com',
        'displayName': 'Serge Walter'
      }];
    });
    
    it('should return multiple results if they match', inject(function() {
      
      var result = filter(users, ['firstName', 'lastName'], 'w');
      expect(result.length).toBe(2);
    }));
    
    it('should onyl matching results', inject(function() {
      
      var result = filter(users, ['firstName', 'lastName'], 's');
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(users[1]);
    }));
    
    it('should return results matching string and primitive fields', inject(function() {
      
      var result = filter(users, ['status'], 'tru');
      expect(result.length).toBe(2);
    }));
  });
});