'use strict';

angular.module('liveopsConfigPanel')
  .directive('unsavedChangesWarning', ['DirtyForms', '$rootScope', '$window', 'Alert', '$translate',
    function(DirtyForms, $rootScope, $window, Alert, $translate) {
      return {
        restrict: 'A',
        require: '?form',
        link: function link($scope, element, attrs, formController) {

          if (!formController) {
            return;
          }

          $scope.destroyStateListener = $rootScope.$on('$stateChangeStart', function(event) {
            if (formController.$dirty) {
              Alert.confirm($translate.instant('unsavedchanges.nav.warning'),
                angular.noop,
                function() {
                  event.preventDefault();
                }
              );
            }
          });

          $window.onbeforeunload = function() {
            if (formController.$dirty) {
              return $translate.instant('unsavedchanges.reload.warning');
            }
          };

          DirtyForms.registerForm(formController);

          $scope.$on('$destroy', function() {
            DirtyForms.removeForm(formController);
            $scope.destroyStateListener();
          });
        }
      };
    }
  ]);
