'use strict';

angular.module('liveopsConfigPanel')
  .controller('queryGroupController', ['_', '$scope', 'ZermeloService', function(_, $scope, ZermeloService) {
    var vm = this;

    vm.query = $scope.query;
    vm.condition = '>=';
    vm.proficiency = 1;

    var updatedCondition;
    var updatedProficiency;
    var updatedId;
    var updatedLevel;
    var updatedType;

    vm.filters = [];

    vm.addFilter = function(condition, proficiency, level, type, id) {
      if ($scope.group.zermeloKey === 'SKILLS') {
        // by virtue of the fact that we are changing this stuff when
        // clicking the add button, this will trigger
        // the proficiency display change and hydration of the scope
        updatedCondition = condition;
        updatedProficiency = proficiency;
        updatedLevel = level;
        updatedType = type;
        updatedId = id;
      } else {
        vm.query = ZermeloService.addFilter($scope.level, $scope.group.zermeloKey, $scope.type, vm.selectedItem.id);
      }
      vm.condition = '>=';
      vm.proficiency = 1;
      vm.filters.push(vm.selectedItem);
      vm.selectedItem = null;
    };

    vm.displayProficiencyString = function (skillData, type, level) {
      // here is where we watch for the addition of a new skill
      // so we can update the data used to generate the string
      // without overwriting the wrong skill tab
      if (
        updatedCondition &&
        angular.isNumber(updatedProficiency) &&
        angular.isNumber(updatedLevel) &&
        updatedType &&
        updatedId
      ) {
        if (
          type === updatedType &&
          level === updatedLevel &&
          skillData.id === updatedId
        ) {
          skillData.condition = updatedCondition;
          skillData.proficiency = updatedProficiency;

          vm.query = ZermeloService.addFilter(updatedLevel, $scope.group.zermeloKey, updatedType, updatedId, [skillData.condition, skillData.proficiency]);
        }
      }

      var advancedQuery = ZermeloService.toEdnString(vm.query);
      var someOrEvery = type;

      // we are doing this to match the constant value in the service
      // that processes these queries
      if (type === 'all') {
        someOrEvery = 'every';
      }

      return ZermeloService.displayProficiency(skillData, advancedQuery, level, someOrEvery);
    };

    vm.removeFilter = function(filter) {
      vm.query = ZermeloService.removeFilter($scope.level, $scope.group.zermeloKey, $scope.type, filter.id);
      _.pull(vm.filters, filter);
    };

    vm.searchFilters = function(item) {
      return !_.includes(vm.filters, item);
    };

    vm.initialize = function() {
      vm.query.at($scope.level).at(ZermeloService.keywordEnum.QUERY).keys.forEach(function(key, idx) {
        if (key.name === $scope.group.key) {
          vm.query.at($scope.level).at(ZermeloService.keywordEnum.QUERY).vals[idx].val.forEach(function(list) {
            if (list.val[0].name === $scope.type || (list.val[0].name === 'every' && $scope.type === 'all')) {
              vm.filters = $scope.group.items.filter(function(item) {
                if ($scope.group.zermeloKey === 'SKILLS') {
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
