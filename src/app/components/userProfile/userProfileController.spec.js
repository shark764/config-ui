'use strict';

describe('UserProfileController', function() {
  var $scope,
    apiHostname,
    $httpBackend,
    controller;

  beforeEach(module('liveopsConfigPanel', 'gulpAngular', 'liveopsConfigPanel.mock', 
      'liveopsConfigPanel.tenant.user.mock', 'liveopsConfigPanel.user.mock', 'liveopsConfigPanel.mockutils'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname',
    function($rootScope, $controller, _$httpBackend, _apiHostname) {
      $scope = $rootScope.$new();
      apiHostname = _apiHostname;
      $httpBackend = _$httpBackend;

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

    it('should PUT to /v1/users on submit', inject(function(mockForm) {
      $httpBackend.expect('PUT', apiHostname + '/v1/users/userId1').respond(200);
      $scope.userForm = mockForm(['password']);

      $scope.submit();

      $httpBackend.flush();
    }));

    it('should update your existing token', inject(function(Session, mockModel) {
      $httpBackend.expect('PUT', apiHostname + '/v1/users/userId1').respond(200);
      $scope.userForm = {
        password: mockModel()
      };
      
      $scope.userForm.password.$dirty = true;
      $scope.tenantUser.$user.password = 'password1';
      var currentToken = Session.token;

      $scope.submit();

      $httpBackend.flush();

      expect(currentToken).not.toEqual(Session.token);
    }));
  });
});
