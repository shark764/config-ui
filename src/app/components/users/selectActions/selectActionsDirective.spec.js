'use strict';

/* global jasmine: false  */

describe('selectActionsDirective', function(){
  var scope,
    users,
    element;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  
  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
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
    
    var $scope = $rootScope.$new();
    $scope.users = users;
    element = $compile('<select-actions users="users"></select-actions>')($scope);
    $scope.$digest();
    scope = element.isolateScope();
  }]));
  
  describe('selectAll function', function(){
    it('should be defined', inject(function() {
      expect(scope.selectAll).toBeDefined();
      expect(scope.selectAll).toEqual(jasmine.any(Function));
    }));
    
    it('should skip users that are marked as filtered', inject(function() {
      scope.users[0].filtered = true;
      scope.selectAll();
      
      expect(scope.users[0].checked).toBeFalsy();
    }));
    
    it('should mark all nonfiltered users as checked', inject(function() {
      scope.selectAll();
      
      expect(scope.users[0].checked).toBeTruthy();
      expect(scope.users[1].checked).toBeTruthy();
    }));
  });
  
  describe('selectNone function', function(){
    it('should be defined', inject(function() {
      expect(scope.selectNone).toBeDefined();
      expect(scope.selectNone).toEqual(jasmine.any(Function));
    }));
    
    it('should remove checked flag from all users', inject(function() {
      scope.users[0].checked = true;
      scope.selectNone();
      
      expect(scope.users[0].checked).toBeFalsy();
      expect(scope.users[1].checked).toBeFalsy();
    }));
  });
});