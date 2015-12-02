(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .directive('queryCreator', QueryCreator);

    function QueryCreator() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/flows/queues/queryCreator/queryCreator.html',
        controller: 'QueryCreatorController as qc',
        scope: {
          query: '='
        }
      };
    }

})();
