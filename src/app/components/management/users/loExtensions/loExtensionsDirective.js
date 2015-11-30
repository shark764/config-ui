'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensions', ['$q', '$parse', 'Session', 'loExtensionProviders', 'loExtensionTypes',
    function ($q, $parse, Session, loExtensionProviders, loExtensionTypes) {
      return {
        restrict: 'E',
        scope: {
          tenantUser: '=',
          ngDisabled: '='
        },
        templateUrl: 'app/components/management/users/loExtensions/loExtensions.html',
        link: function ($scope) {
          $scope.loExtensionProviders = loExtensionProviders;
          $scope.loExtensionTypes = loExtensionTypes;

          $scope.newExtension = {};

          function save() {
            delete $scope.tenantUser.status;
            delete $scope.tenantUser.roleId;

            return $scope.tenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function(tenantUser) {
              $scope.newExtension = {};
              $scope.newExtension.type = 'webrtc';

              angular.forEach(['type', 'provider', 'value'], function(field) {
                $scope.userTenantExtensionForm[field].$setPristine();
                $scope.userTenantExtensionForm[field].$setUntouched();
              });

              return tenantUser;
            }, function(error) {
              var def = $q.defer();

              $scope.tenantUser.reset();

              def.reject(error);
              return def.promise;
            });
          }

          $scope.add = function() {
            $scope.newExtension.value = $scope.phoneNumber;
            if ($scope.phoneExtension){
              $scope.newExtension.value += 'x' + $scope.phoneExtension;
            } else if ($scope.sipExtension) {
              $scope.newExtension.value = $scope.sipExtension;
            }

            $scope.tenantUser.extensions.push($scope.newExtension);
            return save().then(function(tenantUser) {
              $scope.phoneNumber = null;
              $scope.phoneExtension = null;
              return tenantUser;
            });
          };

          $scope.clearValues = function(){
            /*
            $scope.phoneNumber = null;
            $scope.phoneExtension = null;
            $scope.sipExtension = null;
            $scope.newExtension.provider = null;
            */
          };
          
          $scope.remove = function(extension) {
            $scope.tenantUser.extensions.removeItem(extension);
            return save();
          };

          $scope.moved = function(index) {
            $scope.tenantUser.extensions.splice(index, 1);
            return save();
          };

          $scope.newExtension.type = 'webrtc';
        }
      };
    }
  ]);
