'use strict';

angular.module('liveopsConfigPanel')
  .controller('VersionsController', ['$scope', '$stateParams', '$filter', 'Session', 'Version',
    function ($scope, $stateParams, $filter, Session, Version) {

      $scope.version = new Version({});

      $scope.versions = Version.query( { tenantId: Session.tenant.tenantId, flowId: $stateParams.flowId });

      $scope.fetch = function () {
        $scope.versions = Version.query( { tenantId: Session.tenant.tenantId, flowId: $stateParams.flowId });
      };

      $scope.saveSuccess = function (response) {
        $scope.version = {};
        $scope.fetch();
      };

      $scope.saveFailure = function (reason) {
        $scope.error = reason.data;
      };

      $scope.save = function () {
        $scope.version.save({tenantId : Session.tenant.tenantId, flowId : $stateParams.flowId}, $scope.saveSuccess, $scope.saveFailure);
      };

    }]);
