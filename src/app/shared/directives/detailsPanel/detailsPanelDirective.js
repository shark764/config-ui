'use strict';

angular.module('liveopsConfigPanel')
  .directive('loDetailsPanel', ['$location', 'DirtyForms',
    function($location, DirtyForms) {
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
              $scope.$emit('details:panel:close');
            });
          };

          $scope.close = this.close;
        }
      };
    }
  ]);
