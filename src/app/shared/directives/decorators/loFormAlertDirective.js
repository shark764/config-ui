'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormAlert', ['$parse', 'Alert',
    function ($parse, Alert) {
      return {
        restrict: 'A',
        require: ['form'],
        link: function ($scope, $elem, $attrs) {
          $scope.$on('form:submit:success', function(event, resource) {
            Alert.success('Record saved.');
          });
          
          $scope.$on('form:submit:failure', function(event, resource) {
            Alert.error('Record failed to save.');
          });
        }
      };
    }
  ]);