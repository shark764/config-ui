'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueVersionsController', ['$scope', '$state', 'Session', 'QueueVersion',
    function ($scope, $state, Session, QueueVersion) {
      $scope.saving = false;
      $scope.versions = [];
      $scope.queryType = 'basic';

      $scope.fetch = function () {

        if($scope.queue && $scope.queue.id) {

          QueueVersion.cachedQuery({
            tenantId: Session.tenant.tenantId,
            queueId: $scope.queue.id
          }, 'QueueVersion' + $scope.queue.id).$promise.then(function (versions) {

            $scope.versions.length = 0;

            for(var i = 0; i < versions.length; i++){
              $scope.versions.push(versions[i]);
            }

            $scope.updateCurrentVersion();
          });
        }
      };

      $scope.$watch('queue.activeVersion', function () {
        $scope.updateCurrentVersion();
      });

      $scope.updateCurrentVersion = function () {
        if ($scope.queue.activeVersion !== null){
          for(var i = 0; i < $scope.versions.length; i++){
            if ($scope.versions[i].version === $scope.queue.activeVersion){
              $scope.currVersion = $scope.versions[i];
              $scope.toggleDetails($scope.currVersion);
            }
          }
        } else {
          $scope.currVersion = null;
        }
      };

      $scope.openBasicQuery = function () {
        var queueVersion = JSON.stringify($scope.versionCopy);
        $state.go('content.flows.query', {queueVersion: queueVersion, queueId: $scope.queue.id});
      };

      $scope.currVersionChanged = function(){
        $scope.queue.activeVersion = $scope.currVersion.version;
      };

      $scope.createVersionCopy = function(version) {
        $scope.$emit('copy:queue:version', version);
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

        if($scope.queue && $scope.queue.id){
          $scope.cleanHandler = $scope.$on(
            'created:resource:tenants:' + Session.tenant.tenantId + ':queues:' + $scope.queue.id + ':versions',
            $scope.pushNewItem);
        }

      });
      
      $scope.addQueueVersion = function(){
        $scope.$emit('create:queue:version');
      }
    }
  ])
  .directive('queueVersions', [function () {
    return {
      scope: {
        queue: '='
      },
      templateUrl: 'app/components/flows/queues/versions/queueVersions.html',
      controller: 'QueueVersionsController'
    };
  }]);
