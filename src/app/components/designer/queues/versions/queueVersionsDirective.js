'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueVersionsController', ['$scope', 'Session', 'QueueVersion',
    function ($scope, Session, QueueVersion) {
      $scope.createNewVersion = false;

      $scope.fetch = function () {
        angular.copy([], $scope.versions);

        QueueVersion.query({
          tenantId: Session.tenant.tenantId,
          queueId: $scope.queue.id
        }, function (versions) {
          $scope.versions = angular.copy(versions, $scope.versions);

          if ($scope.queue.activeVersion != null){
            for(var i = 0; i < $scope.versions.length; i++){
              if ($scope.versions[i].version == $scope.queue.activeVersion){
                $scope.currVersion = $scope.versions[i];
              }
            }
          } else {
            $scope.currVersion = null;
          }

        });
      };

      $scope.currVersionChanged = function(){
        $scope.queue.activeVersion = $scope.currVersion.version;
      }

      $scope.cancelVersion = function () {
        $scope.createNewVersion = false;
      };

      $scope.saveVersion = function () {
        $scope.version.save(function (){
          $scope.createVersion();
          $scope.createVersionForm.$setPristine();
          $scope.createVersionForm.$setUntouched();
          $scope.createNewVersion = false;
        });
      };

      $scope.createVersion = function () {
        $scope.createNewVersion = true;
        $scope.version = new QueueVersion({
          queueId: $scope.queue.id,
          tenantId: Session.tenant.tenantId,
          name: 'v' + ($scope.versions.length + 1) + ""
        });
      };

      $scope.pushNewItem = function (event, item) {
        $scope.versions.push(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('queue', function () {
        $scope.fetch();
        $scope.createNewVersion = false;

        if ($scope.cleanHandler) {
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':queues:' + $scope.queue.id + ':versions',
          $scope.pushNewItem);


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
