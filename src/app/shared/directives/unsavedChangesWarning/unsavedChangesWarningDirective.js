'use strict';

angular.module('liveopsConfigPanel')
  .directive('unsavedChangesWarning', ['DirtyForms', '$rootScope', '$window', 'Alert', function (DirtyForms, $rootScope, $window, Alert) {
    return {
      restrict: 'A',
      require: '?form',
      link: function link($scope, element, attrs, formController) {

        if (! formController) {
          return;
        }

        $rootScope.$on('$stateChangeStart', function(event){
          if (formController.$dirty){
            Alert.confirm('You have unsaved changes that will be lost. Click OK to continue, or click cancel to stay on this page.', 
                angular.noop, 
                function(){
                  event.preventDefault();
                }
            );
          }
        });
        
        $window.onbeforeunload = function(){
          if (formController.$dirty){
            return 'You have unsaved changes that will be lost!';
          }
        };
        
        DirtyForms.registerForm(formController);
        
        $scope.$on('$destroy', function() {
          DirtyForms.removeForm(formController);
        });
      }
    };
  }]);
