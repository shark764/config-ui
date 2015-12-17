'use strict';

describe('duplicateEmail directive', function() {
  var $scope,
    isolateScope,
    ngModel;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));
  beforeEach(module('liveopsConfigPanel.user.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'mockUsers', 'mockTenantUsers',
    function($compile, $rootScope, mockUsers, mockTenantUsers) {
      $scope = $rootScope.$new();
      
      $scope.fetchTenantUsers = jasmine.createSpy('$scope.fetchTenantUsers').and.returnValue(
        [mockTenantUsers[0], mockTenantUsers[1]]);
      
      $scope.resource = mockUsers[0];
      
      var element = angular.element('<div ng-model="resource.email" ng-resource="resource" duplicate-email></div>');
      
      $compile(element)($scope);
      
      $scope.$digest();
      isolateScope = element.scope();
      
      ngModel = element.controller('ngModel');
    }
  ]));

  describe('ON $validators.duplicateEmail', function() {
    it('should be defined', function() {
      expect(ngModel.$validators.duplicateEmail).toBeDefined();
    });
    
    it('should return true if email is in fetchTenantUsers()', inject(['mockTenantUsers', function(mockTenantUsers) {
      isolateScope.$emit = jasmine.createSpy('$emit');
      
      var result = ngModel.$validators.duplicateEmail('munoz.lowe@hivedom.org');
      
      expect(result).toBeFalsy();
      expect(isolateScope.$emit).toHaveBeenCalledWith('email:validator:found', mockTenantUsers[0]);
    }]));
    
    it('should return true if email is in fetchTenantUsers()', inject([function() {
      var result = ngModel.$validators.duplicateEmail('test1@bluespurs.com');
      
      expect(result).toBeTruthy();
    }]));
  });
  
  describe('ON $asyncValidators.duplicateEmail', function() {
    var $httpBackend,
      apiHostname,
      mockUsers;
      
    beforeEach(inject(['$httpBackend', 'apiHostname', 'mockUsers',
      function(_$httpBackend, _apiHostname, _mockUsers) {
        $httpBackend = _$httpBackend;
        apiHostname = _apiHostname;
        mockUsers = _mockUsers;
        
        ngModel.$isEmpty = jasmine.createSpy('$isEmpty').and.returnValue(false);
    }]));
    
    it('should return a promise', function() {
      var result = ngModel.$asyncValidators.duplicateEmail('test1@bluespurs.com');
      expect(result.then).toBeDefined();
    });
    
    it('should resolve the promise without going to the API', function(done) {
      ngModel.$isEmpty = jasmine.createSpy('$isEmpty').and.returnValue(true);
      
      var result = ngModel.$asyncValidators.duplicateEmail();
      
      result.then(function() {
        done();
      });
        
      isolateScope.$apply();
    });
    
    it('should reject the promise WHEN query returns 200', function(done) {
      $httpBackend.expect('GET', apiHostname + '/v1/users?email=' + mockUsers[0].email).respond(200, [mockUsers[0]]);
      
      var result = ngModel.$asyncValidators.duplicateEmail(mockUsers[0].email);
      
      result.then(null, function() {
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should resolve the promise WHEN query returns 404', function(done) {
      $httpBackend.expect('GET', apiHostname + '/v1/users?email=' + mockUsers[0].email).respond(404);
      
      var result = ngModel.$asyncValidators.duplicateEmail(mockUsers[0].email);
      
      result.then(function() {
        done();
      });
      
      $httpBackend.flush();
    });
    
    it('should resolve the promise WHEN query returns 4**', function(done) {
      $httpBackend.expect('GET', apiHostname + '/v1/users?email=' + mockUsers[0].email).respond(400, {
        error: {
          attribute: {
            email: 'invalid email'
          }
        }
      });
      
      var result = ngModel.$asyncValidators.duplicateEmail(mockUsers[0].email);
      
      result.then(function() {
        done();
      });
      
      $httpBackend.flush();
    });
  });
});
