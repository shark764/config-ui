'use strict';

var $scope, $state, $httpBackend, apiHostname;

describe('LoginController', function () {
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$q', '$timeout', '$rootScope', '$controller', '$state', '$httpBackend', 'apiHostname',
    function ($q, $timeout, _$rootScope_, _$controller_, _$state, _$httpBackend_, _apiHostname_) {
      $scope = _$rootScope_;
      $state = _$state;
      $httpBackend = _$httpBackend_;
      apiHostname = _apiHostname_;

      _$controller_('LoginController', {
        '$scope': $scope
      });
    }
  ]));

  describe('LoginController login success', function () {


    it('should redirect me to root on success', function () {
      $scope.username = 'username';
      $scope.password = 'password';

      $httpBackend.when('POST', apiHostname + '/v1/login').respond(200,
        {
          result : {
            user: {

            },
            tenants: []
          }
        }
      );

      $scope.login();
      $httpBackend.flush();


      expect($state.current.name).toBe('content.management.users');
    });
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
