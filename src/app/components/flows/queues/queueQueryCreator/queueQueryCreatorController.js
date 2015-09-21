'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueQueryCreatorController', ['$scope', 'Session', 'basicExpressionModifierConfig', 'BasicExpressionModifier',
    function($scope, Session, basicExpressionModifierConfig, BasicExpressionModifier) {
      var self = this;

      $scope.add = function(modifier, operand) {
        modifier.add(operand);
      };
      
      $scope.remove = function(expression, operand) {
        modifier.remove(operand);
      };
      
      $scope.rootMap = new jsedn.Map();
      
      $scope.modifiers = [];
      
      angular.forEach(basicExpressionModifierConfig, function(modifierParams) {
        $scope.modifiers.push(new BasicExpressionModifier($scope.rootMap, modifierParams));
      });
    }
  ]);
