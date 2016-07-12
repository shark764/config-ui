'use strict';

angular.module('liveopsConfigPanel')
  .controller('CapacityRulesVersionsController', ['$scope', 'Session', 'CapacityRuleVersion',
    function($scope, Session, CapacityRuleVersion) {

      function getDefaultVersion(){
        return new CapacityRuleVersion({
          name: '',
          ruleSet: '{[:voice] 1 [:email :messaging] 4}',
          capacityRuleId: $scope.capacityRule.id,
          tenantId: Session.tenant.tenantId
        });
      }

      $scope.toggleViewing = function(version){
        version.viewing = !version.viewing;
      };

      $scope.addVersion = function(){
        $scope.selectedVersion = getDefaultVersion();
        $scope.createNewVersion = true;
      };

      $scope.saveVersion = function() {
        return $scope.selectedVersion.save(function() {
          $scope.selectedVersion = getDefaultVersion();
          $scope.createNewVersion = false;
        });
      };

      $scope.hideCreateNew = function(){
        $scope.createNewVersion = false;
      };

      $scope.$watch('capacityRule', function(newValue){
        if (newValue){
          $scope.getVersions();
          $scope.capacityRule.reset();
        }
      });
    }
  ]);