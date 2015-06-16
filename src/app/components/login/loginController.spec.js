'use strict';

var $scope, $state, $httpBackend, AuthServiceMock, apiHostname;

var USER = {
  'role': 'admin',
  'email': 'titan@liveops.com',
  'createdBy': '00000000-0000-0000-0000-000000000000',
  'displayName': 'titan',
  'updated': '2015-06-02T08:29:03Z',
  'firstName': 'titan',
  'created': '2015-06-02T08:29:03Z',
  'state': null,
  'extension': null,
  'externalId': null,
  'updatedBy': '00000000-0000-0000-0000-000000000000',
  'status': true,
  'id': '6d094710-0901-11e5-87f2-b1d420920055',
  'lastName': 'user'
};

var TOKEN = 'generated-token';

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

    it('should not redirect me on fail', function () {

      $httpBackend.when('POST', apiHostname + '/v1/login').respond(401);

      $scope.username = 'username';
      $scope.password = 'password';

      $scope.login();
      $httpBackend.flush();

      expect($state.current.name).toBe('login');
    });
  });
});
