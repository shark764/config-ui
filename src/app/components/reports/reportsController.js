'use strict';

angular.module('liveopsConfigPanel')
  .controller('ReportsController', ['$scope', '$sce', '$http', '$state',
    function($scope, $sce, $http, $state) {
      $scope.birst = {};
      $scope.fetch = function() {
        //console.log($state);
        var tokenGeneratorUrl = 

        $http({
          url: 'https://login.bws.birst.com/TokenGenerator.aspx?birst.username=student11@class.com&birst.ssopassword=xTNU9yRURtrIkFRfNWFPVqye6te2yA5w&birst.spaceId=31346b8f-1143-4b19-8396-3201c349542b',
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
          //console.log("success : " + data);
        }).error( function (data, status, headers, config) {
          $scope.status = status;
          //console.log("error : " + data);
        });
        
      }

      $scope.buildUrl = function() {
        var buildingUrl = 'https://login.bws.birst.com/SSO.aspx?';

        buildingUrl = buildingUrl + 'birst.SSOToken=' + $scope.birst.SSOToken + '&birst.embedded=true&birst.module=' + $scope.birst.module;

        $scope.birstUrl = $sce.trustAsResourceUrl(buildingUrl);
        //console.log($scope.birstUrl);
      }

      $scope.fetch();
    }
  ]);
