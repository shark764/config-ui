(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('QueryCreatorController', QueryCreator);

    function QueryCreator($scope, QueryKeyword, GroupsKeyword, SkillsKeyword, UUIDTag) {
      var vm = this;
      vm.query = new QueryKeyword();

      vm.tag = new UUIDTag();
      vm.tag.value = 'abc-123';
      console.log(vm.tag.toEDN());

      vm.possibleEntities = [
        {
          name: 'Skills',
          entity: SkillsKeyword
        },
        {
          name: 'Groups',
          entity: GroupsKeyword
        }
      ];

      vm.addEntity = function (entity) {
        vm.query.addObject(entity);
      };

    };

})();
