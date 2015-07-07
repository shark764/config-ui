'use strict';

angular.module('liveopsConfigPanel')
  .controller('DropdownController', ['$scope', '$document', '$element', function ($scope, $document, $element) {
    $scope.showDrop = false;
    this.testname = $scope.label;
    this.setShowDrop = function(val){
      $scope.showDrop = val;
    };
    
    //Only bother listening for the click event when a dropdown is open
    $scope.$watch(function(){
        return $scope.showDrop;
      },
      function (newValue, oldValue) {
        if (newValue && !oldValue) {
          $document.on('click', onClick);
        } else if (!newValue && oldValue && typeof $scope.hovering !== 'undefined' && ! $scope.hovering) {
          $document.off('click', onClick);
        }
    });

    function onClick(event) {
      //Hide the dropdown when user clicks outside of it
      var clickedInDropdown = $element.find(event.target).length > 0;
      if (clickedInDropdown) {
        return;
      }

      $scope.$apply(function () {
        $scope.showDrop = false;
        if (typeof $scope.hovering !== 'undefined'){
          $scope.hovering = false;
        }
      });
      
      $document.off('click', onClick);
    }
  }]);