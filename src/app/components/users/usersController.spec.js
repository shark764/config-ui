'use strict';

/* global jasmine: false  */

describe('userTable directive', function(){
  var $scope,
    $httpBackend,
    users;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$injector', '$controller', 'apiHostname', function($compile, $rootScope, $injector, $controller, apiHostname) {
    users  = [ {
      'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39',
      'status': false,
      'externalId': 73795,
      'state': 'WRAP',
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'email': 'munoz.lowe@hivedom.org',
      'displayName': 'Munoz Lowe'
    },
    {
      'id': '9f97f9d9-004c-469c-906d-b917bd79fbe8',
      'status': true,
      'externalId': 80232,
      'state': 'NOT_READY',
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'email': 'michael.oliver@ezent.io',
      'displayName': 'Michael Oliver'
    }];

    //Need the following so that $digest() works
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', apiHostname + '/v1/users').respond({'result' : users});
    $httpBackend.expectGET(apiHostname + '/v1/users');

    $scope = $rootScope.$new();
    $scope.users = users;

    $controller('UsersController', {'$scope': $scope});
    $httpBackend.flush();
  }]));

  it('should have users', inject(function() {
    expect($scope.users).toBeDefined();
    expect($scope.users.length).toEqual(2);
  }));

  it('should fetch initial list of users', inject(function() {
    expect($scope.users).toBeDefined();
    expect($scope.users.length).toEqual(users.length);
  }));

  it('should have statuses and states objects', inject(function() {
    expect($scope.statuses).toBeDefined();
    expect($scope.statuses).toEqual(jasmine.any(Object));

    expect($scope.states).toBeDefined();
    expect($scope.states).toEqual(jasmine.any(Object));
  }));
});
