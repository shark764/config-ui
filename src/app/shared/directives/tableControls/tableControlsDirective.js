'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', [function() {
    return {
      restrict : 'E',
      scope : {
        searchQuery: '=',
        onCreateClick: '=',
        columns: '='
      },
      templateUrl : 'app/shared/directives/tableControls/tableControls.html'
    };
  }]);
