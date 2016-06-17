'use strict';

angular.module('liveopsConfigPanel')
  .controller('dispositionsController', ['dispositionsTableConfig', 'Disposition', 'Session', '$scope', '$translate', 'loEvents', 'Modal', 'Alert', function(dispositionsTableConfig, Disposition, Session, $scope, $translate, loEvents, Modal, Alert) {
    var vm = this;
    $scope.forms = {};
    vm.tableConfig = dispositionsTableConfig;
    vm.dispositions = Disposition.cachedQuery({
      tenantId: Session.tenant.tenantId
    });

    vm.updateActive = function() {
      var dispositionCopy = new Disposition({
        id: vm.selectedDisposition.id,
        tenantId: vm.selectedDisposition.tenantId,
        active: !vm.selectedDisposition.active,
        name: vm.selectedDisposition.name,
        description: vm.selectedDisposition.description,
        shared: vm.selectedDisposition.shared
      });
      vm.selectedDisposition.active = !vm.selectedDisposition.active;

      return dispositionCopy.save(function(result){
        vm.selectedDisposition.$original.active = result.active;
      });
    };

    $scope.$on(loEvents.tableControls.itemCreate, function() {
      vm.selectedDisposition = new Disposition({
        tenantId: Session.tenant.tenantId,
        active: true,
        shared: false
      });
    });

    vm.confirmSubmit = function() {
      if(vm.selectedDisposition.shared && angular.isDefined(vm.selectedDisposition.$original) && !vm.selectedDisposition.$original.shared) {
        return Modal.showConfirm({
          message: $translate.instant('dispositions.details.shared.confirm'),
          okCallback: vm.submit
        });
      }
      vm.submit();
    };

    vm.submit = function() {
      return vm.selectedDisposition.save({
        tenantId: Session.tenant.tenantId
      }, null, function(err) {
        Alert.error($translate.instant('value.saveFail'));
      });
    };

  }]);
