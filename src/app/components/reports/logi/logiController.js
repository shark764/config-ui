'use strict';

angular.module('liveopsConfigPanel')
  .controller('LogiController', ['$scope', '$window', 'Session', 'Logi', '$translate', 'Alert', 'logiUrl',
    function ($scope, $window, Session, Logi, $translate, Alert, logiUrl) {
      $scope.iframeLoaded = false;
      $scope.toggleAnalytics = false;
      
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
                console.warn('Updating documents domain for logi logout process');
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
        }
      }, 200);

      $scope.fetch = function () {

        Logi.cycleLogiAuth(Session.tenant.tenantId, Session.user.displayName)
          .then(function(response) {
            Logi.logoutLogi(response.data.logiBaseUrl)
            .then(function(response) {
              Logi.getLogiToken(Session.tenant.tenantId, Session.user.displayName)
              .then(function(response) {
                EmbeddedReporting.create('logiContainer', {
                  applicationUrl: response.data.logiBaseUrl,
                  linkParams: {'rdSecurekey': response.data.secureToken, 'tenantID': Session.tenant.tenantId},
                  report: 'Common.Bookmarks',
                  autoSizing: 'all',
                });
              });
            })
          })
          .catch(function(err) {
            Alert.error(err);
          });

        Logi.cycleSsmAuth(Session.tenant.tenantId, Session.user.displayName)
          .then(function(response) {
            Logi.logoutSSM(response.data.logiBaseUrl)
            .then(function(response) {
              Logi.getSsmToken(Session.tenant.tenantId, Session.user.displayName)
              .then(function(response) {
                EmbeddedReporting.create('ssmContainer', {
                  applicationUrl: response.data.logiBaseUrl,
                  linkParams: {'rdSecurekey': response.data.secureToken, 'tenantID': Session.tenant.tenantId},
                  report: 'InfoGo.goHome',
                  autoSizing: 'all',
                });
              });
            })
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

        $(logiContainer).contents().find('body').append(script);

        $('#logiContainer').on('load', function () {
          $scope.dashboardReady = true;
          $scope.$apply();
        });
      });
    }
  ]);
