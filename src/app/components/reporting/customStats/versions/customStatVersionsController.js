'use strict';

angular.module('liveopsConfigPanel')
  .controller('CustomStatVersionsController', ['$scope', 'Session', 'CustomStatVersion',
    function($scope, Session, CustomStatVersion) {
      $scope.getVersions = function() {
        if (!$scope.customStat || $scope.customStat.isNew()) {
          return [];
        }

        return CustomStatVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          customStatId: $scope.customStat.id
        }, 'CustomStatVersion' + $scope.customStat.id);
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
          customStatId: $scope.customStat.id,
          customStat: '[]',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.pushNewItem = function(event, item) {
        $scope.getVersions().unshift(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('customStat', function() {
        if (!$scope.customStat) {
          return;
        }

        $scope.createVersion();

        if ($scope.cleanHandler) {
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':customStats:' + $scope.customStat.id + ':versions',
          $scope.pushNewItem);
      });
    }
  ]);
