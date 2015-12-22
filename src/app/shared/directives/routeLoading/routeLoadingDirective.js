'use strict';

angular.module('liveopsConfigPanel')
  .directive('routeLoadingIndicator', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      // for some reason; we can't load template URLs while resolves are firing
      // so we have a hard-coded template
      template: ' \
      <div ng-show="isRouteLoading" class="page-loading-wrapper"> \
        <loading></loading> \
      </div> \
      ',
      replace: true,
      link: function($scope) {
        $scope.isRouteLoading = false;
        $scope.timeout = null;

        var transitionStarted = function() {
          $scope.isRouteLoading = true;
        };

        var transitionDone = function() {
          $timeout.cancel($scope.timeout);
          $scope.isRouteLoading = false;
        };

        $scope.$on('$stateChangeStart', function(event) {
          $timeout.cancel($scope.timeout);

          $scope.timeout = $timeout(function() {
            transitionStarted(event);
          }, 100);
        });

        $scope.$on('$stateChangeSuccess', transitionDone);
        $scope.$on('$stateChangeError', transitionDone);
      }
    };
  }]);
