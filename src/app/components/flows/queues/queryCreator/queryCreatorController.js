(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('QueryCreatorController', QueryCreator);

    function QueryCreator($scope, ZermeloCondition, jsedn, ZermeloObjectGroup,
      ZermeloQuery, _, Skill, Group, $translate, Alert) {

      var vm = this;

      var ALLOWED_GROUP_KEYS = [':skills', ':groups'];

      $scope.$watch(function (){
        return $scope.query;
      }, function (nv) {
        if(!vm.query || (nv && nv != vm.query.toEdn().ednEncode())) {

          try {
            var ednQuery = ZermeloQuery.fromEdn(jsedn.parse(nv));
            return vm.initQuery(ednQuery);
          } catch (e) { }

          vm.advancedQuery = nv;
          vm.isAdvancedMode = true;
          vm.forms.advancedQueryForm.query.$setTouched();
        }
      });

      $scope.$watch(function () {
        return vm.query;
      }, function (nv, ov) {
        if(vm.query) {
          $scope.query = vm.query.toEdn().ednEncode();
        }
      }, true);

      vm.advancedQueryChanged = function () {
        if(!vm.initialAdvancedQuery ) {
          vm.initialAdvancedQuery = ZermeloQuery.fromEdn(jsedn.parse(vm.advancedQuery));
        }
      };

      vm.advancedMode = function () {
        vm.advancedQuery = vm.query.toEdn(true).ednEncode();
        vm.initialAdvancedQuery = vm.advancedQuery;
        vm.isAdvancedMode = true;
      };

      vm.basicMode = function () {
        var query = null;

        try {
          query = ZermeloQuery.fromEdn(jsedn.parse(vm.advancedQuery));
        } catch (e) {}

        if(!query) {
          return Alert.confirm($translate.instant('queue.details.version.query.basic.invalid'),
            function () {
              vm.initQuery(ZermeloQuery.fromEdn(jsedn.parse(vm.initialAdvancedQuery)));
              vm.isAdvancedMode = false;
            },
            angular.noop
          )
        }

        vm.initQuery(query);
        vm.isAdvancedMode = false;
      };

      vm.initQuery = function (query) {
        vm.query = query || new ZermeloQuery();

        vm.possibleGroups = _.xor(_.pluck(vm.query.groups, 'key'), ALLOWED_GROUP_KEYS);
      };

      vm.addGroup = function (key) {
        vm.query.setGroup(key, new ZermeloObjectGroup());
        vm.possibleGroups.splice(vm.possibleGroups.indexOf(key), 1);
        vm.currentGroup = '';
      };

      vm.verifyRemoveGroup = function (key) {
        if(vm.query.getGroup(key).objectGroup.hasConditions()) {
          return Alert.confirm($translate.instant('queue.query.builder.remove.filter.confirm'),
            function () {
              vm.removeGroup(key);
            }, angular.noop
          );
        }

        return vm.removeGroup(key);
      };

      vm.removeGroup = function(key) {
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

      vm.possibleGroups = ALLOWED_GROUP_KEYS;
      vm.isAdvancedMode = false;
    };

})();
