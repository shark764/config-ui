'use strict';

angular.module('liveopsConfigPanel')
  .controller('reasonListsController', ['reasonListsTableConfig', 'ReasonList', 'Reason', 'Session', '$rootScope', '$scope', '$translate', 'loEvents', 'Modal', 'Alert', function(reasonListsTableConfig, ReasonList, Reason, Session, $rootScope, $scope, $translate, loEvents, Modal, Alert) {
    var vm = this;
    $scope.forms = {};

    vm.tableConfig = reasonListsTableConfig;

    vm.init = function() {
      $scope.err = false;
      $scope.errBlank = false;
      $scope.errAdd = false;
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
      $scope.err = false;
      vm.submit();
    };

    $scope.cancelAction = function(){
      $scope.err = false;
      $scope.errBlank = false;
      $scope.loading = false;
      vm.duplicateError = false;
      vm.init();
    };

    vm.submit = function() {

      var categories = [];
      var childrenCat = [];
      var countCat = 0;
      var countChild = 0;

      vm.selectedReasonList.reasons.forEach(function(reason) {
        if (reason.name === $translate.instant('reasons.details.select')) {
          $scope.err = true;
        }
        if (reason.type === 'category') {
          categories[countCat] = reason.name;
          countCat++;
        }
        if (reason.hierarchy !== 'undefined' && _.size(reason.hierarchy) > 0 ) {
            childrenCat.push({ parent: reason.hierarchy[0], pos: countChild });
            countChild++;
        }
      });

      var catFound = 0;
      var reasonState = false;
      var addReasonCat = false;
      for (var i = 0; i < categories.length; i++) {
          for (var c=0; c < childrenCat.length; c++) {
            if (categories[i] === childrenCat[c].parent) {
               catFound++;
            }
          }

          if (catFound === 0) {
            addReasonCat = true;
          }

          if (categories[i] === '') {
            reasonState = true;
          } else {
            catFound = 0;
          }

      }

      if (reasonState) {
        $scope.errBlank = true;
        return;
      }

      if (addReasonCat) {
        $scope.errAdd = true;
        return;
      }

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
        $scope.errBlank = false;
        $scope.loading = false;
        Alert.success($translate.instant('value.saveSuccess'));
        vm.duplicateError = false;
        vm.init();
        $rootScope.$broadcast('reasons:submit:success');
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

    vm.listIsEmpty = function() {
      var list = vm.selectedReasonList.reasons;
      for (var i = 0; i < list.length; i++) {
        if (angular.isUndefined(list[i].type) && list[i].name !== $translate.instant('reasons.details.select')) {
          return false;
        }
      }
      return true;
    };

    $scope.$watch(function() {
      return vm.selectedReasonList;
    }, function() {
      $scope.err = false;
      vm.duplicateError = false;
    });

    vm.init();

  }]);
