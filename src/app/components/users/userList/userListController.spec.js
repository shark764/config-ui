describe('regExpReplace function', function(){
  var scope,
    $compile,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$filter', function(_$compile_, $rootScope) {
    scope = $rootScope.$new();
    $compile = _$compile_;

    element = $compile('<user-table users="users"></user-table>')(scope);
    scope.$digest();
  }]));

  it('should replace asterisk with .*', inject(function() {
    expect(element.isolateScope().regExpReplace('*H*e*l*l*o*')).toEqual('.*H.*e.*l.*l.*o.*');
  }));
});

describe('searchUser function', function(){
  var scope,
    $filter,
    $compile,
    element,
    users;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope, _$filter_) {
    $filter = _$filter_;
    scope = $rootScope.$new();
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
    $compile = _$compile_;
    scope.users = users;

    element = $compile('<user-table users="users"></user-table>')(scope);
    scope.$digest();
  }]));

  it('should return user if search is blank', inject(function() {
    element.isolateScope().queryUser ='';
    var result = element.isolateScope().searchUser(users[0]);
    expect(result).toBeTruthy();
  }));

  it('should not return user if search not included in user values', inject(function() {
    element.isolateScope().queryUser ='blahh';
    var result = element.isolateScope().searchUser(users[0]);
    expect(result).toBeFalsy();
  }));

    it('should return user if search is included in user first name', inject(function() {
      element.isolateScope().queryUser ='ike';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return user if search is included in user first and last name', inject(function() {
      element.isolateScope().queryUser ='Mike Wazowski';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return user if search is included in user last name', inject(function() {
      element.isolateScope().queryUser ='ski';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should not return part search is included in user values', inject(function() {
      element.isolateScope().queryUser ='Michael Wazowski';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should return user if search has wildcard value only', inject(function() {
      element.isolateScope().queryUser ='*';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return user with containing partial string using wildcard in user', inject(function() {
      element.isolateScope().queryUser ='Mi*Wazowski';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should only return user containing partial strings using several wildcards in user', inject(function() {
      element.isolateScope().queryUser ='i*e*a';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();

      element.isolateScope().queryUser ='i*l*e*a';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should return user regardless of character case', inject(function() {
      element.isolateScope().queryUser ='MIKE wAzoWsKi';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should not return user when search string does not match any user details', inject(function() {
      element.isolateScope().queryUser ='Randall Boggs';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should not return user when search string with wild cards does not match any user', inject(function() {
      element.isolateScope().queryUser ='*boo*';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should not use the asterisk as a repeat operator', inject(function() {
      element.isolateScope().queryUser ='q*';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should use the asterisk as 0 or more of any valid character', inject(function() {
      element.isolateScope().queryUser ='M*i*W*a*z*o*i';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return the same result regardless of wildcard repeats', inject(function() {
      element.isolateScope().queryUser ='M*****';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return the same result for strings starting and ending with wildcard', inject(function() {
      element.isolateScope().queryUser ='*Wazow*';
      var result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();

      element.isolateScope().queryUser ='*Wazow*';
      result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();

      element.isolateScope().queryUser ='Wazow';
      result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();

      element.isolateScope().queryUser ='Wazow*';
      result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();

      element.isolateScope().queryUser ='*Wazow';
      result = element.isolateScope().searchUser(users[0]);
      expect(result).toBeTruthy();
    }));
});
