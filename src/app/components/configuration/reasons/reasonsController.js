'use strict';

angular.module('liveopsConfigPanel')
  .controller('reasonsController', ['reasonsTableConfig', 'Reason', 'Session', '$scope', '$translate', 'loEvents', 'Modal', 'Alert', function(reasonsTableConfig, Reason, Session, $scope, $translate, loEvents, Modal, Alert) {
    var vm = this;
    $scope.forms = {};
    vm.tableConfig = reasonsTableConfig;
    vm.reasons = Reason.cachedQuery({
      tenantId: Session.tenant.tenantId
    });

    vm.updateActive = function() {
      var reasonCopy = new Reason({
        id: vm.selectedReason.id,
        tenantId: vm.selectedReason.tenantId,
        active: !vm.selectedReason.active,
        name: vm.selectedReason.name,
        description: vm.selectedReason.description,
        shared: vm.selectedReason.shared
      });
      vm.selectedReason.active = !vm.selectedReason.active;

      return reasonCopy.save(function(result){
        vm.selectedReason.$original.active = result.active;
      });
    };

    $scope.$on(loEvents.tableControls.itemCreate, function() {
      vm.selectedReason = new Reason({
        tenantId: Session.tenant.tenantId,
        active: true,
        shared: false
      });
    });

    vm.confirmSubmit = function() {
      if(vm.selectedReason.shared && angular.isDefined(vm.selectedReason.$original) && !vm.selectedReason.$original.shared) {
        return Modal.showConfirm({
          message: $translate.instant('reasons.details.shared.confirm'),
          okCallback: vm.submit
        });
      }
      vm.submit();
    };

    vm.submit = function() {
      return vm.selectedReason.save({
        tenantId: Session.tenant.tenantId
      }, null, function(err) {
        Alert.error($translate.instant('value.saveFail'));
      });
    };

  }]);
