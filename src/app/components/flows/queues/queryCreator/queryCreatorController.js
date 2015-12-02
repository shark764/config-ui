(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .controller('QueryCreatorController', QueryCreator);

    function QueryCreator($scope,ZermeloCondition, jsedn,
      ZermeloObjectGroup, ZermeloQuery, _, Skill, Group) {
      var vm = this;

      vm.query = ZermeloQuery.fromEdn(jsedn.parse('{:skills (and (or {#uuid "4ea839a0-92e2-11e5-a2fa-c1ae7ae4ed37" true}))}'));

      vm.randomCondition = function (item) {
        var condition = new ZermeloCondition('uuid', item.id);
        condition.filter = _.sample([true, ['>=', 10]]);
        return condition;
      };

      vm.selectEntity = function (entity) {
        vm.possibleEntities.splice(entity, 1);
        vm.selectedEntities.push(entity);
        vm.query.addGroup(entity.key, entity.objectGroup);
      };

      vm.possibleEntities = [
        {
          name: 'Skills',
          key: 'skills',
          objectGroup: new ZermeloObjectGroup('skills'),
          objects: Skill.cachedQuery(),
          templateUrl: 'app/components/flows/queues/queryCreator/skillQueryCreator.html'
        },
        {
          name: 'Groups',
          key: 'groups',
          objectGroup: new ZermeloObjectGroup('groups'),
          objects: Group.cachedQuery(),
          templateUrl: 'app/components/flows/queues/queryCreator/groupQueryCreator.html'
        }
      ];

      vm.selectedEntities = [];


    };

})();
