'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormCancel', ['$parse', 'Chain', 'DirtyForms',
    function ($parse, Chain, DirtyForms) {
      return {
        restrict: 'A',
        require: ['ngResource', 'form', '^loDetailsPanel'],
        controller: function() {
          //TODO: this function might make more sense to belong in a FormHelper service that we inject here.
          this.resetForm = function (form) {
            //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
            //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
            angular.forEach(form, function (value, key) {
              if (value && value.hasOwnProperty('$modelValue') && value.$invalid) {
                var displayValue = value.$modelValue;
                if (displayValue === null) {
                  displayValue = undefined;
                }

                form[key].$setViewValue(displayValue);
                form[key].$rollbackViewValue();
              }
            });

            form.$setPristine();
            form.$setUntouched();
          };
        },
        link: function ($scope, $elem, $attrs, $controllers) {
          var chain = Chain.get($attrs.loFormCancel);
          
          $scope.$watch($attrs.ngResource, function(newResource, oldResource) {
            if(oldResource) {
              oldResource.reset();
            }
            
            var form = $parse($attrs.name)($scope);
            var controller = $elem.data('$loFormCancelController');
            controller.resetForm(form);
          });
          
          chain.hook('cancel:form', function () {
            var resource = $parse($attrs.ngResource)($scope);
            var form = $parse($attrs.name)($scope);

            if (resource.isNew() || !form.$dirty) {
              $controllers[2].close();
            } else {
              DirtyForms.confirmIfDirty(function () {
                var controller = $elem.data('$loFormCancelController');

                resource.reset();
                controller.resetForm(form);
              });
            }
          });
        }
      };
    }
  ]);
