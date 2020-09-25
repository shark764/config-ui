'use strict';

angular.module('liveopsConfigPanel')
  .directive('languagePicker', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/login/languagePicker/languagePicker.html',
        controller: 'languagePickerController as lpc',
        link: function($scope, element) {
          $scope.$watch('showSelector', function(){
            var eventListener = function(e) {
              var cursorFocus = function(elem) {
                var x = window.scrollX, y = window.scrollY;
                elem.focus();
                window.scrollTo(x, y);
              }

              if (element.find(e.target).length === 0) {
                $scope.$apply(function(){
                  $scope.showSelector = false;
                  $scope.showOptions = false;
                });
              } else {
                cursorFocus(document.getElementsByClassName('selected')[0]);
              }
            }
            if ($scope.showSelector) {
              document.addEventListener('click', eventListener);
            } else {
              document.removeEventListener('click', eventListener);
            }
          })
        }
      };
    }
  ]);