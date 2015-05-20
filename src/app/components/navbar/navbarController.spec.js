'use strict';

describe('NavbarController', function() {
    var $scope, $location, $compile, $controller, authService, createController;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$compile', '$rootScope', '$location', '$controller', 'AuthService', function(_$compile_, _$rootScope_, _$location_, _$controller_, _$authService_) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $location = _$location_;
      $controller = _$controller_;
      authService = _$authService_;

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
        $scope.logout();
        expect($location.path()).toBe('/login');
    });
});