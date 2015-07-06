'use strict';

angular.module('liveopsConfigPanel')
  .directive('filterDropdown', [function () {
    return {
      scope: {
        id: '@',
        options: '=',
        valuePath: '@',
        displayPath: '@',
        label: '@',
        showAll: '@'
      },
      templateUrl: 'app/shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link: function ($scope, element) {
        element.parent().css('overflow', 'visible');
        
        $scope.valuePath = $scope.valuePath ? $scope.valuePath : 'value';
        $scope.displayPath = $scope.displayPath ? $scope.displayPath : 'display';

        // not ideal; we are adding a property to an object that will be used
        // in multiple places; however I cannot find a better way to do this.
        if ($scope.showAll){

           
          // if an option has been selected; if any option was checked, set
          // all to false. if no options are checked, set all to true
          $scope.$watch('options', function () {
            var anyChecked = false;

            angular.forEach($scope.options, function (option){
              if(option.checked) {
                anyChecked = true;
                $scope.all.checked = false;
              }
            });

            if(!anyChecked){
              $scope.all.checked = true;
            }
          }, true);

          var checkAllByDefault = true;
          angular.forEach($scope.options, function (option) {
            checkAllByDefault = checkAllByDefault && option.checked;
          });
          $scope.all = {checked : checkAllByDefault};

          // if all is checked; then set the rest of the options to false
          $scope.$watch('all.checked', function () {
            if($scope.all.checked){
              angular.forEach($scope.options, function(option){
                option.checked = false;
              });
            }
          });
        } else {
          angular.forEach($scope.options, function (option) {
            option.checked = (typeof option.checked === 'undefined' ? true : option.checked);
          });
        }
      }
    };
  }]);
