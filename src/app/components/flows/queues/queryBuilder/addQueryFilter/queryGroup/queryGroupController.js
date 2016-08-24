'use strict';

angular.module('liveopsConfigPanel')
  .controller('queryGroupController', ['_', '$scope', 'ZermeloService', function(_, $scope, ZermeloService) {
    var vm = this;

    vm.query = $scope.query;
    vm.hasConditions = false;

    vm.filters = [];

    vm.addFilter = function() {
      if ($scope.group.zermeloKey === "SKILLS") {
        // TODO: Allow user to specify condition
        vm.query = ZermeloService.addFilter($scope.level, $scope.group.zermeloKey, $scope.type, vm.selectedItem.id, ['>=', 1]);
      } else {
        vm.query = ZermeloService.addFilter($scope.level, $scope.group.zermeloKey, $scope.type, vm.selectedItem.id);
      }
      vm.filters.push(vm.selectedItem);
      vm.selectedItem = null;
    };

    vm.removeFilter = function(filter) {
      vm.query = ZermeloService.removeFilter($scope.level, $scope.group.zermeloKey, $scope.type, filter.id);
      _.pull(vm.filters, filter);
    };

    vm.searchFilters = function(item) {
      return !_.includes(vm.filters, item);
    }

    vm.initialize = function() {
      vm.query.at($scope.level).at(ZermeloService.keywordEnum.QUERY).keys.forEach(function(key, idx) {
        if (key.name === $scope.group.key) {
          vm.query.at($scope.level).at(ZermeloService.keywordEnum.QUERY).vals[idx].val.forEach(function(list) {
            if (list.val[0].name === $scope.type || (list.val[0].name === "every" && $scope.type === "all")) {
              vm.filters = $scope.group.items.filter(function(item) {
                if ($scope.group.zermeloKey === "SKILLS") {
                  return _.some(list.val[1].keys, function(listItem) {
                    return listItem._obj === item.id;
                  });
                }
                return _.some(list.val[1].val, function(listItem) {
                  return listItem._obj === item.id;
                });
              });
            }
          });
        }
      });
    };

    vm.initialize();

  }]);
