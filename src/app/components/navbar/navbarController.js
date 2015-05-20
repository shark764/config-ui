'use strict';

angular.module('liveopsConfigPanel')
    .controller('NavbarController', function ($scope, $location, authInterceptorService) {
        $scope.isActive = function (viewLocation){
            return viewLocation === $location.path();
        };

        $scope.$watch(function() {
            return authInterceptorService.user;
        }, function(user){
            $scope.user = user;
        });

        $scope.logout = function () {
            authInterceptorService.logout();
            $location.path('/login');
        }
    });
