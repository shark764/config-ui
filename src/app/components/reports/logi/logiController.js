'use strict';

angular.module('liveopsConfigPanel')
  .controller('LogiController', ['$scope', '$window', 'Session', 'Logi', '$translate', 'Alert', 'logiUrl',
    function ($scope, $window, Session, Logi, $translate, Alert, logiUrl) {
      $scope.iframeLoaded = false;
      $scope.toggleAnalytics = false;
      
      var options = {};
      var logiCheck = setInterval(function(){
        if (window.EmbeddedReporting) {
          clearInterval(logiCheck);
          $scope.fetch();
        }
      }, 200);

      var loadedCheck = setInterval(function () {
        if (window.EmbeddedReporting && 
            EmbeddedReporting.get('logiContainer') &&
            EmbeddedReporting.get('logiContainer').iframe) {
          clearInterval(loadedCheck);
          EmbeddedReporting.get('logiContainer').iframe.addEventListener('load', function(){
            $scope.iframeLoaded = true;
          });
        }
      }, 200);

      $scope.fetch = function () {
        Logi.getLogiToken(Session.tenant.tenantId, Session.user.displayName)
          .then(function(response) {
            var source = response.data.logiBaseUrl;
            var key = response.data.secureToken;
            options.applicationUrl = source;
            options.linkParams={'rdSecurekey': key, 'tenantID': Session.tenant.tenantId};
            options.report = 'Common.Bookmarks';
            options.autoSizing = 'all';
            EmbeddedReporting.create('logiContainer', options);
          })
          .catch(function(err) {
            Alert.error(err);
          });

        Logi.getSSMToken(Session.tenant.tenantId, Session.user.displayName)
          .then(function (response) {
            var source = response.data.logiBaseUrl;
            var key = response.data.secureToken;
            options.applicationUrl = source;
            options.linkParams = { 'rdSecurekey': key, 'tenantID': Session.tenant.tenantId };
            options.report = 'InfoGo.goHome';
            options.autoSizing = 'all';
            EmbeddedReporting.create('ssmContainer', options);
          })
          .catch(function (err) {
            Alert.error(err);
          });
      };

      $(document).ready(function () {
        var logiContainer = $('#logiContainer').context;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = logiUrl;

        $(logiContainer).contents().find('body').append(script);

        $('#logiContainer').on('load', function () {
          $scope.dashboardReady = true;
          $scope.$apply();
        });
      });
    }
  ]);
