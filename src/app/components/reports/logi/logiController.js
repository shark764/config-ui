'use strict';

angular.module('liveopsConfigPanel')
  .controller('LogiController', ['$scope', 'Session', 'Logi', '$translate', 'Alert',
    function ($scope, Session, Logi, $translate, Alert) {
      $scope.birst = {};
      $scope.dashboardReady = false;
      $scope.birst.message = $translate.instant('reports.default');

      var options = {};

      $scope.fetch = function () {
        Logi.getToken(Session.tenant.tenantId, Session.user.displayName)
            .then(function(response) {
              var source = response.data.logiBaseUrl;
              var key = response.data.secureToken;
              options.applicationUrl = source;
              options.linkParams={'rdSecurekey': key, 'tenantID': Session.tenant.tenantId};
              options.report = 'Common.Bookmarks';
              options.autoSizing = 'all';
              EmbeddedReporting.create('logi-container', options);
              $scope.dashboardReady = true;
            })
            .catch(function(err) {
              Alert.error(err);
            });
      };

      $(document).ready(function () {
        var logiContainer = $('#logiContainer').context;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://logi.cxengagelabs.net/CxEngage/rdTemplate/rdEmbedApi/rdEmbed.js';
        $(logiContainer).contents().find('body').append(script);

        $('#logiContainer').on('load', function () {
          $scope.dashboardReady = true;
          $scope.$apply();
        });

        $scope.fetch();
      });
    }
  ]);
