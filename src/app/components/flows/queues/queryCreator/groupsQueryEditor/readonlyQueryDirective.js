'use strict';

angular.module('liveopsConfigPanel')
  .directive('readonlyQuery', function ($q) {
    return {
      restrict : 'E',
      scope : {
        query : '='
      },
      transclude : true,
      controller : function ($scope, ZermeloQuery) {
        var vm = this;

        $scope.$watch('query', function (nv) {
          try {
            $scope.ednQuery = ZermeloQuery.fromEdn(nv);
          } catch (e) {
            $scope.ednQuery = null
          }

          $scope.showBasicQuery = !!$scope.ednQuery;
        });

      },
      link : function ($scope, element, attrs, ctrl, transclude) {
        transclude($scope, function (clone) {
          element.append(clone);
        });
      }
    };
  });
