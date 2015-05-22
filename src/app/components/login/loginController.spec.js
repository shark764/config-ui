'use strict';

/* global spyOn: false */

describe('LoginController', function() {
    var $scope, $location, $compile, $controller, authService, createController, session;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$compile', '$rootScope', '$location', '$controller', 'AuthService', 'Session', function(_$compile_, _$rootScope_, _$location_, _$controller_, _authService_, _session_) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $location = _$location_;
      $controller = _$controller_;
      authService = _authService_;
      session = _session_;

      createController = function () {
          return $controller('LoginController', {
              '$scope': $scope,
          });
      };

    }]));

    it('should have a method to login the user and redirect them to the root', function() {
        createController();

        spyOn(authService, 'login');

        $scope.username = 'blah';
        $scope.password = 'blah';

        $scope.login();

        expect($location.path()).toBe('/');
        expect(authService.login).toHaveBeenCalled();
    });
});