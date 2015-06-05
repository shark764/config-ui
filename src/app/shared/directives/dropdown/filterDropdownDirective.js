'use strict';

angular.module('liveopsConfigPanel')
  .directive('filterDropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@'
      },
      templateUrl : 'app/shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link : function($scope) {
        //Automatically uncheck other filters when "All" is selected
        if ($scope.items.all) {

          $scope.$watch('items.filters', function () {

              for(var i = 0; i < $scope.items.filters.length; i++){
                var item = $scope.items.filters[i];

                if(item.checked){
                  $scope.items.all.checked = false;
                  return;
                }
              }

              $scope.items.all.checked = true;
          }, true);

          $scope.$watch('items.all.checked',

            function(newValue, oldValue) {

              if (newValue && !oldValue) {

                angular.forEach($scope.items.filters, function(state) {
                  state.checked = false;
                });
              }
            }
          );
        }
      }
    };
   }])
;
