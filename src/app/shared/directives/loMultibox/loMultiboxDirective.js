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
          $scope.onItemSelect(selectedItem);

          dropCtrl.setShowDrop(false);
          $scope.createMode = false;
        };

        $scope.createItem = function(){
          // $scope.$emit('resource:details:create:' + $scope.resourceName, $scope.model);
          $scope.createMode = true;
        };

        $scope.labelClick = function(){
          dropCtrl.setShowDrop(!$scope.showDrop);

          if ($scope.showDrop){
            $timeout(function(){
              var input = ele.find('type-ahead input');
              input.focus();
            });
          }
        };

        $scope.$watch('selectedItem', function(item) {
          if(item) {
            if(item.getDisplay) {
              $scope.display = item.getDisplay();
            } else {
              $scope.display = item;
            }
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
