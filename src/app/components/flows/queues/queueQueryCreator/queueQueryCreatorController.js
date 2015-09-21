'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueQueryCreatorController', ['$scope', 'Session', 'groupExpressionModifierConfig', 'skillExpressionModifierConfig', 'GroupExpressionModifier', 'SkillExpressionModifier',
    function($scope, Session, groupExpressionModifierConfig, skillExpressionModifierConfig, GroupExpressionModifier, SkillExpressionModifier) {
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
        angular.forEach(groupExpressionModifierConfig, function(modifierParams) {
          $scope.groupModifiers.push(new GroupExpressionModifier($scope.rootMap, modifierParams));
        });
        
        $scope.skillModifiers = [];
        angular.forEach(skillExpressionModifierConfig, function(modifierParams) {
          $scope.skillModifiers.push(new SkillExpressionModifier($scope.rootMap, modifierParams));
        });
      });
    }
  ]);
