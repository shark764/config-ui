'use strict';

angular.module('liveopsConfigPanel')
  .controller('queryBuilderController', ['$translate', '$scope', 'Modal', 'ZermeloService', function($translate, $scope, Modal, ZermeloService) {
    var vm = this;

    vm.isAdvancedMode = false;
    vm.query = ZermeloService.getQuery();
    vm.advancedQuery = ZermeloService.toEdnString();


    vm.basicMode = function() {
      vm.query = ZermeloService.parseString(vm.advancedQuery);

      if (!vm.query) {
        return Modal.showConfirm(
          {
            message: $translate.instant('queue.details.version.query.basic.invalid'),
            okCallback: function () {
              vm.query = ZermeloService.getQuery();
              vm.isAdvancedMode = false;
            }
          }
        );
      }

      vm.isAdvancedMode = false;
    };

    vm.advancedMode = function() {
      vm.advancedQuery = ZermeloService.toEdnString();
      vm.isAdvancedMode = true;
    };

    vm.addLevel = function() {
      vm.query = ZermeloService.addQueryLevel();
      vm.advancedQuery = ZermeloService.toEdnString();
    };

    vm.removeLevel = function(level) {
      vm.query = ZermeloService.removeQueryLevel(level);
      vm.advancedQuery = ZermeloService.toEdnString();
    };

    vm.updateQueryLevel = function(level, time, form, multiplier) {
      var newTime = time * multiplier;
      var validity = vm.query.at(level - 1).at(ZermeloService.keywordEnum.ASIQ) < newTime;
      form.amount.$setValidity('minTime', validity);

      if(!validity) {
        form.amount.$setTouched();
        return;
      }

      vm.query = ZermeloService.updateQueryLevel(level, newTime);
      vm.advancedQuery = ZermeloService.toEdnString();
    };

  }]);
