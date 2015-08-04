'use strict';

angular.module('liveopsConfigPanel')
  .directive('detailsPanel', ['$location', 'DirtyForms',
    function ($location, DirtyForms) {
      return {
        restrict: 'EA',
        require: ['ngResource'],
        transclude: true,
        templateUrl: 'app/shared/directives/detailsPanel/detailsPanel.html',
        scope: {
          ngResource: '='
        },
        controller: function($scope) {
          this.close = function() {
            DirtyForms.confirmIfDirty(function(){
              $location.search({id : null});
              $scope.ngResource = null;
            });
          };

          $scope.close = this.close;
        }
      };
    }
  ]);
