'use strict';

angular.module('liveopsConfigPanel')
  .directive('loMultibox', ['$timeout', function($timeout){
    return {
      restrict: 'E',
      scope: {
        items: '=',
        resourceName: '@',
        model: '=',
        name: '@',
        displayField: '@'
      },
      templateUrl: 'app/shared/directives/loMultibox/loMultibox.html',
      controller: 'DropdownController', //To handle auto collapsing on click!
      link: function($scope, ele, $attrs, dropCtrl) {
        $scope.onSelect = function(selectedItem){
          $scope.model.id = selectedItem.id;
          $scope.model[$scope.displayField] = selectedItem[$scope.displayField];

          dropCtrl.setShowDrop(false);
          $scope.createMode = false;
          $scope.selectedItem = null;
        };

        $scope.$on('resource:details:' + $scope.resourceName + ':create:success',
          function (event, resource) {
            if ($scope.createMode){
              $scope.onSelect(resource);
            }
        });

        $scope.createItem = function(){
          $scope.$emit('resource:details:create:' + $scope.resourceName, $scope.model);
          $scope.createMode = true;
        };

        $scope.$on('resource:details:' + $scope.resourceName + ':canceled', function () {
          $scope.createMode = false;
        });

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
      }
    };
  }]);
