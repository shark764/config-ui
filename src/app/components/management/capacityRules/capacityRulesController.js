'use strict';

angular.module('liveopsConfigPanel')
  .controller('CapacityRulesController', ['$rootScope', '$scope', 'Session', 'CapacityRule', 'CapacityRuleVersion', 'capacityRulesTableConfig', 'Modal', '$translate', 'Alert', 'loEvents',
    function($rootScope, $scope, Session, CapacityRule, CapacityRuleVersion, capacityRulesTableConfig, Modal, $translate, Alert, loEvents) {
      $scope.Session = Session;
      $scope.tableConfig = capacityRulesTableConfig;
      $scope.forms = {};

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
        return $scope.selectedCapacityRule.save()
        .then(function(capacityRule) {
            if (capacityRule.updated === null) {
                Alert.success($translate.instant('value.saveSuccessCreate'));
            } else {
                Alert.success($translate.instant('value.saveSuccess'));
            }

            $scope.forms.detailsForm.$setUntouched();
            $scope.forms.detailsForm.$setPristine();
            $scope.forms.detailsForm.$dirty = false;
        });
      };

      $scope.confirmCancel = function() {
        if (($scope.forms.detailsForm && $scope.forms.detailsForm.$dirty) || $rootScope.isVersionFormDirty()) {
            return Modal.showConfirm({
                message: $translate.instant('unsavedchanges.nav.warning'),
                okCallback: reset
            });
        } else {
            reset();
        }
      };

      function reset() {
        if ($rootScope.isVersionFormDirty()) {
            $rootScope.resetVersionForm();
        }

        $scope.forms.detailsForm.$setUntouched();
        $scope.forms.detailsForm.$setPristine();
        $scope.selectedCapacityRule = null;
        $scope.forms.detailsForm.$dirty = false;
      }
    }
  ]);
