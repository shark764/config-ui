'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueVersionsController', ['$scope', 'Session', 'QueueVersion',
    function ($scope, Session, QueueVersion) {
      $scope.saving = false;

      $scope.fetch = function () {
        angular.copy([], $scope.versions);

        QueueVersion.query({
          tenantId: Session.tenant.tenantId,
          queueId: $scope.queue.id
        }, function (versions) {
          $scope.versions = angular.copy(versions, $scope.versions);

          if ($scope.queue.activeVersion !== null){
            for(var i = 0; i < $scope.versions.length; i++){
              if ($scope.versions[i].version === $scope.queue.activeVersion){
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
      };

      $scope.createVersionCopy = function(version) {
        version.viewing = false;

        $scope.versionCopy = new QueueVersion({
          query: version.query,
          name: 'v' + ($scope.versions.length + 1),
          tenantId: version.tenantId,
          queueId: version.queueId
        });

        $scope.createNewVersion = true;
      };

      $scope.saveVersion = function () {
        $scope.saving = true;

        $scope.versionCopy.save(function (){
          $scope.createVersionForm.$setPristine();
          $scope.createVersionForm.$setUntouched();
          $scope.createNewVersion = false;
        }).finally(function () {
          $scope.saving = false;
        });
      };

      $scope.toggleDetails = function (version) {
        if(version.viewing){
          version.viewing = false;
          return;
        }

        for(var i = 0; i < $scope.versions.length; i++){
          $scope.versions[i].viewing = false;
        }

        version.viewing = true;
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
