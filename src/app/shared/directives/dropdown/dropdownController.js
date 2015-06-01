'use strict';

angular.module('liveopsConfigPanel')
    .controller('DropdownController', ['$scope', '$document', '$element', function ($scope, $document, $element) {
      $scope.showDrop = false;

      //Only bother listening for the click event when a dropdown is open
      $scope.$watch(function() {return $scope.showDrop;}, function(newValue, oldValue) {
        if (newValue && !oldValue) {
          $document.on('click', onClick);
        } else if (! newValue && oldValue){
          $document.off('click', onClick);
        }
      });

      function onClick(event){
        //Hide the dropdown when user clicks outside of it
        var clickedInDropdown = $element.find(event.target).length > 0;
        if (clickedInDropdown) {
          return;
        }

        $scope.$apply(function() {
          $scope.showDrop = false;
        });
      }
    }]);
