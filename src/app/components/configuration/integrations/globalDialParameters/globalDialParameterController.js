'use strict';

angular.module('liveopsConfigPanel')
  .controller('GlobalDialParameterController', ['$scope', 'Session', 'Integration', 'Alert', '$translate',
    function($scope, Session, Integration, Alert, $translate) {

      $scope.createNewGlobalDialParameter = false; //the plus-sign button is displayed when this is false.

      $scope.initChecks = function() {
        if($scope.integration.properties.extensionPrefix == "") {
          //should never have an empty extensionPrefix value. Remove it if there is.
          delete $scope.integration.properties.extensionPrefix;
        }
        if($scope.integration.properties.globalDialParams == "") {
          //want gloablDialParams to be {} and not "" when empty
          delete $scope.integration.properties.globalDialParams;
        }
      }

      //if there is an extension prefix, then display the value. If not, then hide textbox and show plus button.
      if($scope.integration.properties.extensionPrefix) {
        $scope.showExtensionPrefix = true;
      } else {
        $scope.showExtensionPrefix = false;
      }

      $scope.showNewGlobalDialParamFields = function() {
        $scope.createNewGlobalDialParameter = true;
      }
      
      $scope.showNewPrefixExtensionField = function() {
        $scope.showExtensionPrefix = true;
      }

      $scope.deletePrefixExtension = function() {
        if (confirm( $translate.instant('integration.globalDialParams.confirmDeleteGlobalDialSettings') )) {
          delete $scope.integration.properties.extensionPrefix;
          $scope.showExtensionPrefix = false;
          saveGlobalDialParameter();
        }
      }

      function addPropertytToGlobalDialParameter(key, value) {
        var addNewGlobalDialParamTempObj = { };
        addNewGlobalDialParamTempObj[key] = value;

        //if globalDialParams.properties does not exist, then create globalDialParams.properties.globalDialParams
        if (!$scope.integration.properties.globalDialParams) {
          var emptyGlobalDialParams = {"globalDialParams":{}};
          angular.extend($scope.integration.properties, emptyGlobalDialParams);
        }

        angular.extend($scope.integration.properties.globalDialParams, addNewGlobalDialParamTempObj); 
      }

      $scope.addNewGlobalDialParameter = function(){      
        //cannot have duplicate keys.
        if($scope.integration.properties.globalDialParams[$scope.newGlobalDialParamsKey]) {
          Alert.error($translate.instant('integration.globalDialParameter.duplicateKeyError'));
          $scope.newGlobalDialParamsKey = "";
        } else {
          addPropertytToGlobalDialParameter($scope.newGlobalDialParamsKey, $scope.newGlobalDialParamsValue);

          saveGlobalDialParameter();

          $scope.newGlobalDialParamsKey = "";
          $scope.newGlobalDialParamsValue = "";
        }
      };

      function deleteGlobalDialParameter(key) {
        if (confirm($translate.instant('integration.globalDialParams.confirmDeleteGlobalDialParam'))) {
          delete $scope.integration.properties.globalDialParams[key];
          saveGlobalDialParameter();
        }
      }

      $scope.deleteGlobalDialParameter = function(key) {
        deleteGlobalDialParameter(key);
      }

      $scope.editGlobalDialParameter = function(key){
        $scope.oldKey = key;
        $scope.editSelectedGlobalDialParameter = true;
        $scope.createNewGlobalDialParameter = false;

        $scope.newKey = key; //populate the edit's input text box with the original values
        $scope.newValue = $scope.integration.properties.globalDialParams[key];
      }

      $scope.updateGlobalDialParameter = function() { //fires when the update button is pressed when editing value
        //deletes the pair in the json obj before adding a new pair.
        delete $scope.integration.properties.globalDialParams[$scope.oldKey]; //delete first in case the old and new keys are the same
        addPropertytToGlobalDialParameter($scope.newKey, $scope.newValue);
        saveGlobalDialParameter();
      }

      $scope.saveGlobalDialParameter = function(){
        saveGlobalDialParameter();
      }

      function saveGlobalDialParameter() {

        if($scope.integration.description == null) {
          //on a fresh tenant account integration.description: null
          //backend will not allow description to be null, but does allow being an empty string.
          $scope.integration.description = "";
        }

        $scope.integration.save()
        .then(function(){
          Alert.success($translate.instant('value.saveSuccess'));
          reset();
        }, function() {
          Alert.error($translate.instant('value.saveFail'));
 
          if(($scope.integration.properties.accountSid == null) || 
             ($scope.integration.properties.authToken) == null) {
            Alert.error($translate.instant('integration.globalDialParams.requireFields'));
          }
        });
      };

      function reset(){
        $scope.createGlobalDialParameterForm.$setPristine();
        $scope.createGlobalDialParameterForm.$setUntouched();
        $scope.editGlobalDialParameterForm.$setPristine();
        $scope.editGlobalDialParameterForm.$setUntouched();
        $scope.editSelectedGlobalDialParameter = false;
        $scope.createNewGlobalDialParameter = false;
        $scope.selectedGlobalDialParameter = undefined;
      }

      $scope.$watch('integration', function(newVal, oldVal){
        if(newVal === oldVal){ return; }
        reset();
      });
    }
  ]
);