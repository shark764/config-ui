'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowVersionsController', ['$scope', 'Session', 'FlowVersion',
    function ($scope, Session, Version) {

      $scope.fetch = function () {
        Version.query({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        }, function(versions){
          $scope.versions = angular.copy(versions, $scope.versions);
        });
      };

      $scope.saveVersion = function () {
        $scope.version.save(function() {
          $scope.versions.push($scope.version);
        });
      };

      $scope.createVersion = function () {
        $scope.version = new Version({
          flowId: $scope.flow.id,
          flow: '[]'
        });
      };

      $scope.$on('created:resource:tenants:' + Session.tenantId + ':flows:' + $scope.flow.id + ':versions', function (event, item) {
        $scope.flow.versions.push(item);
        $scope.selectedVersion = item;
      });

      $scope.$watch('flow', function () {
        $scope.fetch();
      });

      $scope.createVersion();
    }
  ])
  .directive('flowVersions', [function () {
    return {
      scope: {
        flow: '=',
        versions: '='
      },
      templateUrl: 'app/components/designer/flows/versions/flowVersions.html',
      controller: 'FlowVersionsController'
    };
  }]);
