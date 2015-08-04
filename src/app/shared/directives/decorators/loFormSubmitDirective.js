'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormSubmit', ['$parse', 'Chain',
    function ($parse, Chain) {
      return {
        restrict: 'A',
        require: ['form'],
        link: function ($scope, $elem, $attrs) {
          var chain = Chain.get($attrs.loFormSubmit);
          var form = $parse($attrs.name)($scope);
          
          chain.register('form:error:api', {
            failure: function (error) {
              if (error.data.error) {
                var attributes = error.data.error.attribute;

                angular.forEach(attributes, function (value, key) {
                  form[key].$setValidity('api', false);
                  form[key].$error = {
                    api: value
                  };
                  form[key].$setTouched();
                });
              }
              
              return error;
            }
          }, 99);
          
          chain.register('emit:event', {
            success: function(resource) {
              $scope.$emit('form:submit:success', resource);
            },
            failure: function(error) {
              $scope.$emit('form:submit:failure', error);
            }
          }, 100);
        }
      };
    }
  ]);