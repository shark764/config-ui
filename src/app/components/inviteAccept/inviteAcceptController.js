'use strict';

angular.module('liveopsConfigPanel')
  .controller('InviteAcceptController', ['$scope', 'User', '$state', '$stateParams', '$translate', 'invitedUser', 'AuthService', 'TenantUser', '$location', 'legalLinkCX', 'legalLinkMitel', 'Alert', 'Session', 'UserPermissions', '$q',
    function ($scope, User, $state, $stateParams, $translate, invitedUser, AuthService, TenantUser, $location, legalLinkCX, legalLinkMitel, Alert, Session, UserPermissions, $q) {
      $scope.user = invitedUser;
      $scope.loading = false;

      $scope.showSignupForm = true;

      $scope.createURL = function () {
        var mitelUrl = 'mitel';
        if ($location.absUrl().indexOf(mitelUrl) !== -1) {
          $scope.legalLinkURL = legalLinkMitel;
        } else {
          $scope.legalLinkURL = legalLinkCX;
        }
      };

      $scope.checkPassword = function() {
        var v = $scope.user.confirmPassword === $scope.user.password;
        $scope.detailsForm.confirmPassword.$setValidity('required', v);
      };

      $scope.save = function() {
        $scope.loading = true;

        //Since password isn't returned from the API and would be clobbered after saving, need to store it explicitly
        $scope.newPassword = $scope.user.password;

        delete $scope.user.status; //Users don't have permission to update their own status
        delete $scope.user.roleId; //Users cannot update their own roles
        return $scope.user.save()
          .then($scope.signupSuccess, $scope.signupFailure);
      };

      $scope.signupSuccess = function(user) {
        //resetting the password here since on save, user comes back without the password and
        //the password field on the form would show as having a validation error (where password is null)
        user.password = $scope.newPassword;

        TenantUser.update({
          tenantId: $stateParams.tenantId,
          id: $stateParams.userId,
          status: 'accepted'
        }, $scope.acceptSuccess, $scope.acceptFailure);
      };

      $scope.signupFailure = function(error){
        Alert.error($translate.instant('invite.accept.details.fail'));
        $scope.loading = false;
        return $q.reject(error);
      };

      $scope.acceptSuccess = function() {
        Session.setToken(null);
        return AuthService.login($scope.user.email, $scope.newPassword).then(function() {
          if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])) {
            $state.transitionTo('content.management.users', {
              id: $stateParams.userId,
              messageKey: 'invite.accept.autologin.success'
            });
          } else {
            $state.transitionTo('content.userprofile', {
              messageKey: 'invite.accept.autologin.success'
            });
          }
        }, function() {
          $state.transitionTo('login', {
            messageKey: 'invite.accept.autologin.fail'
          });
        });
      };

      $scope.acceptFailure = function() {
        Alert.error($translate.instant('invite.accept.fail'));
        $scope.loading = false;
      };
    }
  ]);
