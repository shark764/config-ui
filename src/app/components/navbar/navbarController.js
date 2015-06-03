  'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', function ($scope, $location, AuthService, Session, TenantsService) {

    $scope.activeTenantId = '';

    $scope.tenants = TenantsService.query( { regionId : '6aff1f30-0901-11e5-87f2-b1d420920055' }, function (data) {
      $scope.activeTenantId = Session.tenantId;

      if(!$scope.activeTenantId){
          $scope.activeTenantId = $scope.tenants.result[0].id;
          $scope.changeTenant($scope.activeTenantId);
      };

    });

    $scope.Session = Session;

    $scope.changeTenant = function (tenantId) {
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
