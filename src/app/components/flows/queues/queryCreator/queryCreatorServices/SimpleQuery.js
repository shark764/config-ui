(function () {
  'use strict';

  angular
    .module('liveopsConfigPanel')
    .factory('SimpleQuery', SimpleQuery)

    function SimpleQuery(ZermelloEntityFactory) {
      return ZermelloEntityFactory.query();
    };

})();
