'use strict';

angular.module('liveopsConfigPanel')
  .directive('loCancel', ['$q',
    function ($q) {
      return {
        restrict: 'A',
        require: ['^loFormCancel'],
        link: function ($scope, $elem, $attrs, $ctrl) {
          $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

          $elem.bind($attrs.event, function () {
            var promise = $q.when($scope.$eval($attrs.loCancel));

            promise.then(function () {
              return $ctrl[0].cancel();
            });

            $scope.$apply();
          });
        }
      };
    }
  ]);