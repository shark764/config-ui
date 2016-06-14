'use strict';

angular.module('liveopsConfigPanel')
  .controller('DashboardVersionsController', ['$scope', 'Session', 'RealtimeDashboardVersion',
    function($scope, Session, RealtimeDashboardVersion) {

      $scope.getVersions = function() {
        if (!$scope.dashboard || $scope.dashboard.isNew()) {
          return [];
        }

        return RealtimeDashboardVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          dashboardId: $scope.dashboard.id
        }, 'RealtimeDashboardVersion' + $scope.dashboard.id);
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
        $scope.version = new RealtimeDashboardVersion({
          dashboardId: $scope.dashboard.id,
          widgets: [{}],
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.pushNewItem = function(event, item) {
        $scope.getVersions().unshift(item);
        $scope.selectedVersion = item;
      };

      $scope.$watch('dashboard', function() {
        if (!$scope.dashboard) {
          return;
        }

        $scope.createVersion();

        if ($scope.cleanHandler) {
          $scope.cleanHandler();
        }

        $scope.cleanHandler = $scope.$on(
          'created:resource:tenants:' + Session.tenant.tenantId + ':dashboards:' + $scope.dashboard.id + ':versions',
          $scope.pushNewItem);
      });
    }
  ]);
