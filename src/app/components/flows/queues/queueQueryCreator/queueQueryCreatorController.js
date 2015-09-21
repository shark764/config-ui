'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueQueryCreatorController', ['$scope', 'Session', 'basicExpressionModifierConfig', 'skillExpressionModifierConfig', 'BasicExpressionModifier',
    function($scope, Session, basicExpressionModifierConfig, skillExpressionModifierConfig, BasicExpressionModifier) {
      var self = this;

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
        
        $scope.groupModifiers = [];
        angular.forEach(basicExpressionModifierConfig, function(modifierParams) {
          $scope.groupModifiers.push(new BasicExpressionModifier($scope.rootMap, modifierParams));
        });
        
        $scope.skillModifiers = [];
        angular.forEach(skillExpressionModifierConfig, function(modifierParams) {
          $scope.skillModifiers.push(new BasicExpressionModifier($scope.rootMap, modifierParams));
        });
      });
    }
  ]);
