'use strict';

angular.module('liveopsConfigPanel')
  .controller('DispatchMappingsController', [
    '$scope', 'Session', 'DispatchMapping', 'Flow', 'Integration', 'dispatchMappingTableConfig', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', 'dispatchMappingDirections', 'loEvents', 'Modal', '$translate', 'Alert', 'validationPatterns',
    function($scope, Session, DispatchMapping, Flow, Integration, dispatchMappingTableConfig, dispatchMappingInteractionFields, dispatchMappingChannelTypes, dispatchMappingDirections, loEvents, Modal, $translate, Alert, validationPatterns) {
      var vm = this;
      $scope.mappingValPatternError = false;
      var e164Pattern = validationPatterns.e164;
      var sipPattern = validationPatterns.sip;

      $scope.patternWarn = function (string) {
        if (
          string &&
          string.length > 0 &&
          $scope.selectedDispatchMapping.interactionField === 'contact-point'
        ) {
          if ($scope.selectedDispatchMapping.channelType === 'voice') {
            if (
              e164Pattern.test(string) ||
              sipPattern.test(string)
            ) {
              $scope.mappingVoiceValPatternError = false;
            } else {
              $scope.mappingVoiceValPatternError = true;
            }
          } else if ($scope.selectedDispatchMapping.channelType === 'sms') {
            if (e164Pattern.test(string)) {
              $scope.mappingSmsValPatternError = false;
            } else {
              $scope.mappingSmsValPatternError = true;
            }
          }
        }
      };

      $scope.clearPatternWarnings = function () {
        $scope.mappingVoiceValPatternError = false;
        $scope.mappingSmsValPatternError = false;
      };

      $scope.create = function() {
        $scope.selectedDispatchMapping = new DispatchMapping({
          tenantId: Session.tenant.tenantId,
          channelType: 'voice',
          active: true
        });
      };

      vm.loadDispatchMappings = function() {
        $scope.dispatchMappings = DispatchMapping.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
        $scope.dispatchMappings.$promise.then(function (mappings) {
          angular.forEach(mappings, function (indivMapping) {
            _.merge(indivMapping, {
              flowNameVal: indivMapping.$original.flow.name
            });
          });
          $scope.dispatchMappings = mappings;
        });
      };

      vm.loadIntegrations = function() {
        $scope.integrations = Integration.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.loadFlows = function() {
        $scope.flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.isTelInput = function() {
        if(!$scope.selectedDispatchMapping) {
          return;
        }

        return ($scope.selectedDispatchMapping.interactionField === 'customer' ||
          $scope.selectedDispatchMapping.interactionField === 'contact-point');
      };

      function saveDispatchMapping () {
        $scope.clearPatternWarnings();
        return $scope.selectedDispatchMapping.save()
        .then(function (response) {
          var savedDispatchMappingIdx = _.findIndex($scope.dispatchMappings, {id: response.id});
          if (savedDispatchMappingIdx || savedDispatchMappingIdx === 0) {
            var flows = Flow.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
            return flows.$promise.then(function (flowResponse) {
              var flowName = _.find(flowResponse, function (indivFlow) {
                return indivFlow.id === response.flowId;
              }).name;
              $scope.dispatchMappings[savedDispatchMappingIdx].flowNameVal = flowName;
              var action = response.updated ? $translate.instant('value.saveSuccess') : $translate.instant('value.saveSuccessCreate');
              Alert.success(action);
            });
          }
        }, function () {
          Alert.error($translate.instant('value.saveFail'));
        });
      }


      $scope.submit = function() {
        // before we save, we want to determine whether or not we launch
        // a confirmation modal to let them know that the mapping value
        // is in the wrong format
        if (
          $scope.mappingVoiceValPatternError ||
          $scope.mappingSmsValPatternError
        ) {
          var mappingErrorMessage;

          if ($scope.mappingVoiceValPatternError) {
            mappingErrorMessage = 'dispatchMappings.mappingValueVoice.pattern.error.confirm';
          } else if ($scope.mappingSmsValPatternError) {
            mappingErrorMessage = 'dispatchMappings.mappingValueSms.pattern.error.confirm';
          }

          Modal.showConfirm({
            message: $translate.instant(mappingErrorMessage),
            okCallback: function () {
              return saveDispatchMapping();
            }
          });
        } else {
          return saveDispatchMapping();
        }

      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });

      $scope.updateActive = function(){
        var dmCopy = new DispatchMapping({
          id: $scope.selectedDispatchMapping.id,
          tenantId: $scope.selectedDispatchMapping.tenantId,
          active: ! $scope.selectedDispatchMapping.active
        });

        return dmCopy.save(function(result){
          $scope.selectedDispatchMapping.$original.active = result.active;
        });
      };

      vm.loadIntegrations();
      vm.loadFlows();
      vm.loadDispatchMappings();

      $scope.tableConfig = dispatchMappingTableConfig;

      $scope.dispatchMappingInteractionFields = dispatchMappingInteractionFields;
      $scope.dispatchMappingChannelTypes = dispatchMappingChannelTypes;
      $scope.dispatchMappingDirections = dispatchMappingDirections;
    }
  ]);
