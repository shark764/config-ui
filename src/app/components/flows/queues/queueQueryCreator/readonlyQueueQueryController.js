'use strict';

angular.module('liveopsConfigPanel')
  .controller('ReadonlyQueueQueryController', ['$scope', 'Session', 'readonlyGroupExpressionConfig', 'readonlySkillExpressionConfig', 'GroupExpressionModifier', 'SkillExpressionModifier',
    function($scope, Session, readonlyGroupExpressionConfig, readonlySkillExpressionConfig, GroupExpressionModifier, SkillExpressionModifier) {
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
        angular.forEach(readonlyGroupExpressionConfig, function(modifierParams) {
          $scope.groupModifiers.push(new GroupExpressionModifier($scope.rootMap, modifierParams));
        });
        
        $scope.skillModifiers = [];
        angular.forEach(readonlySkillExpressionConfig, function(modifierParams) {
          $scope.skillModifiers.push(new SkillExpressionModifier($scope.rootMap, modifierParams));
        });
      });
    }
  ]);
