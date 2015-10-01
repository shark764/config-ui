'use strict';

angular.module('liveopsConfigPanel')
  .directive('loMultibox', ['$timeout', 'filterFilter', '$q', function($timeout, filterFilter, $q){
    return {
      restrict: 'E',
      scope: {
        items: '=',
        selectedItem: '=',
        resourceName: '@',
        name: '@',
        onItemSelect: '='
      },
      templateUrl: 'app/shared/directives/loMultibox/loMultibox.html',
      controller: 'DropdownController', //To handle auto collapsing on click!
      link: function($scope, ele, $attrs, dropCtrl) {
        
        $scope.onSelect = function(selectedItem){
          $scope.display = selectedItem.getDisplay();
          
          if(angular.isFunction($scope.onItemSelect)) {
            $scope.onItemSelect(selectedItem);
          }

          dropCtrl.setShowDrop(false);
          $scope.createMode = false;
        };

        $scope.createItem = function(){
          $scope.$emit('resource:details:create:' + $scope.resourceName, $scope.selectedItem);
          $scope.createMode = true;
        };

        $scope.labelClick = function(){
          dropCtrl.setShowDrop(!$scope.showDrop);
          
          $scope.selectedItem = null;

          if ($scope.showDrop){
            $timeout(function(){
              var input = ele.find('type-ahead input');
              input.focus();
            });
          }
        };

        $scope.$watch('selectedItem', function(item) {
          if(item && angular.isFunction(item.getDisplay)) {
            $scope.display = item.getDisplay();
          } else if(angular.isString(item)) {
            $scope.display = item;
          }
        }, true);

        $scope.$on('resource:details:' + $scope.resourceName + ':canceled', function () {
          $scope.createMode = false;
        });

        $scope.$on('created:resource:' + $scope.resourceName,
          function (event, resource) {
            if ($scope.createMode){
              $scope.onSelect(resource);
            }
        });
      }
    };
  }]);
