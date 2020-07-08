'use strict';

angular.module('liveopsConfigPanel')
  .controller('CapacityRulesVersionsController', ['$rootScope', '$scope', 'Session', 'CapacityRuleVersion',
    function($rootScope, $scope, Session, CapacityRuleVersion) {
      $scope.forms = {};

      function getDefaultVersion(){
        return new CapacityRuleVersion({
          name: '',
          ruleSet: '{[:voice] 1 [:email :messaging] 4}',
          capacityRuleId: $scope.capacityRule.id,
          tenantId: Session.tenant.tenantId,
          quantifier: 'any'
        });
      }

      $scope.toggleViewing = function(version){
        version.viewing = !version.viewing;
      };

      $scope.addVersion = function(){
        $scope.selectedVersion = getDefaultVersion();
        $scope.createNewVersion = true;
      };

      $rootScope.isVersionFormDirty = function() {
        if ($scope.forms.createVersionForm) {
            return $scope.forms.createVersionForm.$dirty;
        } else {
            return false;
        }
      };

      $rootScope.resetVersionForm = function(){
        $scope.forms.createVersionForm.$setUntouched();
        $scope.forms.createVersionForm.$setPristine();
        $scope.forms.createVersionForm.$dirty = false;

        $scope.selectedVersion = null;
        $scope.createNewVersion = false;
      };

      $scope.saveVersion = function() {
        return $scope.selectedVersion.save(function() {
          $scope.selectedVersion = getDefaultVersion();
          $scope.createNewVersion = false;
        }).then(function(version){
          if(!$scope.capacityRule.activeVersion){
            $scope.capacityRule.activeVersion = version.version;
            $scope.capacityRule.save();
          }
        });
      };

      $scope.hideCreateNew = function(){
        $scope.createNewVersion = false;
      };

      $scope.$watch('capacityRule', function(newValue){
        if (newValue){
          $scope.hideCreateNew();
          $scope.getVersions();
          $scope.capacityRule.reset();
        }
      });
    }
  ]);
