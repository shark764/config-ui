'use strict';

angular.module('liveopsConfigPanel')
  .controller('ReportsController', ['$scope', '$sce', '$http', '$state',
    function($scope, $sce, $http, $state) {
      

      $scope.birst = {};
      $scope.birst.baseUrl = 'http://dev-birst.liveopslabs.com';
      $scope.fetch = function() {
        var tokenGeneratorUrl = 

        $http({
          url: $scope.birst.baseUrl + '/TokenGenerator.aspx?birst.username=titan-product@liveops.com&birst.ssopassword=JO4IIiv0vuzyhoYoyWpbip0QquoCQyGh&birst.spaceId=2846b565-23f8-4032-b563-21f8b7a01cc5' 
          + '&birst.sessionVars=Birst$Groups=\'CreateDashboards\',\'CreateReports\',\'ExploreData\',\'ScheduleReports\',\'DownloadData\',\'43d0436d-356d-451a-ab73-d9a7e465e255\' ',
          method: 'POST',
          data: null,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success( function (data, status, headers, config) {
          $scope.birst.SSOToken = data;

          if ( $state.params.id === 'historical-dashboards' ) {
            $scope.birst.module = 'newDashboards';
          } else if ( $state.params.id === 'reporting-designer' ) {
            $scope.birst.module = 'designer';
          } else if ( $state.params.id === 'chart-designer' ) {
            $scope.birst.module = 'visualizer';
          }

          $scope.buildUrl();
        }).error( function (data, status, headers, config) {
          $scope.status = status;
        });
        
      }

      $scope.buildUrl = function() {
        var buildingUrl = $scope.birst.baseUrl + '/SSO.aspx?';

        buildingUrl = buildingUrl + 'birst.SSOToken=' + $scope.birst.SSOToken + '&birst.embedded=true&birst.module=' + $scope.birst.module ;

        $scope.birstUrl = $sce.trustAsResourceUrl(buildingUrl);
      }

      $scope.fetch();
    }
  ]);
