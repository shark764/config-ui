'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueVersionsController', ['$scope', 'Session', 'QueueVersion',
    function ($scope, Session, QueueVersion) {
      $scope.fetch = function () {
        angular.copy([], $scope.versions);

        QueueVersion.query({
          tenantId: Session.tenant.tenantId,
          queueId: $scope.queue.id
        }, function (versions) {
          $scope.versions = angular.copy(versions, $scope.versions);
        });
      };

      $scope.saveVersion = function () {
        $scope.version.save(function (){
          $scope.createVersion();
          $scope.createVersionForm.$setPristine();
          $scope.createVersionForm.$setUntouched();
        });
      };

      $scope.createVersion = function () {
        $scope.version = new QueueVersion({
          queueId: $scope.queue.id,
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.pushNewItem = function (event, item) {
        $scope.versions.push(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('queue', function () {
        $scope.fetch();

        if ($scope.cleanHandler) {
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':queues:' + $scope.queue.id + ':versions',
          $scope.pushNewItem);
      });

      $scope.createVersion();
    }
  ])
  .directive('queueVersions', [function () {
    return {
      scope: {
        queue: '=',
        versions: '='
      },
      templateUrl: 'app/components/designer/queues/versions/queueVersions.html',
      controller: 'QueueVersionsController'
    };
  }]);
