(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('QueryCreatorController', QueryCreator);

    function QueryCreator($scope,ZermeloCondition, jsedn, ZermeloObjectGroup, ZermeloQuery, _, Skill, Group, $translate) {
      var vm = this;

      vm.query = new ZermeloQuery();

      if($scope.query) {
        vm.query = ZermeloQuery.fromEdn(jsedn.parse($scope.query));
      }

      vm.addGroup = function (key) {
        vm.query.setGroup(key, new ZermeloObjectGroup());
        vm.possibleGroups.splice(vm.possibleGroups.indexOf(key), 1);
        vm.currentGroup = '';
      };

      vm.removeGroup = function (key) {
        vm.query.removeGroup(key);
        vm.possibleGroups.push(key);
      };

      vm.modelType = function (key) {
        if(key === ':skills') {
          return Skill;
        }

        if(key === ':groups') {
          return Group;
        }

        return null;
      };

      vm.groupModelType = Group;
      vm.skillsModelType = Skill;

      vm.possibleGroups = [':skills', ':groups'];

    };

})();
