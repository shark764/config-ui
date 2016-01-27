'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensionEditor', ['loExtensionProviders', 'loExtensionTypes', function(loExtensionProviders, loExtensionTypes) {
      return {
        restrict: 'E',
        require: '^form',
        scope: {
          extension: '='
        },
        templateUrl: 'app/components/management/users/loExtensions/loExtensionEditor.html',
        link: function($scope, element, attrs, ngFormController){
          $scope.form = ngFormController;
          $scope.loExtensionProviders = loExtensionProviders;
          $scope.loExtensionTypes = loExtensionTypes;
          $scope.sipPattern = '[s|S]{1}[i|I]{1}[p|P]{1}:.*';

          $scope.updateExtension = function() {
            $scope.extension.value = $scope.phoneNumber;
            if ($scope.phoneExtension) {
              $scope.extension.value += 'x' + $scope.phoneExtension;
            } else if ($scope.sipExtension) {
              $scope.extension.value = $scope.sipExtension;
            }
          };
          
          $scope.updateDisplay = function() {
            if ($scope.extension.value){
              if ($scope.extension.type === 'pstn' && $scope.extension.value.contains('x')) {
                var xIndex = $scope.extension.value.indexOf('x');
                $scope.phoneExtension = $scope.extension.value.substring(xIndex + 1, $scope.extension.value.length);
                $scope.phoneNumber = $scope.extension.value.substring(0, xIndex);
              } else if ($scope.extension.type === 'sip') {
                $scope.sipExtension = $scope.extension.value;
              } else {
                $scope.phoneNumber = $scope.extension.value;
              }
            }
          };

          $scope.clearValues = function() {
            $scope.phoneNumber = null;
            $scope.phoneExtension = null;
            $scope.sipExtension = null;

            angular.forEach([
              'type', 'provider', 'telValue', 'sipValue', 'extensiondescription'
            ], function(field) {
              $scope.form[field].$setPristine();
              $scope.form[field].$setUntouched();
              $scope.form[field].$setValidity('api', true);
            });
          };

          $scope.$watch('extension', function(newVal){
            if (!newVal.type){
              $scope.clearValues();
            } else {
              $scope.updateDisplay();
            }
          });
        }
      };
    }
  ]);
