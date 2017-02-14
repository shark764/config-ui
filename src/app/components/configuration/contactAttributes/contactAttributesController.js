'use strict';

angular.module('liveopsConfigPanel')
  .controller('contactAttributesController', ['contactAttributesTableConfig', 'ContactAttribute', 'attributeTypes', 'Session', '$scope', '$translate', 'loEvents', function(contactAttributesTableConfig, ContactAttribute, attributeTypes, Session, $scope, $translate, loEvents) {
    var vm = this;
    var ContactAttributeSvc = new ContactAttribute();

    $scope.forms = {};
    vm.localizations = [];
    vm.tableConfig = contactAttributesTableConfig;


    vm.attributeTypes = attributeTypes;

    vm.attributeIsInherited = function() {
      if (vm.selectedContactAttribute) {
        return vm.selectedContactAttribute.tenantId !== Session.tenant.tenantId;
      }
    };

    vm.contactAttributes = ContactAttribute.cachedQuery({
      tenantId: Session.tenant.tenantId
    });

    vm.contactAttributes.$promise.then(function () {
      ContactAttributeSvc.renderLabelList(vm.contactAttributes);
    });

    vm.updateActive = function() {
      vm.selectedContactAttribute.active = !vm.selectedContactAttribute.active;

      return vm.selectedContactAttribute.save().then(function () {
        ContactAttributeSvc.renderLabelList(vm.contactAttributes);
      });
    };

    vm.submit = function() {
      vm.localizations.forEach(function(locale) {
        vm.selectedContactAttribute.label[locale.language] = locale.label;
      });

      if (vm.selectedContactAttribute.hasOwnProperty('labelVal')) {
        delete vm.selectedContactAttribute.labelVal;
      }
      return vm.selectedContactAttribute.save({
        tenantId: Session.tenant.tenantId
      }, function(resp) {
        vm.selectedContactAttribute = resp;
        ContactAttributeSvc.renderLabelList(vm.contactAttributes);
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
