'use strict';

/* global jasmine: false  */

describe('batchButtonsDirective', function(){
  var $scope,
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
    
    $scope = $rootScope.$new();
    $scope.users = users;
    $scope.numChecked = 0;
    element = $compile('<batch-buttons users="users"></batch-buttons>')($scope);
    $scope.$digest();
  }]));
  
  describe('enableChecked batch operation', function(){
    it('should be defined', inject(function() {
      expect(element.isolateScope().enableChecked).toBeDefined();
      expect(element.isolateScope().enableChecked).toEqual(jasmine.any(Function));
    }));
    
    it('should should update only checked users', inject(function() {
      $scope.users[0].checked = true;
      $scope.users[0].status = false;
      $scope.users[1].status = false;
      element.isolateScope().enableChecked();
      
      expect($scope.users[0].status).toBeTruthy();
      expect($scope.users[1].status).toBeFalsy();
    }));
    
    it('should skip users that are marked as filtered even if they\'re checked', inject(function() {
      $scope.users[0].filtered = true;
      $scope.users[0].checked = true;
      element.isolateScope().enableChecked();
      
      expect($scope.users[0].status).toBeFalsy();
      
      $scope.users[0].filtered = true;
      $scope.users[0].checked = true;
      $scope.users[0].status = false;
      element.isolateScope().enableChecked();
      
      expect($scope.users[0].status).toBeFalsy();
    }));
  });
  
  describe('disableChecked batch operation', function(){
    it('should be defined', inject(function() {
      expect(element.isolateScope().disableChecked).toBeDefined();
      expect(element.isolateScope().disableChecked).toEqual(jasmine.any(Function));
    }));
    
    it('should should update only checked users', inject(function() {
      $scope.users[0].checked = true;
      $scope.users[0].status = true;
      $scope.users[1].status = true;
      element.isolateScope().disableChecked();
      
      expect($scope.users[0].status).toBeFalsy();
      expect($scope.users[1].status).toBeTruthy();
    }));
    
    it('should skip users that are marked as filtered', inject(function() {
      $scope.users[0].filtered = true;
      $scope.users[0].checked = true;
      $scope.users[0].status = true;
      element.isolateScope().disableChecked();
      
      expect($scope.users[0].status).toBeTruthy();
    }));
  });
});