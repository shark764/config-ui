(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('UUIDCondition', UUIDCondition)
 
    function UUIDCondition(ZermelloEntityFactory) {
      return ZermelloEntityFactory.condition('uuid');
    };

})();
