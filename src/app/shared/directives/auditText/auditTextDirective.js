'use strict';

angular.module('liveopsConfigPanel')
  .directive('auditText', ['$filter', 'UserCache', function ($filter, UserCache) {
    return {
      restrict: 'AE',
      scope: {
        translation: '@',
        userId: '=',
        date: '='
      },
      link: function ($scope, element, attributes) {
        var getAttributes = function() {
          var attrs = {};
          angular.forEach(attributes.$attr, function(value, index) {
            attrs[index] = attributes[index];
          });

          return attrs;
        };

        $scope.refresh = function () {
          if($scope.userId) {
            var filter = $filter('translate');
            var attrs = getAttributes();
            attrs.displayName = filter('value.unknown');
            attrs.date = $filter('date')($scope.date, 'medium');
            var promise = UserCache.get($scope.userId).$promise;
            promise.then(function (user) {
              attrs.displayName = user.displayName;
              element.text(filter($scope.translation, attrs));
            });

            element.text(filter($scope.translation, attrs));
          }
        };

        $scope.$watchGroup(['userId', 'date'], function() {
          $scope.refresh();
        });
      }
    };
  }]);
