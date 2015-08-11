'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormSubmit', ['$parse', '$q', 'Chain',
    function($parse, $q, Chain) {
      return {
        restrict: 'A',
        require: ['form', 'loFormCancel'],
        controller: function($scope) {
          this.resetForm = function() {
            return this.formCancelController.resetForm(this.formController);
          };

          this.populateApiErrors = function(error) {
            if ($parse('data.error')(error)) {
              angular.forEach(error.data.error.attribute,
                function(value, key) {
                  this.formController[key].$setValidity('api', false);
                  this.formController[key].$error = {
                    api: value
                  };
                  this.formController[key].$setTouched();
                });
            }

            return error;
          }
        },
        link: function($scope, $elem, $attrs, $ctrl) {
          var controller = $elem.data('$loFormSubmitController');
          controller.formController = $ctrl[0];
          controller.formCancelController = $ctrl[1];
        }
      };
    }
  ]);
