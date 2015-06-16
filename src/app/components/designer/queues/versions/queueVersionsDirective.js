'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueVersionsController', ['$scope', 'Session', 'QueueVersion',
    function ($scope, Session, Version) {
      $scope.version = new Version({
        queueId: $scope.queue.id
      });

      $scope.fetch = function () {
        Version.query({
          tenantId: Session.tenant.tenantId,
          queueId: $scope.queue.id
        }, function (versions) {
          angular.copy(versions, $scope.versions);
        });
      };

      $scope.saveVersion = function () {
        $scope.version.save({
          tenantId: Session.tenant.tenantId,
          queueId: $scope.queue.id
        }, function () {
          $scope.versions.push($scope.version);
        });
      };

      $scope.$on('created:resource:tenants:' + Session.tenantId + ':queues:' + $scope.queue.id + ':versions',
        function (event, item) {
          $scope.queue.versions.push(item);
          $scope.selectedVersion = item;
        });

      $scope.$watch('queue', function () {
        $scope.fetch();
      });
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