'use strict';

angular.module('liveopsConfigPanel')
    .controller('NavbarController', function ($scope, $location, AuthService, Session, TenantsService) {
        $scope.tenants = [];
        $scope.activeTenant = {};

        $scope.isActive = function (viewLocation){
            return viewLocation === $location.path();
        };

        $scope.Session = Session;

        TenantsService.query( { regionId : 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f' }, function (data) {
            $scope.tenants = data.result;
        });

        $scope.logout = function () {
            AuthService.logout();
            $location.url($location.path('/login').$$url);
        };
    });
