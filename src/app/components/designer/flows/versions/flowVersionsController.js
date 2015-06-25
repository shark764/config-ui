'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowVersionsController', ['$scope', 'Session', 'FlowVersion',
    function ($scope, Session, FlowVersion) {
      $scope.fetch = function () {
        angular.copy([], $scope.versions);

        FlowVersion.query({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        }, function (versions) {
          angular.forEach(versions, function(version, index) {
            version.v = Math.abs((index - versions.length));
          });
          angular.copy(versions, $scope.versions);
        });
      };

      $scope.saveVersion = function () {
        $scope.version.save(function() {
          $scope.createVersion();
          $scope.createVersionForm.$setPristine();
          $scope.createVersionForm.$setUntouched();
          $scope.createNewVersion = false;
        });
      };

      $scope.createVersion = function () {
        $scope.version = new FlowVersion({
          flowId: $scope.flow.id,
          flow: '[]',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.pushNewItem = function(event, item) {
        item.v = $scope.versions.length + 1;
        $scope.versions.unshift(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('flow', function () {
        $scope.fetch();
        $scope.createVersion();
        
        if($scope.cleanHandler){
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':flows:' + $scope.flow.id + ':versions',
          $scope.pushNewItem);
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
      controller: 'FlowVersionsController'
    };
  }]);
