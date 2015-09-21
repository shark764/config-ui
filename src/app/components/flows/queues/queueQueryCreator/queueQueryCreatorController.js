'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueQueryCreatorController', ['$scope', 'Session', 'basicExpressionModifierConfig', 'BasicExpressionModifier',
    function($scope, Session, basicExpressionModifierConfig, BasicExpressionModifier) {
      var self = this;

      $scope.add = function(modifier, operand) {
        modifier.add(operand);
      };
      
      $scope.remove = function(modifier, operand) {
        modifier.remove(operand);
      };
      
      $scope.$watch('rootMap', function(newMap) {
        if(!newMap || !$scope.version) {
          return;
        }
        
        $scope.version.query = jsedn.encode(newMap);
      }, true);
      
      $scope.$watch('version.query', function(newQuery) {
        if(!newQuery) {
          return;
        }
        
        $scope.rootMap = jsedn.parse(newQuery);
        
        $scope.modifiers = [];
        angular.forEach(basicExpressionModifierConfig, function(modifierParams) {
          $scope.modifiers.push(new BasicExpressionModifier($scope.rootMap, modifierParams));
        });
      });
    }
  ]);
