'use strict';

angular.module('liveopsConfigPanel').controller('LogiAdvancedController', [
  '$scope',
  '$window',
  'Session',
  'Logi',
  '$translate',
  'Alert',
  'logiUrl',
  function($scope, $window, Session, Logi, $translate, Alert, logiUrl) {
    $scope.iframeLoaded = false;

    $scope.isTenantImpersonated = sessionStorage.getItem('LOGI-TENANT-IMPERSONATE') !== null;
    $scope.preferredTenantReporting = $scope.isTenantImpersonated
      ? JSON.parse(sessionStorage.getItem('LOGI-TENANT-IMPERSONATE'))
      : Session.tenant;

    console.warn('LogiUrl: ', logiUrl);

    var logiCheck = setInterval(function() {
      if (window.EmbeddedReporting) {
        console.warn('Embedded Reporting module is ready.');
        clearInterval(logiCheck);
        $scope.fetch();
      } else {
        console.warn('Embedded Reporting module is not ready checking again in 200ms.');
      }
    }, 200);

    var loadedCheck = setInterval(function() {
      if (
        window.EmbeddedReporting &&
        EmbeddedReporting.get('ssmContainer') &&
        EmbeddedReporting.get('ssmContainer').iframe
      ) {
        clearInterval(loadedCheck);
        EmbeddedReporting.get('ssmContainer').iframe.addEventListener('load', function() {
          console.warn('ssmContainer iframe has finished loading ', EmbeddedReporting.get('ssmContainer').iframe.id);
          var iframeId = '#' + EmbeddedReporting.get('ssmContainer').iframe.id;
          $(iframeId).css('height', 'calc(100vh - 54px)');
          // parse out just the domain with no subdomain
          var domainOnly;
          // if there is a domain suffix, split it up to grab the domain only
          if ($window.location.hostname.split('.').length > 2) {
            domainOnly = $window.location.hostname
              .split('.')
              .slice(1)
              .join('.');
          } else {
            // otherwise (as in the case of 'localhost', just get the hostname)
            domainOnly = $window.location.hostname;
          }
          document.domain = domainOnly;
          $scope.iframeLoaded = true;
        });
      }
    }, 200);

    $scope.fetch = function() {
      Logi.getSsmToken(
        $scope.preferredTenantReporting.tenantId,
        $scope.preferredTenantReporting.tenantName,
        Session.user.displayName,
        $scope.isTenantImpersonated
      )
        .then(function(response) {
          EmbeddedReporting.create('ssmContainer', {
            applicationUrl: response.data.logiBaseUrl,
            linkParams: { rdSecurekey: response.data.secureToken, tenantID: $scope.preferredTenantReporting.tenantId },
            report: 'InfoGo.goHome',
            autoSizing: 'width'
          });
        })
        .catch(function(err) {
          Alert.error(err);
        });
    };

    $(document).ready(function() {
      var ssmContainer = $('#ssmContainer').context;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = logiUrl;

      /**
       * Append iframe to the page to force logi to logout
       */
      Logi.getSsmBaseUrl($scope.preferredTenantReporting.tenantId)
        .then(function(response) {
          console.warn('Ssm base url', response.data.logiBaseUrl);
          var ssmIframe = document.createElement('iframe');
          ssmIframe.style.display = 'none';
          ssmIframe.id = 'ssmLogoutIframe';
          ssmIframe.src = response.data.logiBaseUrl + '/rdProcess.aspx?rdProcess=tasks&rdTaskID=Logout';
          document.body.appendChild(ssmIframe);
        })
        .catch(function(err) {
          Alert.error(err);
        });

      $(ssmContainer)
        .contents()
        .find('body')
        .append(script);

      $('#ssmContainer').on('load', function() {
        $scope.dashboardReady = true;
        $scope.$apply();
      });
    });
  }
]);
