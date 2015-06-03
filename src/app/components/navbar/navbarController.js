  'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', function ($scope, $location, AuthService, Session, TenantsService) {

    $scope.activeTenantId = '';

    $scope.tenants = TenantsService.query( { regionId : Session.activeRegionId }, function (data) {
      $scope.activeTenantId = Session.tenantId;

      if(!$scope.activeTenantId){
          $scope.activeTenantId = $scope.tenants.result[0].id;
          $scope.changeTenantId($scope.activeTenantId);
      };

    });

    $scope.Session = Session;

    $scope.changeTenantId = function (tenantId) {
      $scope.activeTenantId = tenantId;
      Session.setTenantId(tenantId);
    };

    $scope.isActive = function (viewLocation){
      return viewLocation === $location.path();
    };

    $scope.logout = function () {
      AuthService.logout();
      $location.url($location.path('/login'));
    };
  });
