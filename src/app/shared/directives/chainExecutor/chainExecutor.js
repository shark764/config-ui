'use strict';

angular.module('liveopsConfigPanel')
  .directive('loChainExecutor', ['$parse', 'Chain', function ($parse, Chain) {
    return {
      restrict: 'A',
      link: function ($scope, $elem, $attrs) {
        var event = $parse($attrs.event)($scope);
        event = angular.isDefined(event) ? event : 'click';
        
        $elem.bind(event, function () {
          var chainName = $attrs.loChainExecutor;
          Chain.get(chainName).execute();
          $scope.$apply();
        });
      }
    };
  }]);