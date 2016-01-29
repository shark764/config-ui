'use strict';

angular.module('liveopsConfigPanel')
  .directive('loDetailsPanel', ['$location', 'DirtyForms', 'loEvents',
    function($location, DirtyForms, loEvents) {
      return {
        restrict: 'E',
        require: ['ngResource'],
        transclude: true,
        templateUrl: 'app/shared/directives/detailsPanel/detailsPanel.html',
        scope: {
          ngResource: '='
        },
        controller: function($scope) {
          this.close = function() {
            DirtyForms.confirmIfDirty(function() {
              $location.search({
                id: null
              });
              $scope.ngResource = null;
              $scope.$emit(loEvents.bulkActions.close);
            });
          };

          $scope.close = this.close;
        }
      };
    }
  ]);
