'use strict';

angular.module('liveopsConfigPanel')
  .controller('ReportsController', ['$scope', '$sce', '$http', 'Session', '$state', 'BIRST_URL', 'SSO_PASSWORD', 'SPACE_ID',
    function($scope, $sce, $http, Session, $state, BIRST_URL, SSO_PASSWORD, SPACE_ID) {
      $scope.birst = {};

      $scope.fetch = function() {

        var username = 'titan-product@liveops.com';
        var sessionVars = 'tenant-id=\''+ Session.tenant.tenantId +'\'';

        $http({
          url: BIRST_URL + '/TokenGenerator.aspx?',
          method: 'POST',
          data: null,
          params: {
            'birst.username': username,
            'birst.ssopassword': SSO_PASSWORD,
            'birst.spaceId': SPACE_ID,
            'birst.sessionVars': sessionVars
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success( function (data) {
          $scope.birst.SSOToken = data;

          if ( $state.params.id === 'historical-dashboards' ) {
            $scope.birst.module = 'newDashboards';
          } else if ( $state.params.id === 'reporting-designer' ) {
            $scope.birst.module = 'designer';
          } else if ( $state.params.id === 'chart-designer' ) {
            $scope.birst.module = 'visualizer';
          }

          $scope.buildUrl();

        }).error( function (data, status) {
          $scope.status = status;
        });
        
      };

      $scope.buildUrl = function() {
        var buildingUrl = BIRST_URL + '/SSO.aspx?';

        var dashboardName = ''; // Name of the collection...
        var pageName = '';  // Name of the Dashboard...  (Yes... variable naming fail by Birst.)

        buildingUrl = buildingUrl + 'birst.SSOToken=' + $scope.birst.SSOToken + '&birst.embedded=true&birst.module=' + $scope.birst.module;

        if ($scope.birst.module == 'newDashboards'){
          buildingUrl = buildingUrl + '&birst.hideDashboardNavigation=true';
        }

        if ( dashboardName != '' && pageName != '' ){
          buildingUrl = buildingUrl + '&birst.dashbaord=' + dashboardName + '&birst.page=' + pageName;
        }

        $scope.birstUrl = $sce.trustAsResourceUrl(buildingUrl);
      };

      $scope.fetch();
    }
  ]);
