'use strict';

angular.module('liveopsConfigPanel')
  .directive('auditText', ['$filter', 'User',
    function ($filter, User) {
      return {
        restrict: 'AE',
        scope: {
          translation: '@',
          userId: '=',
          date: '='
        },
        template: '{{get()}}',
        link: function ($scope) {
          $scope.get = function () {
            if (!$scope.userId) {
              return  $filter('translate')($scope.translation, {
                date: $filter('date')($scope.date, 'medium')
              });
            }

            var user = User.cachedGet({
              id: $scope.userId
            });

            if(user.$resolved) {
              $scope.text = $filter('translate')($scope.translation, {
                displayName: user.getDisplay(),
                date: $filter('date')($scope.date, 'medium')
              });
            }

            return $scope.text;
          };
        }
      };
    }
  ]);