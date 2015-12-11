'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowVersionsController', ['$scope', 'Session', 'FlowVersion',
    function ($scope, Session, FlowVersion) {
      $scope.getVersions = function(){
        if (! $scope.flow || $scope.flow.isNew()){
          return [];
        }

        return FlowVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.flow.id
        }, 'FlowVersion' + $scope.flow.id);
      };

      $scope.saveVersion = function () {
        return $scope.version.save(function() {
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
        $scope.getVersions().unshift(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('flow', function () {
        if (! $scope.flow){
          return;
        }

        $scope.createVersion();

        if($scope.cleanHandler){
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':flows:' + $scope.flow.id + ':versions',
          $scope.pushNewItem);
      });
    }
  ]);
