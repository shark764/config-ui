(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('GroupsObjectGroup', SkillObjectGroup)

    function SkillObjectGroup(ZermelloEntityFactory) {
      return ZermelloEntityFactory.objectGroup('groups');
    };

})();
