'use strict';

angular.module('liveopsConfigPanel')
  .directive('seperateValidation', [function () {
    return {
      restrict: 'A',
      require: '?form',
      link: function link($scope, element, iAttrs, formController) {

        if (! formController) {
          return;
        }

        // Remove this form from parent controller
        var parentFormController = element.parent().controller('form');
        if(parentFormController){
          parentFormController.$removeControl(formController);
        }
        // Replace form controller with a "null-controller"
        var nullFormCtrl = {
          $addControl: angular.noop,
          $removeControl: angular.noop,

          $setValidity: function () {
            formController.$invalid = false;

            angular.forEach(element.find('input'), function (ele){
              if(formController[ele.name] && formController[ele.name].$error) {
                for (var prop in formController[ele.name].$error){
                  if(prop) {
                    formController.$invalid = true;
                    break;
                  }

                  if(formController.$invalid){
                    return false;
                  }
                }
              }

            });

          },
          $setDirty: function () {
            formController.$dirty = true;
          },
          $setPristine: function (value) {
            formController.$pristine = value;
          }
        };

        angular.extend(formController, nullFormCtrl);
      }
    };
  }]);
