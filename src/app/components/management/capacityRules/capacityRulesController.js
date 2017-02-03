'use strict';

angular.module('liveopsConfigPanel')
  .controller('CapacityRulesController', ['$scope', 'Session', 'CapacityRule', 'CapacityRuleVersion', 'capacityRulesTableConfig', 'loEvents',
    function($scope, Session, CapacityRule, CapacityRuleVersion, capacityRulesTableConfig, loEvents) {
      $scope.Session = Session;
      $scope.tableConfig = capacityRulesTableConfig;

      $scope.getVersions = function() {
        if (!$scope.selectedCapacityRule || $scope.selectedCapacityRule.isNew()) {
          return [];
        }

        var versions = CapacityRuleVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          capacityRuleId: $scope.selectedCapacityRule.id
        }, 'CapacityRule' + $scope.selectedCapacityRule.id);

        angular.forEach(versions, function(version, index){
          version.fakeVersion = 'v' + (index + 1);
        });

        return versions;
      };

      $scope.fetchCapacityRules = function() {
        return CapacityRule.cachedQuery({
          tenantId: Session.tenant.tenantId
        }, 'CapacityRule' +  Session.tenant.tenantId);
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.selectedCapacityRule = new CapacityRule({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.updateActive = function() {
        var CapacityRuleCopy = new CapacityRule({
          id: $scope.selectedCapacityRule.id,
          tenantId: $scope.selectedCapacityRule.tenantId,
          active: ! $scope.selectedCapacityRule.active
        });

        return CapacityRuleCopy.save(function(result){
          $scope.selectedCapacityRule.$original.active = result.active;
        });
      };

      $scope.submit = function() {
        return $scope.selectedCapacityRule.save();
      };

    }
  ]);
