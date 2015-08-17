'use strict';

angular.module('liveopsConfigPanel')
  .directive('loMultibox', ['$timeout', 'filterFilter', '$q', function($timeout, filterFilter, $q){
    return {
      restrict: 'E',
      scope: {
        items: '=',
        resourceName: '@',
        model: '=',
        name: '@',
        sourcePropertyName: '@',
        destinationPropertyName: '@'
      },
      templateUrl: 'app/shared/directives/loMultibox/loMultibox.html',
      controller: 'DropdownController', //To handle auto collapsing on click!
      link: function($scope, ele, $attrs, dropCtrl) {
        if (angular.isUndefined($scope.sourcePropertyName)){
          $scope.sourcePropertyName = 'id';
        }
        
        if (angular.isUndefined($scope.destinationPropertyName)){
          $scope.destinationPropertyName = 'id';
        }
        
        $q.when($scope.items).then(function(){
          //Set the display input to show the display name of the pre-existing value, if any.
          if (angular.isDefined($scope.model[$scope.destinationPropertyName])){
            var filterCriteria = {};
            filterCriteria[$scope.sourcePropertyName] = $scope.model[$scope.destinationPropertyName];
            var existingSelection = filterFilter($scope.items, filterCriteria, true);
            if (angular.isDefined(existingSelection) && existingSelection.length === 1){
              $scope.display = existingSelection[0].getDisplay();
            }
          }
        });
        
        $scope.onSelect = function(selectedItem){
          $scope.model[$scope.destinationPropertyName] = selectedItem[$scope.sourcePropertyName];
          $scope.display = selectedItem.getDisplay();
          
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
