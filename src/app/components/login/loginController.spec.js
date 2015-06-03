'use strict';

var $scope, $location, AuthServiceMock;

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
  beforeEach(module('liveopsConfigPanel', function ($provide) {
    AuthServiceMock = {};
    $provide.value('AuthService', AuthServiceMock);
  }));

  beforeEach(inject(['$q', '$timeout', '$rootScope', '$controller', '$location',
    function ($q, $timeout, _$rootScope_, _$controller_, _$location_) {
      $scope = _$rootScope_;
      $location = _$location_;

      _$controller_('LoginController', {
        '$scope': $scope
      });
    }
  ]));

  describe('LoginController login success', function () {
    beforeEach(function () {
      AuthServiceMock.login = function () {
        return {
          then: function (callback) {
            return callback({
              user: USER,
              token: TOKEN
            });
          }
        };
      };
    });

    it('should redirect me to root on success', function () {
      $scope.username = 'username';
      $scope.password = 'password';

      $scope.login();

      expect($location.path()).toBe('/');
    });
  });

  describe('LoginController login fail', function () {
    beforeEach(function () {
      AuthServiceMock.login = function () {
        return {
          then: function (callback, fail) {
            return fail();
          }
        };
      };
    });

    it('should not redirect me on fail', function () {


      $scope.username = 'username';
      $scope.password = 'password';

      $scope.login();

      expect($location.path()).toBe('');
    });
  });
});