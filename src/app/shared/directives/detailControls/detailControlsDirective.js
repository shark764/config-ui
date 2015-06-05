'use strict';

angular.module('liveopsConfigPanel')
  .directive('detailControls', [function() {
    return {
      restrict: 'E',
      scope : {
        resource: '=',
        form: '='
      },
      templateUrl : 'app/shared/directives/detailControls/detailControls.html',

      link : function($scope) {
        $scope.oResource = angular.copy($scope.resource);

        $scope.$watch('resource', function () {
          $scope.oResource = angular.copy($scope.resource);
        });

        $scope.cancel = function () {
          $scope.resource = angular.copy($scope.oResource);
          $scope.form.$setPristine();
        };
      }
    };
   }]);
