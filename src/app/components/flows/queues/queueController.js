'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion',
  function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.queues = Queue.query({
        tenantId : Session.tenant.tenantId
      });
    };

    $scope.$on('on:click:create', function() {
      $scope.additional.initialQuery = '';

      $scope.selectedQueue = new Queue({
        tenantId: Session.tenant.tenantId
      });
    });

    $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

    $scope.tableConfig = queueTableConfig;

    $scope.additional = {
      initialQuery: '',
      postSave: function(childScope, result, creatingNew) {
        var childScope = childScope;
        if (creatingNew) {

          new QueueVersion({
            tenantId: Session.tenant.tenantId,
            query: $scope.additional.initialQuery,
            name: 'v1',
            queueId: result.id
          }).save(function(versionResult){
            // TODO: investigate if we can find a better way to allow a parent controller
            // to manipulate $scope in its children... becuase right now we have to do this
            // and it makes me weep.
            $scope.selectedQueue.activeVersion = versionResult.version;
            result.activeVersion = versionResult.version;
            result.save();
          });
        }
      }
    };

    $scope.fetch();
  }]);
