(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('QueryCreatorController', QueryCreator);

    function QueryCreator($scope,ZermeloCondition, jsedn, ZermeloObjectGroup,
      ZermeloQuery, _, Skill, Group, $translate, Alert) {

      var vm = this;

      $scope.$watch(function () {
        return vm.query;
      }, function (nv, ov) {
        $scope.query = vm.query.toEdn().ednEncode();
      }, true);

      vm.advancedMode = function () {
        vm.advancedQuery = $scope.query;
        vm.isAdvancedMode = true;
      };

      vm.basicMode = function () {
        try {
          var query = ZermeloQuery.fromEdn(jsedn.parse(vm.advancedQuery));
        } catch (e) {}

        if(!query) {
          return Alert.confirm('Your query is invalid, going back to basic mode will reset your query. Are you sure?',
            function () {
              vm.initQuery($scope.query);
              vm.isAdvancedMode = false;
            },
            angular.noop
          )
        }

        vm.initQuery(vm.advancedQuery);
        vm.isAdvancedMode = false;
      };

      vm.initQuery = function (query) {
        vm.query = new ZermeloQuery();

        if(query) {
          vm.query = ZermeloQuery.fromEdn(jsedn.parse(query));
        }
      };

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
      vm.isAdvancedMode = false;
      vm.initQuery($scope.query);
    };

})();
