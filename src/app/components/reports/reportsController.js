'use strict';

angular.module('liveopsConfigPanel')
  .constant('BIRST_URL', 'http://dev-birst.liveopslabs.com')
  .controller('ReportsController', ['$scope', '$sce', '$http', 'Session', '$state', 'BIRST_URL',
    function($scope, $sce, $http, Session, $state, BIRST_URL) {
      $scope.birst = {};

      $scope.fetch = function() {

        var username = 'titan-product@liveops.com';
        var ssopassword = 'JO4IIiv0vuzyhoYoyWpbip0QquoCQyGh'; // Beta 4 Warehouse
        var spaceId = '2846b565-23f8-4032-b563-21f8b7a01cc5'; // Beta 4 Warehouse
        var sessionVars = 'tenant-id=\''+ Session.tenant.tenantId +'\';';

        $http({
          url: BIRST_URL + '/TokenGenerator.aspx?',
          method: 'POST',
          data: null,
          params: {
            'birst.username': username,
            'birst.ssopassword': ssopassword,
            'birst.spaceId': spaceId,
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
