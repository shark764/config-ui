'use strict';

angular.module('liveopsConfigPanel')
  .controller('CustomStatVersionsController', ['$scope', 'Session', 'CustomStatVersion',
    function($scope, Session, CustomStatVersion) {
      $scope.getVersions = function() {
        if (!$scope.stat || $scope.stat.isNew()) {
          return [];
        }

        return CustomStatVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          customStatId: $scope.stat.id
        }, 'CustomStatVersion' + $scope.stat.id);
      };

      $scope.saveVersion = function() {
        return $scope.version.save(function() {
          $scope.createVersion();
          $scope.createVersionForm.$setPristine();
          $scope.createVersionForm.$setUntouched();
          $scope.createNewVersion = false;
        });
      };

      $scope.createVersion = function() {
        $scope.version = new CustomStatVersion({
          customStatId: $scope.stat.id,
          customStat: '[]',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.pushNewItem = function(event, item) {
        $scope.getVersions().unshift(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('stat', function() {
        if (!$scope.stat) {
          return;
        }

        $scope.createVersion();

        if ($scope.cleanHandler) {
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':customStats:' + $scope.stat.id + ':versions',
          $scope.pushNewItem);
      });
    }
  ]);
