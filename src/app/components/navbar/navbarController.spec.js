'use strict';

describe('NavbarController', function() {
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
          return $controller('NavbarController', {
              '$scope': $scope,
          });
      };

    }]));

    it('should have a method to check if the path is active', function() {
        var controller = createController();
        $location.path('/users');

        expect($location.path()).toBe('/users');
        expect($scope.isActive('/users')).toBe(true);
        expect($scope.isActive('/contact')).toBe(false);
    });

    it('should have a method to log the user out and redirect them to the login page', function() {
        var controller = createController();
        $location.path('/users');
        session.set('abc', 'John');

        expect(session.isAuthenticated).toBe(true);
        expect($location.path()).toBe('/users');

        $scope.logout();

        expect(session.isAuthenticated).toBe(false);
        expect($location.path()).toBe('/login');
    });
});