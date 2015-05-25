'use strict';

describe('userListController controller', function(){
  var scope,
    controller,
    $httpBackend,
    users = [ {
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
  
  beforeEach(inject(['$controller', '$rootScope', '$injector', function($controller, $rootScope, $injector) {
    scope = $rootScope;

    //Need the following so that $digest() works
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', 'http://fakendpoint.com/v1/users').respond({'result' : users});
    
    $httpBackend.expectGET('http://fakendpoint.com/v1/users');
    controller = $controller('UserListController', {$scope : scope});
    $httpBackend.flush();

  }]));
  
  describe('initialization', function(){
    it('should fetch initial list of users', inject(function() {
      expect(scope.users).toBeDefined();
      expect(scope.users.length).toEqual(users.length);
    }));
  });
  
  describe('checkedUsers', function(){
    it('should be empty by default', inject(function() {
      expect(scope.checkedUsers.length).toBeDefined();
      expect(scope.checkedUsers.length).toEqual(0);
    }));
    
    it('should contain a user when a user\'s checked value is set to true', inject(function() {
      expect(scope.checkedUsers.length).toEqual(0);
      scope.users[0].checked = true;
      scope.$digest();
      
      expect(scope.checkedUsers.length).toEqual(1);
      expect(scope.checkedUsers[0]).toEqual(scope.users[0]);
    }));
    
    it('should remove a user when a user\'s checked value is set to false', inject(function() {
      scope.users[0].checked = true;
      scope.$digest();
      
      expect(scope.checkedUsers.length).toEqual(1);
      
      scope.users[0].checked = false;
      scope.$digest();
      
      expect(scope.checkedUsers.length).toEqual(0);
    }));
  });
  
  describe('enableChecked batch operation', function(){
    it('should be defined', inject(function() {
      expect(scope.enableChecked).toBeDefined();
      expect(scope.enableChecked).toEqual(jasmine.any(Function));
    }));
  });
  
  describe('disableChecked batch operation', function(){
    it('should be defined', inject(function() {
      expect(scope.disableChecked).toBeDefined();
      expect(scope.disableChecked).toEqual(jasmine.any(Function));
    }));
  });
  
  describe('regExpReplace function', function(){
    it('should replace asterisk with .*', inject(function() {
      expect(scope.regExpReplace('*H*e*l*l*o*')).toEqual('.*H.*e.*l.*l.*o.*');
    }));
  });
});

describe('userListController searchUser function', function(){
  var scope,
    $filter,
    controller,
    users;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$filter', '$controller', function($rootScope, _$filter_, $controller) {
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
    scope.users = users;
    controller = $controller('UserListController', {$scope : scope});
    
  }]));

  it('should return user if search is blank', inject(function() {
    scope.queryUser ='';
    var result = scope.searchUser(users[0]);
    expect(result).toBeTruthy();
  }));

  it('should not return user if search not included in user values', inject(function() {
    scope.queryUser ='blahh';
    var result = scope.searchUser(users[0]);
    expect(result).toBeFalsy();
  }));

    it('should return user if search is included in user first name', inject(function() {
      scope.queryUser ='ike';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return user if search is included in user first and last name', inject(function() {
      scope.queryUser ='Mike Wazowski';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return user if search is included in user last name', inject(function() {
      scope.queryUser ='ski';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should not return part search is included in user values', inject(function() {
      scope.queryUser ='Michael Wazowski';
      var result = scope.searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should return user if search has wildcard value only', inject(function() {
      scope.queryUser ='*';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return user with containing partial string using wildcard in user', inject(function() {
      scope.queryUser ='Mi*Wazowski';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should only return user containing partial strings using several wildcards in user', inject(function() {
      scope.queryUser ='i*e*a';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();

      scope.queryUser ='i*l*e*a';
      var result = scope.searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should return user regardless of character case', inject(function() {
      scope.queryUser ='MIKE wAzoWsKi';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should not return user when search string does not match any user details', inject(function() {
      scope.queryUser ='Randall Boggs';
      var result = scope.searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should not return user when search string with wild cards does not match any user', inject(function() {
      scope.queryUser ='*boo*';
      var result = scope.searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should not use the asterisk as a repeat operator', inject(function() {
      scope.queryUser ='q*';
      var result = scope.searchUser(users[0]);
      expect(result).toBeFalsy();
    }));

    it('should use the asterisk as 0 or more of any valid character', inject(function() {
      scope.queryUser ='M*i*W*a*z*o*i';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return the same result regardless of wildcard repeats', inject(function() {
      scope.queryUser ='M*****';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));

    it('should return the same result for strings starting and ending with wildcard', inject(function() {
      scope.queryUser ='*Wazow*';
      var result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();

      scope.queryUser ='*Wazow*';
      result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();

      scope.queryUser ='Wazow';
      result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();

      scope.queryUser ='Wazow*';
      result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();

      scope.queryUser ='*Wazow';
      result = scope.searchUser(users[0]);
      expect(result).toBeTruthy();
    }));
});
