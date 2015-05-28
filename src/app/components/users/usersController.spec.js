'use strict';

describe('userController controller', function(){
  var scope,
    $rootScope,
    controller,
    $httpBackend,
    users;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  
  beforeEach(inject(['$controller', '$rootScope', '$injector', function($controller, _$rootScope_, $injector) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

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
    
    //Need the following so that $digest() works
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', 'fakendpoint.com/v1/users').respond({'result' : users});
    
    $httpBackend.expectGET('fakendpoint.com/v1/users');
    controller = $controller('UsersController', {$scope : scope});
    $httpBackend.flush();


  }]));
  

  it('should fetch initial list of users', inject(function() {
    expect(scope.users).toBeDefined();
    expect(scope.users.length).toEqual(users.length);
  }));

  it('should call updateUser when recieving the user:update event', inject(function() {
    spyOn(scope, 'updateUser');
    
    $rootScope.$broadcast('user:update', {userId : 1, data: {}});
    expect(scope.updateUser).toHaveBeenCalled();
  }));
  
  describe('hasChecked tracking', function(){
    it('should have nothing checked to start', inject(function() {
      expect(scope.hasChecked).toEqual(0);
    }));
    
    it('should catch the userList:user:checked event', inject(function() {
      scope.$broadcast('userList:user:checked');
      expect(scope.hasChecked).toEqual(1);
    }));
    
    it('should catch the userList:user:unchecked event', inject(function() {
      scope.hasChecked = 1;
      scope.$broadcast('userList:user:unchecked');
      expect(scope.hasChecked).toEqual(0);
    }));
    
    it('should catch the userList:user:uncheckAll event and reset hasChecked', inject(function() {
      scope.hasChecked = 5;
      scope.$broadcast('userList:user:uncheckAll');
      expect(scope.hasChecked).toEqual(0);
    }));
    
    it('should never go below 0', inject(function() {
      scope.$broadcast('userList:user:unchecked');
      expect(scope.hasChecked).toEqual(0);
    }));
  });
});

describe('userListController searchUser filter', function(){
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

    filter = $filter('UserSearchFilter');
    
  }]));

  it('should return user if search is blank', inject(function() {
    var result = filter(users, '');
    expect(result.length).toBe(1);
  }));

  it('should not return user if search not included in user values', inject(function() {
    var result = filter(users, 'blahh');
    expect(result.length).toBe(0);
  }));

  it('should return user if search is included in user first name', inject(function() {
    var result = filter(users, 'ike');
    expect(result.length).toBe(1);
  }));

  it('should return user if search is included in user first and last name', inject(function() {
    var result = filter(users, 'Mike Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should return user if search is included in user last name', inject(function() {
    var result = filter(users, 'ski');
    expect(result.length).toBe(1);
  }));

  it('should not return part search is included in user values', inject(function() {
    var result = filter(users, 'Michael Wazowski');
    expect(result.length).toBe(0);
  }));

  it('should return user if search has wildcard value only', inject(function() {
    var result = filter(users, '*');
    expect(result.length).toBe(1);
  }));

  it('should return user with containing partial string using wildcard in user', inject(function() {
    var result = filter(users, 'Mi*Wazowski');
    expect(result.length).toBe(1);
  }));

  it('should only return user containing partial strings using several wildcards in user', inject(function() {
    var result = filter(users, 'i*e*a');
    expect(result.length).toBe(1);

    result = filter(users, 'i*l*e*a');
    expect(result.length).toBe(0);
  }));

  it('should return user regardless of character case', inject(function() {
    var result = filter(users, 'MIKE wAzoWsKi');
    expect(result.length).toBe(1);
  }));

  it('should not return user when search string does not match any user details', inject(function() {
    var result = filter(users, 'Randall Boggs');
    expect(result.length).toBe(0);
  }));

  it('should not return user when search string with wild cards does not match any user', inject(function() {
    var result = filter(users, '*boo*');
    expect(result.length).toBe(0);
  }));

  it('should not use the asterisk as a repeat operator', inject(function() {
    var result = filter(users, 'q*');
    expect(result.length).toBe(0);
  }));

  it('should use the asterisk as 0 or more of any valid character', inject(function() {
    var result = filter(users, 'M*i*W*a*z*o*i');
    expect(result.length).toBe(1);
  }));

  it('should return the same result regardless of wildcard repeats', inject(function() {
    var result = filter(users, 'M*****');
    expect(result.length).toBe(1);
  }));

  it('should return the same result for strings starting and ending with wildcard', inject(function() {
    var result = filter(users, '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, '*Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, 'Wazow');
    expect(result.length).toBe(1);

    result = filter(users, 'Wazow*');
    expect(result.length).toBe(1);

    result = filter(users, '*Wazow');
    expect(result.length).toBe(1);
  }));
});
