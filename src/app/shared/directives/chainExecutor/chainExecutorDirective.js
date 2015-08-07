'use strict';

angular.module('liveopsConfigPanel')
  .directive('loChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      link: function ($scope, $elem, $attrs) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          var chainName = $attrs.loChainExecutor;
          Chain.get(chainName).execute();
          $scope.$apply();
        });
      }
    };
  }]);
