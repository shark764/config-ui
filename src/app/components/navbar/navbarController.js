'use strict';

angular.module('liveopsConfigPanel')
    .controller('NavbarCtrl', function ($scope, $location, liveopsApiInterceptor) {
        $scope.isActive = function (viewLocation){
            return viewLocation === $location.path();
        };

        $scope.logout = function () {
            liveopsApiInterceptor.clearCredentials();
            $location.path('/login');
        }
    });
