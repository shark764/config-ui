'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormSubmit', ['$parse', 'Chain',
    function($parse) {
      return {
        restrict: 'A',
        require: ['form'],
        controller: function() {
          var self = this;

          this.populateApiErrors = function(error) {
            if ($parse('data.error')(error)) {
              angular.forEach(error.data.error.attribute,
                function(value, key) {
                  self.formController[key].$setValidity('api', false);
                  self.formController[key].$error = {
                    api: value
                  };
                  self.formController[key].$setTouched();
                });
            }

            return error;
          };
        },
        link: function($scope, $elem, $attrs, $ctrl) {
          var controller = $elem.data('$loFormSubmitController');
          controller.formController = $ctrl[0];
          controller.formCancelController = $ctrl[1];
        }
      };
    }
  ]);
