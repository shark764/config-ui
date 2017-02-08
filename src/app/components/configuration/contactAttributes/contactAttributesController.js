'use strict';

angular.module('liveopsConfigPanel')
  .controller('contactAttributesController', ['contactAttributesTableConfig', 'ContactAttribute', 'attributeTypes', 'Session', '$scope', '$translate', 'loEvents', function(contactAttributesTableConfig, ContactAttribute, attributeTypes, Session, $scope, $translate, loEvents) {
    var vm = this;
    $scope.forms = {};
    vm.localizations = [];
    vm.tableConfig = contactAttributesTableConfig;

    vm.attributeTypes = attributeTypes;

    vm.attributeIsInherited = function() {
      if (vm.selectedContactAttribute) {
        return vm.selectedContactAttribute.tenantId !== Session.tenant.tenantId;
      }
    };

    vm.fetchContactAttributes = function() {
      return ContactAttribute.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
    };

    vm.updateActive = function() {
      vm.selectedContactAttribute.active = !vm.selectedContactAttribute.active;

      return vm.selectedContactAttribute.save();
    };

    vm.submit = function() {
      vm.localizations.forEach(function(locale) {
        vm.selectedContactAttribute.label[locale.language] = locale.label;
      });
      return vm.selectedContactAttribute.save({
        tenantId: Session.tenant.tenantId
      }, function(resp) {
        vm.selectedContactAttribute = resp;
      });
    };

    vm.isTelInput = function() {
      if(!vm.selectedContactAttribute) {
        return;
      }

      return vm.selectedContactAttribute.type === 'phone';
    };

    $scope.$on(loEvents.tableControls.itemCreate, function() {
      vm.selectedContactAttribute = new ContactAttribute({
        tenantId: Session.tenant.tenantId,
        label: {}
      });
    });

  }]);
