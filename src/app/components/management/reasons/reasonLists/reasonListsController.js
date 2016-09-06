'use strict';

angular.module('liveopsConfigPanel')
  .controller('reasonListsController', ['reasonListsTableConfig', 'ReasonList', 'Reason', 'Session', '$scope', '$translate', 'loEvents', 'Modal', 'Alert', function(reasonListsTableConfig, ReasonList, Reason, Session, $scope, $translate, loEvents, Modal, Alert) {
    var vm = this;
    $scope.forms = {};
    $scope.err = false;
    vm.tableConfig = reasonListsTableConfig;

    vm.init = function() {
      vm.reasonLists = {$promise: {}, $resolved: false};
      ReasonList.cachedQuery({
        tenantId: Session.tenant.tenantId
      }).$promise.then(function(items) {
        vm.reasonLists = items;
        vm.reasonLists.forEach(function(list) {
          list.reasons = list.reasons.filter(function(reason) {
            return !angular.isDefined(reason.type);
          });
          list.reasons.sort(function(a, b) {
            return a.sortOrder - b.sortOrder;
          });
          var categoriesAdded = [];
          var reasonListCopy = list.reasons.slice(0);
          reasonListCopy.forEach(function(reason, index) {
            if(angular.isDefined(reason.hierarchy)) {
              reason.hierarchy.forEach(function(category) {
                if (categoriesAdded.indexOf(category) === -1) {
                  list.reasons.splice(index + categoriesAdded.length, 0, {name: category, type: 'category'});
                  categoriesAdded.push(category);
                }
              });
            }
          });

          list.reasons.forEach(function(item) {
            if (angular.isDefined(item.type)) {
              $scope.$watch(function() {
                return item.name;
              }, function(newVal, oldVal) {
                list.reasons.forEach(function(reason) {
                  if (angular.isDefined(reason.hierarchy) && reason.hierarchy.includes(oldVal)) {
                    var index = reason.hierarchy.indexOf(oldVal);
                    reason.hierarchy[index] = newVal;
                  }
                });
              });
            }
          });
        });
      });
    };

    vm.updateActive = function() {
      var reasonListCopy = new ReasonList({
        id: vm.selectedReasonList.id,
        tenantId: vm.selectedReasonList.tenantId,
        active: !vm.selectedReasonList.active,
        name: vm.selectedReasonList.name,
        description: vm.selectedReasonList.description,
        shared: vm.selectedReasonList.shared
      });
      vm.selectedReasonList.active = !vm.selectedReasonList.active;

      return reasonListCopy.save(function(result){
        vm.selectedReasonList.$original.active = result.active;
      });
    };

    $scope.$on(loEvents.tableControls.itemCreate, function() {
      vm.selectedReasonList = new ReasonList({
        tenantId: Session.tenant.tenantId,
        active: true,
        shared: false,
        reasons: []
      });
    });

    $scope.$on(loEvents.tableControls.itemSelected, vm.init);

    vm.confirmSubmit = function() {
      if(vm.selectedReasonList.shared && angular.isDefined(vm.selectedReasonList.$original) && !vm.selectedReasonList.$original.shared) {
        return Modal.showConfirm({
          message: $translate.instant('reasonLists.details.shared.confirm'),
          okCallback: vm.submit
        });
      }
      vm.submit();
    };

    vm.submit = function() {
      vm.selectedReasonList.reasons.forEach(function(reason) {
        if (reason.name === $translate.instant('reasons.details.select')) {
          $scope.err = true;
        }
      });
      if ($scope.err) {
        return;
      }
      // our list of reasons comes back with a lot of extra info on it that we don't need and actually can't send to the API to save.
      // we can get rid of it here, and then when the promise returns, we just set the selectedReasonList equal to the returned list.
      // since we have to remove the names from the reasons, we show a loading spinner so the user doesn't notice the name disappear
      $scope.loading = true;
      var copy = vm.selectedReasonList.reasons.slice(0);
      for (var i = 0; i < copy.length; i++) {
        if (angular.isDefined(copy[i].type)) {
          copy.splice(i, 1);
          i--;
          continue;
        }
        delete copy[i].active;
        delete copy[i].description;
        delete copy[i].externalId;
        delete copy[i].shared;
        delete copy[i].tenantId;
        delete copy[i].name;
      }
      copy.forEach(function(reason, index) {
        reason.sortOrder = index;
      });
      vm.selectedReasonList.reasons = copy;
      vm.selectedReasonList.save({
        tenantId: Session.tenant.tenantId
      }, function() {
        $scope.err = false;
        $scope.loading = false;
        Alert.success($translate.instant('value.saveSuccess'));
        vm.duplicateError = false;
        vm.init();
      }, function(err) {
        Alert.error($translate.instant('value.saveFail'));
        $scope.forms.detailsForm.$setDirty();
        $scope.loading = false;
        if(err.data.error.attribute.name) {
          vm.duplicateError = true;
          vm.duplicateErrorMessage = err.data.error.attribute.name.capitalize();
        }
      });
    };

    $scope.$watch(function() {
      return vm.selectedReasonList;
    }, function() {
      vm.duplicateError = false;
    });

    vm.init();

  }]);
