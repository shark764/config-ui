define([
    'angular',
    'text!components/navbar/navbar.html'
], function (angular, navBarTemplate) {
    return angular.module('test2.navbar', [])
        .controller('NavbarCtrl', function ($scope) {
            $scope.date = new Date();
        });
})