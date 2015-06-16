'use strict';

angular.module('liveopsConfigPanel')
  .controller('VersionsController', ['$scope', 'Session', 'Version',
    function ($scope, Session, Version) {
      $scope.version = new Version({
        flowId: $scope.flow.id,
        flow: '[]'
      });

      $scope.fetch = function () {
        Version.query({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        }, function(versions){
          angular.copy(versions, $scope.versions);
        });
      };

      $scope.saveVersion = function () {
        $scope.version.save({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        }, function() {
          $scope.versions.push($scope.version);
        });
      };

      $scope.$on('created:resource:tenants:' + Session.tenantId + ':flows:' + $scope.flow.id + ':versions', function (event, item) {
        $scope.flow.versions.push(item);
        $scope.selectedVersion = item;
      });

      $scope.$watch('flow', function () {
        $scope.fetch();
      });
    }
  ])
  .directive('flowVersions', [function () {
    return {
      scope: {
        flow: '=',
        versions: '='
      },
      templateUrl: 'app/components/designer/flows/versions/flowVersions.html',
      controller: 'VersionsController'
    };
  }]);
