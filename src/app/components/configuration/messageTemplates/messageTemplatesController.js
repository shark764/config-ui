'use strict';

angular.module('liveopsConfigPanel')
  .controller('messageTemplatesController', ['messageTemplatesTableConfig', 'MessageTemplate', 'templateTypes', 'channelTypes', 'Session', '$scope', '$translate', 'loEvents', 'appFlags',
    function(messageTemplatesTableConfig, MessageTemplate, templateTypes, channelTypes, Session, $scope, $translate, loEvents) {
      var vm = this;
      $scope.forms = {};
      vm.tableConfig = messageTemplatesTableConfig;

      vm.templateTypes = templateTypes;
      vm.channelTypes = channelTypes;

      vm.fetchMessageTemplates = function() {
        return MessageTemplate.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.updateActive = function() {
        vm.selectedMessageTemplate.active = !vm.selectedMessageTemplate.active;

        return vm.selectedMessageTemplate.save();
      };

      vm.submit = function() {
        if (!vm.selectedMessageTemplate.channels.length) {
          vm.noChannelsSelected = true;
          return;
        }
        vm.noChannelsSelected = false;
        return vm.selectedMessageTemplate.save({
          tenantId: Session.tenant.tenantId
        }, function(resp) {
          vm.selectedMessageTemplate = resp;
        });
      };

      vm.toggleCheck = function(channel) {
        var arr = vm.selectedMessageTemplate.channels;

        // either add or remove the channel from the channels array, depending on if it already exists
        if (arr.indexOf(channel.value) !== -1) {
          arr.splice(arr.indexOf(channel.value), 1);
        } else {
          arr.push(channel.value);
        }

        // Reset to 'plaintext' if not email
        if (!vm.onlyEmailSelected()) {
          vm.selectedMessageTemplate.type = templateTypes[0].value;
        }

        $scope.forms.detailsForm.$setDirty();
      };

      vm.onlyEmailSelected = function() {
        return vm.selectedMessageTemplate && vm.selectedMessageTemplate.channels && vm.selectedMessageTemplate.channels.length === 1 && vm.selectedMessageTemplate.channels.indexOf('email') !== -1;
      };

      vm.isRichText = function() {
        return vm.selectedMessageTemplate && vm.selectedMessageTemplate.type === 'html';
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        vm.selectedMessageTemplate = new MessageTemplate({
          tenantId: Session.tenant.tenantId,
          active: true,
          channels: ['sms'],
          type: templateTypes[0].value
        });
      });
    }
  ]);
