(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .directive('proficiencySelector', QueryCreator);

    function QueryCreator() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/flows/queues/queryCreator/groupsQueryEditor/proficiencySelector.html',
        scope: {
          operator: '=',
          proficiency: '='
        }
      };
    }

})();
