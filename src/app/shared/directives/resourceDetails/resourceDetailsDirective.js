'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', [function() {
    return {
      restrict: 'AE',
      scope : {
        resource: '=',
        headerTemplateUrl: '@',
        bodyTemplateUrl: '@',
        extendScope: '=',
        queryParams: '='
      },
      templateUrl : 'app/shared/directives/resourceDetails/resourceDetails.html',

      link : function($scope) {
        angular.extend($scope, $scope.extendScope);
        $scope.oResource = angular.copy($scope.resource);

        $scope.save = function () {
          $scope.resource.save($scope.queryParams,
            function (result) {
              $scope.detailsForm.$setPristine();
              $scope.resource = result;
              $scope.oResource = angular.copy($scope.resource);
            }
          );
        };

        $scope.$watch('resource', function () {
          $scope.oResource = angular.copy($scope.resource);
        });

        $scope.cancel = function () {
          angular.copy($scope.oResource, $scope.resource);
          $scope.detailsForm.$setPristine();
        };
      }
    };
   }]);
