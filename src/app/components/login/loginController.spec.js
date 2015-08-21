'use strict';

var $scope, $state, $httpBackend, apiHostname;

describe('LoginController', function () {
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$q', '$rootScope', '$controller', '$state', '$httpBackend', 'apiHostname',
    function ($q, _$rootScope_, _$controller_, _$state, _$httpBackend_, _apiHostname_) {
      $scope = _$rootScope_;
      $state = _$state;
      $httpBackend = _$httpBackend_;
      apiHostname = _apiHostname_;

      _$controller_('LoginController', {
        '$scope': $scope
      });

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});
    }
  ]));

  describe('LoginController login success', function () {
    it('should redirect me to root on success', inject(['$q', 'AuthService', function ($q, AuthService) {
      $scope.username = 'username';
      $scope.password = 'password';

      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      spyOn($state, 'go');

      $scope.login();
      $scope.$digest();
      
      expect($state.go).toHaveBeenCalledWith('content.management.users');
    }]));
  });

  describe('LoginController login fail', function () {

    it('should not redirect me on 401 and show authentication error', function () {

      $httpBackend.when('POST', apiHostname + '/v1/login').respond(401, {
        error: 'Invalid username and password.'
      });

      $scope.username = 'username';
      $scope.password = 'password';

      $scope.login();
      $httpBackend.flush();

      expect($state.current.name).toBe('login');
    });

    it('should not redirect me 500 and do nothing', function () {

      $httpBackend.when('POST', apiHostname + '/v1/login').respond(500);

      $scope.username = 'username';
      $scope.password = 'password';

      $scope.login();
      $httpBackend.flush();

      expect($state.current.name).toBe('login');
    });
  });
});
