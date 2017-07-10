'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'draft', 'tenantSettings', 'UserPermissions',
    function($scope, flow, notations, draft, tenantSettings, UserPermissions) {
      $scope.flow = flow;
      $scope.draft = draft;
      $scope.tenantSettings = tenantSettings;
      $scope.privateNotationPermissions = UserPermissions.hasPermission('PLATFORM_VIEW_ALL_PRIVATE_NOTATIONS');
      $scope.notations = notations;
    }
  ]);
