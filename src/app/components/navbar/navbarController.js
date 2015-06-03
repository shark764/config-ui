  'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', function ($scope, $location, AuthService, Session, Tenant) {
    $scope.Session = Session;

    $scope.tenants = Tenant.query( { regionId : Session.activeRegionId }, function (data) {
      if(!Session.tenantId){
          Session.tenantId = $scope.tenants[0].id;
      };
    });

    $scope.isActive = function (viewLocation){
      return viewLocation === $location.path();
    };

    $scope.logout = function () {
      AuthService.logout();
      $location.url($location.path('/login'));
    };
  });
