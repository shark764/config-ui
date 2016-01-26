'use strict';

angular.module('liveopsConfigPanel')
  .controller('loExtensionsController', ['$scope', '$q', '$translate', 'Session', '_', 'Alert',
    function($scope, $q, $translate, Session, _, Alert) {
      var vm = this;
      $scope.newExtension = {};

      vm.resetExtension = function() {
        $scope.newExtension = {};
        $scope.newExtension.type = 'webrtc';
        vm.editingExtension = null;
        $scope.creatingExtension = false;
      };

      vm.save = function() {
        return $scope.tenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          vm.resetExtension();
          Alert.success($translate.instant('details.extensions.success'));
          return tenantUser;
        }, function(response) {
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
          }
          
          $scope.tenantUser.reset();

          return $q.reject(response);
        });
      };

      $scope.add = function() {
        $scope.tenantUser.extensions.push($scope.newExtension);
        return vm.save().then(function(tenantUser) {
          vm.resetExtension();
          return tenantUser;
        });
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

      $scope.createExtension = function(){
        vm.resetExtension();
        $scope.creatingExtension = true;
      };

      $scope.newExtension.type = 'webrtc';
    }
  ]);
