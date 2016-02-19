'use strict';

angular.module('liveopsConfigPanel')
  .controller('ReportsController', ['$scope', '$sce', '$http', 'Session', 'Report', '$state', 'BIRST_URL',
    function($scope, $sce, $http, Session, Report, $state, BIRST_URL) {
      $scope.birst = {};

      $scope.fetch = function() {

        Report.get({
          tenantId: Session.tenant.tenantId
        }, function(data) {
          $scope.birst.SSOToken = data.reportToken;
          $scope.buildUrl();
        });

      };

      $scope.buildUrl = function() {
        var buildingUrl = BIRST_URL + '/SSO.aspx?';

        if ($state.params.id === 'historical-dashboards') {
          $scope.birst.module = 'newDashboards';
        } else if ($state.params.id === 'reporting-designer') {
          $scope.birst.module = 'designer';
        } else if ($state.params.id === 'chart-designer') {
          $scope.birst.module = 'visualizer';
        } else {
          $scope.birst.module = 'newDashboards';
        }

        var dashboardName = ''; // Name of the collection...
        var pageName = ''; // Name of the Dashboard...  (Yes... variable naming fail by Birst.)

        buildingUrl = buildingUrl + 'birst.SSOToken=' + $scope.birst.SSOToken + '&birst.embedded=true&birst.module=' + $scope.birst.module;

        if ($scope.birst.module === 'newDashboards') {
          buildingUrl = buildingUrl + '&birst.hideDashboardNavigation=false';
        }

        if (dashboardName !== '' && pageName !== '') {
          buildingUrl = buildingUrl + '&birst.dashboard=' + dashboardName + '&birst.page=' + pageName;
        }

        $scope.birstUrl = $sce.trustAsResourceUrl(buildingUrl);
      };

      $scope.fetch();
    }
  ]);
  