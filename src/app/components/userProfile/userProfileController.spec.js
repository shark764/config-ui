'use strict';

describe('UserProfileController', function() {
  var $scope,
    $controller,
    apiHostname,
    $httpBackend,
    controller;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'User', 'Skill', 'Group', 'apiHostname',
    function($rootScope, _$controller_, _$httpBackend_, User, Skill, Group, _apiHostname_) {
      $scope = $rootScope.$new();
      apiHostname = _apiHostname_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;

      controller = $controller('UserProfileController', {
        '$scope': $scope
      });
      $httpBackend.flush();
    }
  ]));

  it('should load the user from the id in session', function() {
    expect($scope.tenantUser).toBeDefined();
  });

  it('should load the user profile info for userId1 and tenant-id', function() {
    expect($scope.tenantUser).toBeDefined();

    expect($scope.tenantUser.id).toEqual('userId1');
    expect($scope.tenantUser.email).toEqual('munoz.lowe@hivedom.org');
    expect($scope.tenantUser.$skills.length).toEqual(0);
    expect($scope.tenantUser.$groups.length).toEqual(0);
  });

  describe('submit function', function() {

    it('should exists', function() {
      expect($scope.submit).toBeDefined();
    });

    it('should PUT to /v1/users on submit', function() {
      $httpBackend.expect('PUT', apiHostname + '/v1/users/userId1').respond(200);
      $scope.userForm = {
        password : {
          $setPristine : jasmine.createSpy('$setPristine')
        }
     }; 
      
      $scope.submit();

      $httpBackend.flush();
    });
  });
});
