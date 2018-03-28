'use strict';

angular.module('liveopsConfigPanel')
  .controller('dispositionListsController', ['dispositionListsTableConfig', 'DispositionList', 'Disposition', 'Session', '$scope', '$translate', 'loEvents', 'Modal', 'Alert', function(dispositionListsTableConfig, DispositionList, Disposition, Session, $scope, $translate, loEvents, Modal, Alert) {
    var vm = this;
    $scope.forms = {};
    vm.tableConfig = dispositionListsTableConfig;

    vm.init = function() {
      $scope.err = false;
      $scope.errBlank = false;
      $scope.errAdd = false;
      vm.dispositionLists = {$promise: {}, $resolved: false};
      DispositionList.cachedQuery({
        tenantId: Session.tenant.tenantId
      }).$promise.then(function(items) {
        vm.dispositionLists = items;
        vm.dispositionLists.forEach(function(list) {
          list.dispositions = list.dispositions.filter(function(dispo) {
            return !angular.isDefined(dispo.type);
          });
          list.dispositions.sort(function(a, b) {
            return a.sortOrder - b.sortOrder;
          });
          var categoriesAdded = [];
          var dispositionListCopy = list.dispositions.slice(0);
          dispositionListCopy.forEach(function(disposition, index) {
            if(angular.isDefined(disposition.hierarchy)) {
              disposition.hierarchy.forEach(function(category) {
                if (categoriesAdded.indexOf(category) === -1) {
                  list.dispositions.splice(index + categoriesAdded.length, 0, {name: category, type: 'category'});
                  categoriesAdded.push(category);
                }
              });
            }
          });

          list.dispositions.forEach(function(item) {
            if (angular.isDefined(item.type)) {
              $scope.$watch(function() {
                return item.name;
              }, function(newVal, oldVal) {
                list.dispositions.forEach(function(dispo) {
                  if (angular.isDefined(dispo.hierarchy) && dispo.hierarchy.includes(oldVal)) {
                    var index = dispo.hierarchy.indexOf(oldVal);
                    dispo.hierarchy[index] = newVal;
                  }
                });
              });
            }
          });
        });
      });
    };

    vm.updateActive = function() {
      var dispositionListCopy = new DispositionList({
        id: vm.selectedDispositionList.id,
        tenantId: vm.selectedDispositionList.tenantId,
        active: !vm.selectedDispositionList.active,
        name: vm.selectedDispositionList.name,
        description: vm.selectedDispositionList.description,
        shared: vm.selectedDispositionList.shared
      });
      vm.selectedDispositionList.active = !vm.selectedDispositionList.active;

      return dispositionListCopy.save(function(result){
        vm.selectedDispositionList.$original.active = result.active;
      });
    };

    $scope.$on(loEvents.tableControls.itemCreate, function() {
      vm.selectedDispositionList = new DispositionList({
        tenantId: Session.tenant.tenantId,
        active: true,
        shared: false,
        dispositions: []
      });
    });

    $scope.$on(loEvents.tableControls.itemSelected, vm.init);

    vm.confirmSubmit = function() {
      if(vm.selectedDispositionList.shared && angular.isDefined(vm.selectedDispositionList.$original) && !vm.selectedDispositionList.$original.shared) {
        return Modal.showConfirm({
          message: $translate.instant('dispositionLists.details.shared.confirm'),
          okCallback: vm.submit
        });
      }
      $scope.err = false;
      vm.submit();
    };

    vm.submit = function() {

      var categories = [];
      var childrenCat = [];
      var countCat = 0;
      var countChild = 0;

      vm.selectedDispositionList.dispositions.forEach(function(disposition) {
        if (disposition.name === $translate.instant('dispositions.details.select')) {
          $scope.err = true;
        }
        if (disposition.type === 'category') {
          categories[countCat] = disposition.name;
          countCat++;
        }
        if (disposition.hierarchy !== 'undefined' && _.size(disposition.hierarchy) > 0 ) {
            childrenCat.push({ parent: disposition.hierarchy[0], pos: countChild });
            countChild++;
        }
      });

      var catFound = 0;
      var dispositionState = false;
      var addDispositionCat = false;
      for (var i = 0; i < categories.length; i++) {
          for (var c=0; c < childrenCat.length; c++) {
            if (categories[i] === childrenCat[c].parent) {
               catFound++;
            }
          }

          if (catFound === 0) {
            addDispositionCat = true;
          }

          if (categories[i] === '') {
            dispositionState = true;
          } else {
            catFound = 0;
          }

      }

      if (dispositionState) {
        $scope.errBlank = true;
        return;
      }

      if (addDispositionCat) {
        $scope.errAdd = true;
        return;
      }

      if ($scope.err) {

        return;
      }
      // our list of dispositions comes back with a lot of extra info on it that we don't need and actually can't send to the API to save.
      // we can get rid of it here, and then when the promise returns, we just set the selectedDispositionList equal to the returned list.
      // since we have to remove the names from the dispositions, we show a loading spinner so the user doesn't notice the name disappear
      $scope.loading = true;

      var copy = vm.selectedDispositionList.dispositions.slice(0);

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


      copy.forEach(function(item, index) {
        item.sortOrder = index;
      });
      vm.selectedDispositionList.dispositions = copy;
      vm.selectedDispositionList.save({
        tenantId: Session.tenant.tenantId
      }, function() {
        $scope.err = false;
        $scope.errBlank = false;
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

    vm.listIsEmpty = function() {
      var list = vm.selectedDispositionList.dispositions;
      for (var i = 0; i < list.length; i++) {
        if (angular.isUndefined(list[i].type) && list[i].name !== $translate.instant('dispositions.details.select')) {
          return false;
        }
      }
      return true;
    };

    $scope.$watch(function() {
      return vm.selectedDispositionList;
    }, function() {
      $scope.err = false;
      vm.duplicateError = false;
    });

    vm.init();

  }]);
