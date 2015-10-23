'use strict';

angular.module('liveopsConfigPanel')
  .directive('readonlyQuery', ['$q', function ($q) {
    return {
      restrict : 'E',
      scope : {
        version : '='
      },
      transclude : true,
      controller : function ($scope) {
        this.setDisplay = function (operandList) {
          $q.when(operandList).then(function(operands){
            $scope.hasValidBasicQuery = $scope.hasValidBasicQuery || operands.length > 0;
            $scope.showBasicQuery = $scope.hasValidBasicQuery;
          });
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
