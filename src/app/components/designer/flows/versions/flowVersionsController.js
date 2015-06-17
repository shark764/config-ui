'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowVersionsController', ['$scope', 'Session', 'FlowVersion',
    function ($scope, Session, FlowVersion) {
      $scope.fetch = function () {
        FlowVersion.query({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        }, function (versions) {
          $scope.versions = angular.copy(versions, $scope.versions);
        });
      };

      $scope.saveVersion = function () {
        $scope.version.save({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        });
      };

      $scope.createVersion = function () {
        $scope.version = new FlowVersion({
          flowId: $scope.flow.id,
          flow: '[]'
        });
      };

      $scope.pushNewItem = function(event, item) {
        $scope.versions.push(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('flow', function () {
        $scope.fetch();

        if($scope.cleanHandler){
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':flows:' + $scope.flow.id + ':versions',
          $scope.pushNewItem);
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