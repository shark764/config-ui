'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensionEditor', ['$rootScope', 'GlobalRegionsList',  'validationPatterns', function($rootScope, GlobalRegionsList, validationPatterns) {
      return {
        restrict: 'E',
        require: '^form',
        scope: {
          extension: '=',
          allExtensions: '=',
          lec: '=',
          hasTwilioIntegration: '=',
          loExtensionTypes: '=',
          loExtensionProviders: '='
        },
        templateUrl: 'app/components/management/users/loExtensions/loExtensionEditor.html',
        link: function($scope, element, attrs, ngFormController){
          $scope.form = ngFormController;
          $scope.sipPattern = validationPatterns.sip;
          $scope.twilioRegions = GlobalRegionsList;

          // grab Twilio's default description list for resetting Twilio desc later on
          function getDefaultTwilioDesc (extensionList) {
            var defaultTwilioDesc = _.find(extensionList, {provider: 'twilio'});
            if (angular.isDefined(defaultTwilioDesc)) {
              return defaultTwilioDesc.description;
            }
          }

          var defaultTwilioDesc = getDefaultTwilioDesc($scope.allExtensions);

          $scope.updateExtension = function() {
            if ($scope.sipExtension) {
                $scope.extension.value = $scope.sipExtension;
              } else {
                $scope.extension.value = $scope.phoneNumber;
              }
          };

          $scope.updateDisplay = function() {
            if ($scope.extension.value){
              if ($scope.extension.type === 'sip') {
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

            if (angular.isDefined($scope.extension.provider)) {
              delete $scope.extension.provider;
            }

            if (!angular.isDefined($scope.extension.region)) {
              $scope.extension.region = GlobalRegionsList[0].twilioId;
            }

            angular.forEach([
              'type', 'provider', 'telValue', 'sipValue', 'extensiondescription', 'region'
            ], function(field) {
              if (!$scope.form[field]) {
                return;
              }

              $scope.form[field].$setPristine();
              $scope.form[field].$setUntouched();
              $scope.form[field].$setValidity('api', true);
            });
          };

          $scope.clearProviderDesc = function (currentSelection) {
            // clears out the provider desc for providers without
            // without wiping out Twilio's hard-code desc field
            if (currentSelection !== 'twilio') {
              $scope.extension.description = null;
            } else {
              $scope.extension.description = defaultTwilioDesc;
            }
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
