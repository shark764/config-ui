'use strict';

angular.module('liveopsConfigPanel')
  .directive('loFormAlert', ['$parse', 'Alert',
    function ($parse, Alert) {
      return {
        restrict: 'A',
        require: ['loFormSubmit'],
        controller: function($scope) {
          var self = this;
          
          this.alertSuccess = function(resource) {
            var action = resource.updated ? 'updated' : 'saved';
            Alert.success('Record ' + action);
          };
          
          this.alertFailure = function(resource) {
            var action = resource.updated ? 'update' : 'save';
            Alert.error('Record failed to ' + action);
          };
        },
        link: function ($scope, elem, attr, controller) {
          $scope.$on('form:submit:success', function(event, resource) {
            controller.alertSuccess(resource);
          });

          $scope.$on('form:submit:failure', function(event, resource) {
            controller.alertFailure(resource);
          });
        }
      };
    }
  ]);
