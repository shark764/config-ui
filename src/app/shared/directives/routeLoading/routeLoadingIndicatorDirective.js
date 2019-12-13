'use strict';

angular.module('liveopsConfigPanel')
  .directive('routeLoadingIndicator', ['$timeout', 'loEvents', '$stateParams', function($timeout, loEvents, $stateParams) {
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

          // when performing preventDefault on config2 route change, donot execute transitionStarted as the loadinig state remains there forever
          if (!event.defaultPrevented && !$stateParams.config2) {
            $timeout.cancel($scope.timeout);

            $scope.timeout = $timeout(function() {
              transitionStarted(event);
            }, 100);
          }
        });

        $scope.$on('$stateChangeSuccess', transitionDone);
        $scope.$on('$stateChangeError', transitionDone);
        $scope.$on(loEvents.state.changeCanceled, transitionDone); //Fired by unsavedChangesWarning if user selects "cancel" to keep their changes
      }
    };
  }]);
