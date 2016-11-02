'use strict';

angular.module('liveopsConfigPanel')
  .controller('ListenersController', ['$scope', 'Session', 'Listener',
    function($scope, Session, Listener) {

      $scope.createNewListener = false;

      $scope.propertiesSchema = {
        salesforce: {
          topic: {
            type: 'string'
          },
          type: {
            type: 'string'
          }
        },
        facebook: {
          pageToken: {
            type: 'string'
          },
          pageId: {
            type: 'string'
          }
        },
        email: {
          email: {
            type: 'string'
          },
          password: {
            type: 'password'
          }
        }
      };

      $scope.addNewListener = function(){
        $scope.selectedListener = new Listener({
          tenantId: Session.tenant.tenantId,
          integrationId: $scope.integration.id,
          active: false
        });
        $scope.editSelectedListener = false;
        $scope.createNewListener = true;
      };

      $scope.editListener = function(listener){
        $scope.editSelectedListener = true;
        $scope.createNewListener = false;
        $scope.selectedListener = listener;
      };

      $scope.saveListener = function(){
        angular.forEach($scope.selectedListener.properties, function(val, key){
          if(val === '' || _.keys($scope.propertiesSchema[$scope.integration.type]).indexOf(key) === -1){
            delete $scope.selectedListener.properties[key];
          }
        });


        $scope.selectedListener.save().finally(function(){
          reset();
        });
      };

      function reset(){
        $scope.createListenerForm.$setPristine();
        $scope.createListenerForm.$setUntouched();
        $scope.editListenerForm.$setPristine();
        $scope.editListenerForm.$setUntouched();
        $scope.editSelectedListener = false;
        $scope.createNewListener = false;
        $scope.selectedListener = undefined;
      }

      $scope.$watch('integration', function(newVal, oldVal){
        if(newVal === oldVal){ return; }
        reset();
      });
    }
  ]
);
