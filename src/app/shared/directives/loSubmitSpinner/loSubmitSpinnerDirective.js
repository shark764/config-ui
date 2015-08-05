'use strict';

angular.module('liveopsConfigPanel')
  .directive('loSubmitSpinner', [function() {
    return {
      replace: false,
      scope : {
        loSubmitSpinnerStatus: '='
      },
      link: function($scope, ele, attr, ctrl) {
        $scope.spinnerElement = angular.element('<a disabled="true" class="btn btn-primary"><i class="fa fa-refresh fa-spin"></i></a>');
        ele.after($scope.spinnerElement);
        $scope.spinnerElement.addClass('ng-hide');

        $scope.$watch('loSubmitSpinnerStatus', function (val) {
          if (angular.isDefined(val)) {
            ele.toggleClass('ng-hide', val);
            $scope.spinnerElement.toggleClass('ng-hide', !val);
          }
        });
      }
    };
   }]);
