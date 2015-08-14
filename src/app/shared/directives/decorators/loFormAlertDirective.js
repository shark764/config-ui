'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormAlert', ['$parse', 'Alert',
    function ($parse, Alert) {
      return {
        restrict: 'A',
        require: ['loFormSubmit'],
        link: function ($scope) {
          $scope.$on('form:submit:success', function(event, resource) {
            var action = resource.updated ? 'updated' : 'saved';
            Alert.success('Record ' + action);
          });

          $scope.$on('form:submit:failure', function(event, resource) {
            var action = resource.updated ? 'update' : 'save';
            Alert.error('Record failed to ' + action);
          });
        }
      };
    }
  ]);
