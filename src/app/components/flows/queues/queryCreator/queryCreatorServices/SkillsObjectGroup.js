(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('SkillObjectGroup', SkillObjectGroup)

    function SkillObjectGroup(ZermelloEntityFactory) {
      return ZermelloEntityFactory.objectGroup('skills');
    };

})();
