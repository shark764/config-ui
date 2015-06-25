'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion',
  function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion) {
    $scope.Session = Session;
    $scope.versions = [];

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.queues = Queue.query({tenantId : Session.tenant.tenantId}, function(){
        if ($scope.queues[0]){
          $scope.selectedQueue = $scope.queues[0];
        }
      });

    };

    $scope.additional = {
      versions: $scope.versions,
      postSave: function(childScope, result, creatingNew){
        if (creatingNew){
          var initialVersion = new QueueVersion({
            queueId: result.id,
            query: $scope.versions[0].query,
            tenantId: Session.tenant.tenantId,
            name: $scope.versions[0].name
          });

          initialVersion.save(function(versionResult){
                //Update the displays
                childScope.originalResource.activeVersion = versionResult.version;
                childScope.resource.activeVersion = versionResult.version;

                result.activeVersion = versionResult.version;
                result.save(function(){
                  $scope.updateVersionName(childScope.originalResource);
                });
              });
          $scope.versions.push(initialVersion);
        } else {
          $scope.updateVersionName(childScope.originalResource);
        }
      }
    };

    $scope.updateVersionName = function(queue){
        QueueVersion.get({ id: queue.activeVersion, queueId : queue.id, tenantId: Session.tenant.tenantId}, function(data){
          queue.activeVersionName = data.name;
        });
      };

    $scope.$on('on:click:create', function(){
      $scope.versions[0] = {name: 'v1'}

      $scope.selectedQueue = new Queue({
        tenantId: Session.tenant.tenantId
      });
      //$scope.initVersion.name = "v1";
    });

    $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

    $scope.tableConfig = queueTableConfig;
    $scope.fetch();
  }]);
