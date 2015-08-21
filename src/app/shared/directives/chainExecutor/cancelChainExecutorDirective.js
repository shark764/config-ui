'use strict';

angular.module('liveopsConfigPanel')
  .directive('loCancelChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      require: ['^loFormCancel'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          var chain = Chain.get($attrs.loCancelChainExecutor);

          chain.hook('cancel', function() {
            return $ctrl[0].cancel();
          });
          
          chain.execute();
          $scope.$apply();
        });
      }
    };
  }]);
