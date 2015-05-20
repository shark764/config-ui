'use strict';

angular.module('liveopsConfigPanel')
    .controller('NavbarController', function ($scope, $location, AuthService) {
        $scope.isActive = function (viewLocation){
            return viewLocation === $location.path();
        };

        $scope.AuthService = AuthService;

        $scope.logout = function () {
            AuthService.logout();
            $location.path('/login');
        };
    });
