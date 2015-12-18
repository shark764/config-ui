'use strict';

angular.module('liveopsConfigPanel')
  .directive('routeLoadingIndicator', function() {
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

        $scope.$on('$stateChangeStart', function() {
          $scope.isRouteLoading = true;
        });

        $scope.$on('$stateChangeSuccess', function() {
          $scope.isRouteLoading = false;
        });
      }
    };
  });
