(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('ConditionGroupEditorController', ConditionGroupEditorController);

    function ConditionGroupEditorController($scope, ZermeloCondition, _) {
      var vm = this;

      vm.conditionGroup = $scope.conditionGroup;
      vm.items = $scope.items;
      vm.sectionLabel = $scope.sectionLabel;
      vm.placeholderText = $scope.placeholderText;
      vm.conditionProficiency = 1;
      vm.conditionOperator = '>=';

      vm.findItemForCondition = function(condition) {
        return  _.findWhere(vm.items, {id: condition.identifier});
      };

      vm.getConditionName = function (condition) {
        return vm.findItemForCondition(condition).getDisplay();
      };

      vm.prettyConditionFilter = function (condition) {
        if(condition.filter instanceof Array &&
              vm.findItemForCondition(condition).hasProficiency) {
          return condition.filter[0] + ' ' + condition.filter[1];
        }

        return '';
      };

      vm.addSelectedCondition = function() {
        var cond = new ZermeloCondition('uuid', vm.selectedItem.id);
        cond.setFilter(true);

        if(vm.selectedItem.hasProficiency === false) {
          cond.setFilter(['>=', 1]);
        }
        else if(vm.selectedItem.hasProficiency) {
          cond.setFilter([vm.conditionOperator, vm.conditionProficiency]);
        }

        vm.conditionGroup.addCondition(cond);
        vm.selectedItem = null;
      };

      vm.conditionsFilter = function (item) {
        return !_.includes(vm.conditionGroup.getConditionIdentifiers(), item.id);
      };

    };

})();
