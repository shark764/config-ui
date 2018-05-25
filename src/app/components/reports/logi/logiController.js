'use strict';

angular.module('liveopsConfigPanel')
  .controller('LogiController', ['$scope', '$sce', '$http', 'Session', 'Logi', '$state', 'BIRST_URL', '$timeout', '$translate', '$window', 'Alert',
    function ($scope, $sce, $http, Session, Logi, $state, BIRST_URL, $timeout, $translate, $window, Alert) {
      $scope.birst = {};
      $scope.dashboardReady = false;
      $scope.birst.message = $translate.instant('reports.default');
      var time = 0;
      var sleepTime = 15;
      var maxTimeout = 120;

      var options = {};

      $(document).ready(function () {
        $('#logiContainer').on('load', function () {
          $scope.dashboardReady = true;
          $scope.$apply();
        });
      });


      $scope.fetch = function () {
        Logi.getToken(Session.tenant.tenantId, Session.user.displayName)
            .then(function(response) {
              var source = response.data.logiBaseUrl;
              var key = response.data.secureToken;
              options.applicationUrl = source;
              options.linkParams={'rdSecurekey': key, 'tenantID': Session.tenant.tenantId}
              options.report = 'OverviewRealTimeDashboard';
              options.autoSizing = 'all';
              var report = EmbeddedReporting.create('logi-container', options);
              $scope.dashboardReady = true;
            })
            .catch(function(err) {
              Alert.error(err);
            });
      };

      $scope.fetch();
    }
  ]);