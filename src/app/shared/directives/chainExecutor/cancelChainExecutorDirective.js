'use strict';

angular.module('liveopsConfigPanel')
  .directive('loCancelChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      require: ['^loFormCancel'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        var chainName = $attrs.loCancelChainExecutor;
        var chain = Chain.get(chainName);

        chain.hook('cancel', function() {
          return $ctrl[0].cancel();
        });

        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          Chain.get(chainName).execute();
          $scope.$apply();
        });
      }
    };
  }]);
