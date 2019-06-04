'use strict';

angular.module('liveopsConfigPanel').controller('LogiAdvancedController', [
  '$scope',
  '$window',
  'Session',
  'Logi',
  '$translate',
  'Alert',
  'logiUrl',
  'TenantUser',
  'TenantRole',
  'TenantPermission',
  function($scope, $window, Session, Logi, $translate, Alert, logiUrl, TenantUser, TenantRole, TenantPermission) {
    $scope.iframeLoaded = false;
    $scope.userPermissions = [];

    $scope.isUserImpersonated = sessionStorage.getItem('LOGI-USER-IMPERSONATE') !== null;
    $scope.tenantUserReporting = $scope.isUserImpersonated
      ? JSON.parse(sessionStorage.getItem('LOGI-USER-IMPERSONATE'))
      : Session.user;

    // We get permissions for user selected in Users page,
    // Or User in Session, to reach permissions, first we get
    // User data, then its role, finally permissions to send to API
    TenantUser.cachedGet({ tenantId: Session.tenant.tenantId, id: $scope.tenantUserReporting.id })
      .$promise.then(function(userResponse) {
        TenantRole.cachedGet({ id: userResponse.roleId, tenantId: Session.tenant.tenantId })
          .$promise.then(function(roleResponse) {
            TenantPermission.cachedQuery({ tenantId: Session.tenant.tenantId }).$promise.then(function(
              permissionsResponse
            ) {
              var userPermissions = [];
              _.forEach(permissionsResponse, function(permission, i) {
                if (roleResponse.permissions.indexOf(permission.id) !== -1) {
                  userPermissions.push(permission.name);
                }
              });
              $scope.userPermissions = userPermissions;
            });
          })
          .catch(function(error) {
            console.error(error);
          });
      })
      .catch(function(error) {
        console.error(error);
      });

    console.warn('LogiUrl: ', logiUrl);

    var logiCheck = setInterval(function() {
      if (window.EmbeddedReporting && $scope.userPermissions.length > 0) {
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
      // Get token for advance reports
      // Using whether User from Session, or User impersonated
      Logi.getSsmToken(
        Session.tenant.tenantId,
        Session.tenant.tenantName,
        $scope.tenantUserReporting.id,
        $scope.tenantUserReporting.displayName,
        JSON.stringify($scope.userPermissions),
        $scope.isUserImpersonated
      )
        .then(function(response) {
          EmbeddedReporting.create('ssmContainer', {
            applicationUrl: response.data.logiBaseUrl,
            linkParams: {
              rdSecurekey: response.data.secureToken,
              tenantID: Session.tenant.tenantId
            },
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
      Logi.getSsmBaseUrl(Session.tenant.tenantId)
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
