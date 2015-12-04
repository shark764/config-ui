(function () {
  'use strict';

  angular.module('liveopsConfigPanel')
    .directive('objectGroupEditor', QueryCreator);

    function QueryCreator() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/flows/queues/queryCreator/groupsQueryEditor/objectGroupEditor.html',
        controller: 'ObjectGroupEditorController as oge',
        scope: {
          objectGroup: '=',
          key: '=',
          readonly: '='
        }
      };
    }

})();
