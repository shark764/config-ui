'use strict';

angular.module('liveopsConfigPanel')
    .controller('NavbarCtrl', function ($scope, $location) {
        $scope.isActive = function (viewLocation){
            return viewLocation === $location.path();
        }
    });
