'use strict';

angular.module('liveopsConfigPanel')
  .controller('VersionsController', ['$scope', 'Session', 'Version',
    function ($scope, Session, Version) {

      $scope.version = new Version({
        flowId : $scope.flow.id,
        flow: '[]'
      });

      $scope.versions = Version.query( { tenantId: Session.tenant.id, flowId: $scope.flow.id });

      $scope.fetch = function () {
        $scope.versions = Version.query( { tenantId: Session.tenant.id, flowId: $scope.flow.id });
      };

      $scope.saveVersion = function () {
        $scope.version.save({tenantId : Session.tenant.id, flowId : $scope.flow.id});
      };
  }])
  .directive('flowVersions', [function() {
    return {
      scope : {
        flow : '='
      },
      templateUrl : 'app/components/flows/versions/versions.html',
      controller : 'VersionsController'
    };
   }])
;
