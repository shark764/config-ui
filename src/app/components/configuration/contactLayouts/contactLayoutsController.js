'use strict';

angular.module('liveopsConfigPanel')
  .controller('contactLayoutsController', ['contactLayoutsTableConfig', 'ContactLayout', 'ContactAttribute', 'attributeTypes', 'Session', '$scope', '$translate', 'loEvents', function(contactLayoutsTableConfig, ContactLayout, ContactAttribute, attributeTypes, Session, $scope, $translate, loEvents) {
    var vm = this;
    $scope.forms = {};
    vm.tableConfig = contactLayoutsTableConfig;

    vm.fetchContactLayouts = function() {
      return ContactLayout.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
    };

    vm.fetchAttributes = function() {
      return ContactAttribute.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
    };

    vm.updateActive = function() {
      vm.selectedContactLayout.active = !vm.selectedContactLayout.active;
      mapAttributeIds();
      return vm.selectedContactLayout.save({
        tenantId: Session.tenant.tenantId
      }, function(resp) {
        vm.selectedContactLayout = resp;
        vm.fetchContactLayouts().$promise.then(function(layouts) {
          // only one layout can be active. The API automatically sets other layouts inactive
          // so we need to update the view for all other layouts
          layouts.forEach(function(layout) {
            if (layout.id !== resp.id) {
              layout.active = false;
              layout.$original.active = false;
            }
          });
        });
      });
    };

    vm.submit = function() {
      mapAttributeIds();
      return vm.selectedContactLayout.save({
        tenantId: Session.tenant.tenantId
      }, function(resp) {
        vm.selectedContactLayout = resp;
      });
    };

    $scope.$on(loEvents.tableControls.itemCreate, function() {
      vm.selectedContactLayout = new ContactLayout({
        tenantId: Session.tenant.tenantId,
        active: false,
        layout: [
          {
            label: {
              'en-US': $translate.instant('contactLayouts.attributes.mandatoryCategory')
            },
            attributes: vm.fetchAttributes().$promise.then(function(attrs) {
              return attrs.filter(function(attr) {
                return attr.mandatory;
              });
            })
          }
        ]
      });
    });

    function mapAttributeIds() {
      vm.selectedContactLayout.layout = vm.selectedContactLayout.layout.map(function(category) {
        var attrIds = category.attributes.map(function(attribute) {
          return attribute.id;
        });
        return {
          label: category.label,
          attributes: attrIds
        };
      });
    }

  }]);
