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
          ngResource: '=',
          queueController: '=',
          alternateClose: '='
        },
        controller: function($scope) {

          this.close = function() {
            // $scope.alternateClose gives us a chance to override the default close
            // function body if necessary
            if ($scope.alternateClose === true) {
              $scope.$emit(loEvents.tableControls.altClose);
            } else {
              DirtyForms.confirmIfDirty(function() {
                $location.search({
                  id: null
                });
                $scope.ngResource = null;
                $scope.$emit(loEvents.bulkActions.close);
                angular.element('#queue-version-panel').hide();
              });
            }
          };

          $scope.close = this.close;
        }
      };
    }
  ]);
