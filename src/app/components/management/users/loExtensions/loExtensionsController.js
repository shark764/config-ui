'use strict';

angular.module('liveopsConfigPanel')
  .controller('loExtensionsController', ['$rootScope', '$scope', '$q', '$translate', 'Session', '_', 'Alert', 'GlobalRegionsList', 'loExtensionTypes', 'loExtensionProviders',
    function($rootScope, $scope, $q, $translate, Session, _, Alert, GlobalRegionsList, loExtensionTypes, loExtensionProviders) {
      var vm = this;
      $scope.newExtension = {};
      $scope.twilioRegions = GlobalRegionsList;
      $scope.loExtensionTypes = loExtensionTypes;
      $scope.loExtensionProviders = loExtensionProviders;

      $scope.editExtension = function (selectedExtension) {
        vm.editingExtension = selectedExtension;
        if (selectedExtension.type !== 'webrtc') {
          $scope.loExtensionTypes = angular.forEach($scope.loExtensionTypes, function (val) {
            // we are hiding webrtc when editing non-webrtc extension instead of deleting
            // to keep $scope.loExtensionTypes as a constant value (lots of bugs otherwise)
            if (val.value === 'webrtc') {
              val.hidden = true;
            }
          });
        }
      };

      function webRtcHideShow () {
        $scope.newExtension = {};
        if (
          !$scope.hasTwilioIntegration ||
          ($scope.hasTwilioIntegration && vm.creatingExtension)
        ) {
          $scope.newExtension.type = _.find($scope.loExtensionTypes, function (val) {
            return val.value !== 'webrtc';
          }).value;
        }
      }

      function flagFormsAsClosed () {
        vm.editingExtension = null;
        vm.creatingExtension = false;
        webRtcHideShow();
      }

      vm.resetExtension = function() {
        $scope.loExtensionsForm.$setUntouched();
        flagFormsAsClosed();
      };

      vm.save = function() {
        flagFormsAsClosed();

        var roleId = $scope.tenantUser.roleId;
        delete $scope.tenantUser.roleId;
        delete $scope.tenantUser.invitationStatus;
        delete $scope.tenantUser.activeExtension;
        delete $scope.tenantUser.platformStatus;

        return $scope.tenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          $scope.tenantUser.roleId = roleId;
          vm.resetExtension();
          Alert.success($translate.instant('details.extensions.success'));
          return tenantUser;
        }, function(response) {
          $scope.tenantUser.roleId = roleId;

          $scope.form
            .loFormSubmitController
            .populateApiErrors(response);

          $scope.form.$setPristine();

          var unbindWatch = $scope.$watch('form.$dirty', function (dirty, oldVal) {
            if (!dirty || (dirty === oldVal)) {
              return;
            }

            if ($scope.form.extensions) {
              $scope.form.extensions.$setDirty();
            }

            unbindWatch();
          });

          Alert.error($translate.instant('details.extensions.error'));

          $scope.tenantUser.reset();
          return $q.reject(response);
        });
      };

      vm.cancelEditExtension = function () {
        flagFormsAsClosed();
      };

      $scope.add = function() {
        if (!$scope.loExtensionsForm.$invalid) {
          $scope.tenantUser.activeExtension = $scope.tenantUser.extensions[0];
          $scope.tenantUser.extensions.push($scope.newExtension);
          return vm.save().then(function(tenantUser) {
            vm.resetExtension();
            return tenantUser;
          });
        }
      };

      $scope.hideTwilio = function (extension) {
        if (
          $scope.hasTwilioIntegration !== true &&
          extension.provider === 'twilio'
        ) {
          return true;
        }

        return false;
      };

      $scope.remove = function(extension) {
        $scope.tenantUser.extensions.removeItem(extension);

        var defaultExtension = $scope.tenantUser.extensions[0];

        $scope.setActiveExtension(defaultExtension);

        return vm.save();
      };

      $scope.moved = function(index) {

        $scope.tenantUser.extensions.splice(index, 1);

        var defaultExtension = $scope.tenantUser.extensions[0];

        $scope.setActiveExtension(defaultExtension);

        return vm.save();
      };

      $scope.setActiveExtension = function(extension) {
        if (!extension) {
          return;
        }

        // since Twilio is going to be by default the first extension,
        // if it's turned off, make sure to make the next non-Twilio
        // extension in the list the active extension
        if (
          !$scope.hasTwilioIntegration &&
          extension.provider === 'twilio'
        ) {
          var firstNonTwilioExtension = _.find($scope.tenantUser.extensions, function (val) {
            return val.provider !== 'twilio';
          });
          if (firstNonTwilioExtension) {
            extension = firstNonTwilioExtension;
          }
        }

        if (
          // if there is no active extension...
          !$scope.tenantUser.activeExtension ||
          // ...or if there is one but the extension we're setting as active
          // is not the same as the one that's currently active...
          !_.isEqual(extension.value, $scope.tenantUser.activeExtension.value) ||
          // ...or if it's twilio, in which case we also have to make sure that
          // the region is unique
          (
            extension.provider === 'twilio' &&
            !_.isEqual(extension.region, $scope.tenantUser.activeExtension.region)
          )
        ) {

          $scope.tenantUser.activeExtension = extension;
        }
      };

      vm.createExtension = function(){
        vm.creatingExtension = true;
        webRtcHideShow();
      };

      // prevents issue where sometimes Edit link isn't showing
      // up next to extension upon clicking on a new user row
      $scope.$on('table:resource:selected', function () {
        flagFormsAsClosed();
      });

      webRtcHideShow();
      flagFormsAsClosed();
      // $scope.newExtension.type = 'webrtc';
      // $scope.newExtension.region = GlobalRegionsList[0].value;

    }
  ]);
