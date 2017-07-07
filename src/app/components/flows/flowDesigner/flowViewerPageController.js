'use strict';

angular.module('liveopsConfigPanel')
  .controller('ViewerPageController', ['$scope', 'flow', 'tenantSettings', 'notations', 'data', 'UserPermissions',
    function($scope, flow, tenantSettings, notations, data, UserPermissions) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.tenantSettings = tenantSettings;
      $scope.privateNotationPermissions = UserPermissions.hasPermission('PLATFORM_VIEW_ALL_PRIVATE_NOTATIONS');
      $scope.notations = notations;
    }
  ]);
