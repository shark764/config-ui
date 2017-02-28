'use strict';

angular.module('liveopsConfigPanel')
  .controller('loExtensionsController', ['$rootScope', '$scope', '$q', '$translate', 'Session', '_', 'Alert', 'GlobalRegionsList',
    function($rootScope, $scope, $q, $translate, Session, _, Alert, GlobalRegionsList) {
      var vm = this;
      $scope.newExtension = {};
      $scope.twilioRegions = GlobalRegionsList;

      function flagFormsAsClosed () {
        vm.editingExtension = null;
        vm.creatingExtension = false;
      }

      flagFormsAsClosed();

      vm.resetExtension = function() {
        $scope.newExtension = {};
        $scope.newExtension.type = 'webrtc';
        $scope.newExtension.region = GlobalRegionsList[0].twilioId;

        $scope.loExtensionsForm.$setUntouched();

        flagFormsAsClosed();
      };

      vm.save = function() {
        $scope.tenantUser.activeExtension = $scope.tenantUser.extensions[0];
        var roleId = $scope.tenantUser.roleId;
        delete $scope.tenantUser.roleId;
        return $scope.tenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          $scope.tenantUser.roleId = roleId;
          vm.resetExtension();
          Alert.success($translate.instant('details.extensions.success'));
          return tenantUser;
        }, function(response) {
          $scope.tenantUser.roleId = roleId;
          if(response.data.error.attribute.activeExtension) {
            Alert.error(response.data.error.attribute.activeExtension);
          } else {
            $scope.form
              .loFormSubmitController
              .populateApiErrors(response);

            $scope.form.$setPristine();

            var unbindWatch = $scope.$watch('form.$dirty', function (dirty, oldVal) {
              if (!dirty || (dirty === oldVal)) {
                return;
              }

              $scope.form.extensions.$setDirty();
              unbindWatch();
            });

            Alert.error($translate.instant('details.extensions.error'));
            flagFormsAsClosed();
          }

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
        if (!$scope.tenantUser.activeExtension ||
          !_.isEqual(extension.value, $scope.tenantUser.activeExtension.value)) {

          $scope.tenantUser.activeExtension = extension;
        }
      };

      vm.createExtension = function(){
        vm.creatingExtension = true;
      };


      // prevents issue where sometimes Edit link isn't showing
      // up next to extension upon clicking on a new user row
      $scope.$on('table:resource:selected', function () {
        flagFormsAsClosed();
      });

      $scope.newExtension.type = 'webrtc';
      $scope.newExtension.region = GlobalRegionsList[0].value;

    }
  ]);
