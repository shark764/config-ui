'use strict';

angular.module('liveopsConfigPanel')
  .controller('ReportsController', ['$scope', '$sce', '$http', 'Session', 'Report', '$state', 'BIRST_URL', '$timeout', '$translate', '$window',
    function ($scope, $sce, $http, Session, Report, $state, BIRST_URL, $timeout, $translate, $window) {
      $scope.birst = {};
      $scope.dashboardReady = false;
      $scope.birst.message = $translate.instant('reports.default');
      var time = 0;
      var sleepTime = 15;
      var maxTimeout = 120;

      $(document).ready(function () {
        $('#birstFrame').on('load', function () {

          $scope.dashboardReady = true;
          $scope.$apply();

          // parse out just the domain with no subdomain
          var domainOnly;
          // if there is a domain suffix, split it up to grab the domain only
          if ($window.location.hostname.split('.').length > 2) {
            domainOnly = $window.location.hostname.split('.').slice(1).join('.');
          } else {
            // otherwise (as in the case of 'localhost', just get the hostname)
            domainOnly = $window.location.hostname;
          }
          document.domain = domainOnly;
        });
      });

      $scope.fetch = function () {
        Report.get({
          tenantId: Session.tenant.tenantId,
          mode: (($state.current.name === 'content.billing') ? 'platform' : 'reports')
        }, function (data) {
          $scope.birst.SSOToken = data.reportToken;
          $scope.buildUrl();
        }, function (response) {
          switch (response.status) {
          case 418:
            if (time <= maxTimeout) {
              $scope.birst.message = $translate.instant('reports.provisioning');
              $timeout(function () {
                time = time + sleepTime;
                $scope.fetch();
              }, (sleepTime * 1000));
            } else {
              $scope.dashboardError = true;
              $scope.birst.message = $translate.instant('reports.error');
            }
            break;
          case 500:
            $scope.dashboardError = true;
            $scope.birst.message = $translate.instant('reports.serverError');
            break;
          case 503:
            $scope.dashboardError = true;
            $scope.birst.message = $translate.instant('reports.unavailable');
            break;
          default:
            $scope.dashboardError = true;
            $scope.birst.message = $translate.instant('reports.error');
          }
        });
      };


      $scope.buildUrl = function () {
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
