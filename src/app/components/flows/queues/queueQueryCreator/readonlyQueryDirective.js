'use strict';

angular.module('liveopsConfigPanel')
  .directive('readonlyQuery', [function () {
    return {
      restrict : 'E',
      scope : {
        version : '='
      },
      transclude : true,
      controller : function ($scope) {
        this.setDisplay = function (operandList) {
          if (angular.isDefined(operandList.$promise)) {
            operandList.$promise.then(function (operands) {
              $scope.hasValidBasicQuery = $scope.hasValidBasicQuery || operands.length > 0;
              $scope.showBasicQuery = $scope.hasValidBasicQuery;
            });
          } else {
            $scope.hasValidBasicQuery = $scope.hasValidBasicQuery || operandList.length > 0;
            $scope.showBasicQuery = $scope.hasValidBasicQuery;
          }
        };
      },
      link : function ($scope, element, attrs, ctrl, transclude) {
        transclude($scope, function (clone) {
          element.append(clone);
        });
      }
    };
  }
]);
