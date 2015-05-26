'use strict';

/* global jasmine: false  */

describe('userTable directive', function(){
  var $scope,
    $compile,
    element;

  var users = [ {
    'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39',
    'status': false,
    'updatedBy': 'b9a14681-9912-437d-b72b-320bbebfa40c',
    'externalId': 73795,
    'extension': 9969,
    'state': 'WRAP',
    'created': 'Wed Nov 07 2001 21:32:07 GMT+0000 (UTC)',
    'lastName': 'Lowe',
    'firstName': 'Munoz',
    'updated': 'Sun Aug 31 1997 19:52:45 GMT+0000 (UTC)',
    'email': 'munoz.lowe@hivedom.org',
    'displayName': 'Munoz Lowe',
    'password': '',
    'createdBy': '02f1eeff-8204-4902-9f4c-7960db3795fa',
    'role': 'Administrator'
  },
  {
    'id': '9f97f9d9-004c-469c-906d-b917bd79fbe8',
    'status': true,
    'updatedBy': '52fcfff0-b35f-4ba3-94b8-964511671045',
    'externalId': 80232,
    'extension': 5890,
    'state': 'NOT_READY',
    'created': 'Sat Apr 12 2008 07:40:10 GMT+0000 (UTC)',
    'lastName': 'Oliver',
    'firstName': 'Michael',
    'updated': 'Sat Nov 07 1970 10:53:22 GMT+0000 (UTC)',
    'email': 'michael.oliver@ezent.io',
    'displayName': 'Michael Oliver',
    'password': '',
    'createdBy': 'b8e5d096-f828-4269-ae5a-117e69917340',
    'role': 'Administrator'
  }];

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $scope.users = users;

    element = $compile('<user-table users="users"></user-table>')($scope);
    $scope.$digest();
  }]));

  it('should insert a row for each user, plus a header row', inject(function() {
    expect(element.find('tr').length).toEqual(users.length + 1);
  }));

  it('should have an updateUsers function', inject(function() {
    expect(element.isolateScope().updateUsers).toBeDefined();
    expect(element.isolateScope().updateUsers).toEqual(jasmine.any(Function));
  }));

  it('should have statuses and states objects', inject(function() {
    expect(element.isolateScope().statuses).toBeDefined();
    expect(element.isolateScope().statuses).toEqual(jasmine.any(Object));

    expect(element.isolateScope().states).toBeDefined();
    expect(element.isolateScope().states).toEqual(jasmine.any(Object));
  }));
});

describe('userFilter filter', function(){
  var $filter,
      users;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$filter', '$rootScope', function(_$filter_) {
    $filter = _$filter_;
    users = [ {
      'status': false,
      'state': 'WRAP',
      'value': 4
    },
    {
      'status': true,
      'state': 'NOT_READY',
      'value' : '5'
    },
    {
      'status': 'true',
      'state': 'READY',
      'value' : '6'
    },
    {
      'status': true,
      'state': 'WRAP',
      'value' : 4
    }];
  }]));

  it('should return all users if the all value is checked', inject(function() {
    var filters = {all : {value: 'all', checked: true}, filters : [{value: 'false', checked: false}, {value : 'true', checked: false}]};
    var result = $filter('userFilter')(users, filters, 'status');
    expect(result.length).toEqual(users.length);
  }));

  it('should return an empty array when no filters are selected and "all" is not selected', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'false', checked: false}, {value : 'true', checked: false}]};
    var result = $filter('userFilter')(users, filters, 'status');
    expect(result.length).toEqual(0);
  }));

  it('should allow the all option to be optional', inject(function() {
    var filters = {filters : [{value: 'false', checked: true}, {value : 'true', checked: false}]};
    var result = $filter('userFilter')(users, filters, 'status');
    expect(result.length).toEqual(1);
  }));

  it('should return users that match one selected filter', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'false', checked: true}, {value : 'true', checked: false}]};
    var result = $filter('userFilter')(users, filters, 'status');
    expect(result.length).toEqual(1);
  }));

  it('should return users that match one of many selected filters', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'WRAP', checked: true}, {value : 'READY', checked: false}, {value: 'NOT_READY', checked: true}]};
    var result = $filter('userFilter')(users, filters, 'state');
    expect(result.length).toEqual(3);
  }));

  it('should return an empty array if no users match the filters', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'SOMETHINGELSE', checked: true}, {value : 'READY', checked: false}]};
    var result = $filter('userFilter')(users, filters, 'state');
    expect(result.length).toEqual(0);
  }));

  it('should work with string and primitive values in the field', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: 'true', checked: true}, {value : 'false', checked: false}]};
    var result = $filter('userFilter')(users, filters, 'status');
    expect(result.length).toEqual(3);
  }));

  it('should return users missing values when "all" is selected', inject(function() {
    var filters = {all : {value: 'all', checked: true}, filters : [{value: '5', checked: false}, {value : '4', checked: false}]};
    users.push({});

    var result = $filter('userFilter')(users, filters, 'value');
    expect(result.length).toEqual(5);
  }));

  it('should not return users who are missing values when "all" is not selected', inject(function() {
    var filters = {all : {value: 'all', checked: false}, filters : [{value: '5', checked: true}, {value : '4', checked: false}]};
    users.push({});

    var result = $filter('userFilter')(users, filters, 'value');
    expect(result.length).toEqual(1);
  }));
});

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
      result = element.isolateScope().searchUser(users[0]);
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
