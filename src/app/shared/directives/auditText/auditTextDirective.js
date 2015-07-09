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
        $scope.getAttributes = function() {
          var attrs = {};
          angular.forEach(attributes.$attr, function(value, index) {
            attrs[index] = attributes[index];
          });

          return attrs;
        };

        $scope.refresh = function () {
          var filter = $filter('translate');
          var attrs = $scope.getAttributes();
          
          if($scope.userId) {
            attrs.displayName = filter('value.unknown');
            attrs.date = $filter('date')($scope.date, 'medium');
            
            var promise = UserCache.get($scope.userId).$promise;
            promise.then(function (user) {
              attrs.displayName = user.displayName;
              element.text(filter($scope.translation, attrs));
            });
          } else {
            element.text(filter($scope.translation, attrs));
          }
        };

        $scope.$watchGroup(['userId', 'date'], function() {
          $scope.refresh();
        });
      }
    };
  }]);
