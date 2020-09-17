'use strict';

angular
  .module('liveopsConfigPanel')
  .config([
    '$translateProvider',
    function($translateProvider) {
      $translateProvider.useSanitizeValueStrategy('sanitize');
    }
  ])
  .controller('LoginController', [
    '$rootScope',
    '$http',
    'apiHostname',
    '$scope',
    '$state',
    'AuthService',
    '$stateParams',
    '$translate',
    'Alert',
    'TenantUser',
    '$filter',
    '$location',
    'legalLinkCX',
    'legalLinkMitel',
    'Session',
    'UserPermissions',
    'User',
    function(
      $rootScope,
      $http,
      apiHostname,
      $scope,
      $state,
      AuthService,
      $stateParams,
      $translate,
      Alert,
      TenantUser,
      $filter,
      $location,
      legalLinkCX,
      legalLinkMitel,
      Session,
      UserPermissions,
      User
    ) {
      var self = this;

      function redirectUponLogin() {
        if (UserPermissions.hasPermissionInList(['MANAGE_ALL_SKILLS', 'MANAGE_ALL_GROUPS'])) {
          $state.go('content.management.users');
        } else {
          $state.go('content.userprofile');
        }
      }

      $scope.innerScope = {};
      $scope.isSso = Session.isSso;
      $scope.innerScope.idpLoginPageLogin = AuthService.idpLogin;

      $scope.innerScope.loginStatus = {
        $$state: {
          status: 1
        }
      };

      $scope.createURL = function() {
        var mitelUrl = 'mitel';
        if ($location.absUrl().indexOf(mitelUrl) !== -1) {
          $scope.legalLinkURL = legalLinkMitel;
        } else {
          $scope.legalLinkURL = legalLinkCX;
        }
      };

      function provideIdpErrorMessage(errorMessage) {
        $scope.innerScope.error = errorMessage;
      }

      AuthService.getErrorMessageFunction(provideIdpErrorMessage);

      $scope.innerScope.login = function(alternateToken) {
        var alternateTokenVal = alternateToken || null;
        $scope.innerScope.error = null;

        $scope.innerScope.loginStatus = AuthService.login(
          $scope.innerScope.username,
          $scope.innerScope.password,
          alternateTokenVal,
          $scope
        ).then(
          function(response) {
            $scope.innerScope.loggingIn = true;
            $rootScope.$broadcast('login:success');
            // if a specific tenantId is being targeted in the state or url
            if ($stateParams.tenantId) {
              TenantUser.update(
                {
                  tenantId: $stateParams.tenantId,
                  id: response.data.result.userId,
                  status: 'accepted'
                },
                self.inviteAcceptSuccess,
                self.inviteAcceptFail
              );
            } else if (
              // if the user has been set to return to the last page visited
              // upon login, for example, when the user is kicked out
              // after a token expires
              AuthService.getResumeSession() &&
              _.has(Session, 'lastPageVisited.stateName') &&
              !_.includes(['', 'login', 'forgot-password'], Session.lastPageVisited.stateName)
            ) {
              $state.go(Session.lastPageVisited.stateName, Session.lastPageVisited.paramsObj);

              if (angular.isDefined(Session.lastPageVisited.paramsObj.tenantId)) {
                var currentSessionTenant = _.find(Session.tenants, {
                  tenantId: Session.lastPageVisited.paramsObj.tenantId
                });
                Session.setTenant(currentSessionTenant);
                AuthService.updateDomain(currentSessionTenant);
              }
            } else {
              // ...otherwise, let's just check to see if the user has
              // set a default tenant, and if so, try to set config-ui
              // to that tenant
              var userData = User.cachedGet({
                id: response.data.result.userId
              });

              userData.$promise.then(
                function(indivUserDataResponse) {
                  if (indivUserDataResponse.defaultTenant) {
                    // get index of tenant with this id for the defaultTenant
                    var defaultTenantIndex = _.findIndex(Session.tenants, function(sessionTenant) {
                      return sessionTenant.tenantId === indivUserDataResponse.defaultTenant;
                    });

                    // if it exists for this user, set the defaultTenant to
                    // be the defaultTenant
                    if (defaultTenantIndex !== -1) {
                      Session.setTenant(Session.tenants[defaultTenantIndex]);
                      AuthService.updateDomain(Session.tenants[defaultTenantIndex]);
                    }
                  }

                  redirectUponLogin();
                },
                function(err) {
                  // if the call to get defaultTenant from the User fails,
                  // at least keep the login going with a redirect into config-ui
                  console.error(err);
                  redirectUponLogin();
                }
              );
            }
          },
          function(response) {
            switch (response.status) {
              case 401:
                $scope.innerScope.error = $translate.instant('login.error');
                break;
              default:
                $scope.innerScope.error = $translate.instant('login.error.unexpected');
            }
          }
        );
      };

      // providing this back to the auth service so that it can
      // be used from within the SSO login method
      AuthService.getLoginFunction($scope.innerScope.login);

      this.inviteAcceptSuccess = function() {
        //Update user info in Session
        AuthService.refreshTenants().then(function() {
          // first check to see if the tenant we want to switch to is already
          // in the Session...
          var newTenant = $filter('filter')(
            Session.tenants,
            {
              tenantId: $stateParams.tenantId
            },
            true
          );
          // ...if it IS, great, switch to that tenant
          if (newTenant.length >= 1) {
            Session.setTenant(newTenant[0]);
          }
        });

        if (
          UserPermissions.hasPermissionInList([
            'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
            'VIEW_ALL_USERS',
            'MANAGE_ALL_USER_EXTENSIONS',
            'MANAGE_ALL_GROUP_USERS',
            'MANAGE_ALL_USER_SKILLS',
            'MANAGE_ALL_USER_LOCATIONS',
            'MANAGE_TENANT_ENROLLMENT'
          ])
        ) {
          $state.go('content.management.users', {
            messageKey: 'invite.accept.success'
          });
        } else {
          $state.go('content.userprofile', {
            messageKey: 'invite.accept.success'
          });
        }
      };

      this.inviteAcceptFail = function() {
        if (
          UserPermissions.hasPermissionInList([
            'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
            'VIEW_ALL_USERS',
            'MANAGE_ALL_USER_EXTENSIONS',
            'MANAGE_ALL_GROUP_USERS',
            'MANAGE_ALL_USER_SKILLS',
            'MANAGE_ALL_USER_LOCATIONS',
            'MANAGE_TENANT_ENROLLMENT'
          ])
        ) {
          $state.go('content.management.users', {
            messageKey: 'invite.accept.existing.fail'
          });
        } else {
          $state.go('content.userprofile', {
            messageKey: 'invite.accept.existing.fail'
          });
        }
      };

      if ($stateParams.messageKey) {
        Alert.info($translate.instant($stateParams.messageKey), '', {
          closeButton: true,
          timeout: 10000
        });
      }

      $scope.updateToCurrentYear = {
        currentYear: new Date().getFullYear()
      };

      $scope.destroySession = function() {
        // if we are logging out, destroy the Session after
        // the page is 100% loaded so as not to cause JS errors
        if (AuthService.getLogoutFlag()) {
          Session.destroy(true);
        }
      };
    }
  ]);
