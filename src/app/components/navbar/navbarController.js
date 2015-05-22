'use strict';

angular.module('liveopsConfigPanel')
    .controller('NavbarController', function ($scope, $location, AuthService, Session) {
        $scope.isActive = function (viewLocation){
            return viewLocation === $location.path();
        };

        $scope.Session = Session;

        $scope.logout = function () {
            AuthService.logout();
            $location.path('/login');
        };
    });
