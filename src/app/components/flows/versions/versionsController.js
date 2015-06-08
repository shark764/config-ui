'use strict';

angular.module('liveopsConfigPanel')
  .controller('VersionsController', ['$scope', '$routeParams', '$filter', 'Session', 'Version',
    function ($scope, $routeParams, $filter, Session, Version) {

      $scope.version = new Version({});

      $scope.versions = Version.query( { tenantId: Session.tenant.id, flowId: $routeParams.flowId });

      $scope.fetch = function () {
        $scope.versions = Version.query( { tenantId: Session.tenant.id, flowId: $routeParams.flowId });
      };

      $scope.saveSuccess = function (response) {
        $scope.version = {};
        $scope.fetch();
      };

      $scope.saveFailure = function (reason) {
        $scope.error = reason.data;
      };

      $scope.save = function () {
        $scope.version.save({tenantId : Session.tenant.id, flowId : $routeParams.flowId}, $scope.saveSuccess, $scope.saveFailure);
      };

    }]);
