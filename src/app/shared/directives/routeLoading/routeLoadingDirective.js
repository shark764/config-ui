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

        $scope.$on('$stateChangeStart', function() {
          $scope.timeout = $timeout(function () {
            $scope.isRouteLoading = true;
          }, 100);
        });

        $scope.$on('$stateChangeSuccess', function() {
          $timeout.cancel($scope.timeout);
          $scope.isRouteLoading = false;
        });
      }
    };
  }]);
