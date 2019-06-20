'use strict';

angular.module('liveopsConfigPanel')
  .controller('LogiController', ['$scope', '$window', 'Session', 'Logi', '$translate', 'Alert', 'logiUrl',
    function ($scope, $window, Session, Logi, $translate, Alert, logiUrl) {
      $scope.iframeLoaded = false;
      $scope.toggleAnalytics = false;

      console.warn('LogiUrl: ', logiUrl)
      
      var logiCheck = setInterval(function(){
        if (window.EmbeddedReporting) {
          console.warn('Embedded Reporting module is ready.');
          clearInterval(logiCheck);
          $scope.fetch();
        } else {
          console.warn('Embedded Reporting module is not ready checking again in 200ms.');
        }
      }, 200);

      var loadedCheck = setInterval(function () {
        if (window.EmbeddedReporting && 
            EmbeddedReporting.get('logiContainer') &&
            EmbeddedReporting.get('logiContainer').iframe) {
          clearInterval(loadedCheck);
          EmbeddedReporting.get('logiContainer').iframe.addEventListener('load', function(){
            console.warn('logiContainer iframe has finished loading ', EmbeddedReporting.get('logiContainer').iframe.id);
            var iframeId = '#' + EmbeddedReporting.get('logiContainer').iframe.id;
            $(iframeId).css('height', 'calc(100vh - 54px)');
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
            $scope.iframeLoaded = true;
          });
        }
      }, 200);

      var loadedCheck2 = setInterval(function () {
        if (window.EmbeddedReporting && 
            EmbeddedReporting.get('ssmContainer') &&
            EmbeddedReporting.get('ssmContainer').iframe) {
          clearInterval(loadedCheck2);
          EmbeddedReporting.get('ssmContainer').iframe.addEventListener('load', function(){
            console.warn('ssmContainer iframe has finished loading ', EmbeddedReporting.get('ssmContainer').iframe.id);
            var iframeId = '#' + EmbeddedReporting.get('ssmContainer').iframe.id;
            $(iframeId).css('height', 'calc(100vh - 54px)');
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
            $scope.iframeLoaded = true;
          });
        }
      }, 200);

      $scope.fetch = function () {

        Logi.getLogiToken(Session.tenant.tenantId, Session.user.displayName)
        .then(function(response) {
          EmbeddedReporting.create('logiContainer', {
            applicationUrl: response.data.logiBaseUrl,
            linkParams: {'rdSecurekey': response.data.secureToken, 'tenantID': Session.tenant.tenantId},
            report: 'Common.Bookmarks',
            autoSizing: 'width',
          });
        })
        .catch(function(err) {
          Alert.error(err);
        });

        Logi.getSsmToken(Session.tenant.tenantId, Session.user.displayName)
        .then(function(response) {
          EmbeddedReporting.create('ssmContainer', {
            applicationUrl: response.data.logiBaseUrl,
            linkParams: {'rdSecurekey': response.data.secureToken, 'tenantID': Session.tenant.tenantId},
            report: 'InfoGo.goHome',
            autoSizing: 'width',
          });
        })
        .catch(function(err) {
          Alert.error(err);
        });

      };

      $(document).ready(function () {
        var logiContainer = $('#logiContainer').context;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = logiUrl;

        /**
         * Append two hidden iframes to the page to force logi to logout
         */
        Logi.getLogiBaseUrl(Session.tenant.tenantId)
        .then(function(response) {
          console.warn('Logi base url', response.data.logiBaseUrl);
          var logiIframe = document.createElement('iframe');
          logiIframe.style.display = "none";
          logiIframe.id = "logiLogoutIframe"
          logiIframe.src = response.data.logiBaseUrl + '/rdProcess.aspx?rdProcess=tasks&rdTaskID=Logout';
          document.body.appendChild(logiIframe);
        })
        .catch(function(err) {
          Alert.error(err);
        });
        

        Logi.getSsmBaseUrl(Session.tenant.tenantId)
        .then(function(response) {
          console.warn('Ssm base url', response.data.logiBaseUrl);
          var ssmIframe = document.createElement('iframe');
          ssmIframe.style.display = "none";
          ssmIframe.id = "ssmLogoutIframe"
          ssmIframe.src = response.data.logiBaseUrl + '/rdProcess.aspx?rdProcess=tasks&rdTaskID=Logout';
          document.body.appendChild(ssmIframe);
        })
        .catch(function(err) {
          Alert.error(err);
        });


        $(logiContainer).contents().find('body').append(script);

        $('#logiContainer').on('load', function () {
          $scope.dashboardReady = true;
          $scope.$apply();
        });
      });
    }
  ]);
