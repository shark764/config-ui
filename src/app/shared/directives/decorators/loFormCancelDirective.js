'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormCancel', ['$parse', 'Chain', 'DirtyForms',
    function ($parse, Chain, DirtyForms) {
      return {
        restrict: 'A',
        require: ['ngResource', 'form', '^detailsPanel'],
        link: function ($scope, $elem, $attrs, $controllers) {
          var resetForm = function (form) {
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

          var chain = Chain.get($attrs.loFormCancel);
          chain.register('cancel:form', function () {
            DirtyForms.confirmIfDirty(function () {
              var resource = $parse($attrs.ngResource)($scope);
              var form = $parse($attrs.name)($scope);
              if (resource.isNew() || !form.$dirty) {
                $controllers[2].close();
              } else {
                resource.reset();
                resetForm(form);
              }
            });
          });
        }
      };
    }
  ]);
