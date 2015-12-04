(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .directive('conditionGroupEditor', QueryCreator);

    function QueryCreator() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/flows/queues/queryCreator/groupsQueryEditor/conditionGroupEditor.html',
        controller: 'ConditionGroupEditorController as cqe',
        scope: {
          conditionGroup: '=',
          items: '=',
          sectionLabel: '@',
          placeholderText: '@'
        }
      };
    }

})();
