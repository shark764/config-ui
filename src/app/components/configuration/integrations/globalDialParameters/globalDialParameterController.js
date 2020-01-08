'use strict';

angular.module('liveopsConfigPanel')
  .controller('GlobalDialParameterController', ['$scope', 'Session', 'Integration', 'Alert', '$translate',
    function($scope, Session, Integration, Alert, $translate) {

      //the plus-sign button form is displayed when this is false. Create GDP form is displayed when true.
      $scope.createNewGlobalDialParameter = false;

      $scope.initChecks = function() {
        if($scope.integration.properties.extensionPrefix == "") {
          //should never have an empty extensionPrefix value in the json obj. Remove it if there is.
          delete $scope.integration.properties.extensionPrefix;
        }
        if( ($scope.integration.properties.globalDialParams == "") ||  
            (typeof $scope.integration.properties.globalDialParams == 'undefined')){
          //want gloablDialParams to be {} and not "" when empty in the json obj.
          $scope.integration.properties.globalDialParams = {};
        }
      }

      $scope.showNewGlobalDialParamFields = function() {
        $scope.createNewGlobalDialParameter = true;
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
          Alert.error($translate.instant('integration.globalDialParameter.duplicateKeyError'))
          $scope.newGlobalDialParamsKey = ""
        } else {
          addPropertytToGlobalDialParameter($scope.newGlobalDialParamsKey, $scope.newGlobalDialParamsValue)

          $scope.newGlobalDialParamsKey = ""
          $scope.newGlobalDialParamsValue = ""
          $scope.createNewGlobalDialParameter = false

          //a change to the GDP table has been made, so make the parent form (in integrations.html) $dirty
          $scope.forms.detailsForm.$setDirty()
        }
      };

      function deleteGlobalDialParameter(key) {
        //a change to the GDP table has been made, so $setDirty() the form to display a warning msg if the user leaves the page with unsaved changes
        $scope.sendAlertForm.$setDirty()

        delete $scope.integration.properties.globalDialParams[key];
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

        $scope.editSelectedGlobalDialParameter = false
        
        //a change to the GDP table has been made, so make the parent form (in integrations.html) $dirty
        $scope.forms.detailsForm.$setDirty()
      }
    }
  ]
);