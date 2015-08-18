'use strict';

angular.module('liveopsConfigPanel')
  .directive('loSubmitSpinner', [function() {
    return {
      scope : {
        loSubmitSpinnerStatus: '&'
      },
      link: function($scope, ele) {
        $scope.spinnerElement = angular.element('<a disabled="true"><i class="fa fa-refresh fa-spin"></i></a>');
        $scope.spinnerElement.addClass(ele[0].className);
        $scope.spinnerElement.addClass('ng-hide');
        ele.after($scope.spinnerElement);

        $scope.$watch('loSubmitSpinnerStatus()', function (val) {
          if (angular.isDefined(val)) {
            ele.toggleClass('ng-hide', val);
            $scope.spinnerElement.toggleClass('ng-hide', !val);
          }
        });
      }
    };
   }]);
