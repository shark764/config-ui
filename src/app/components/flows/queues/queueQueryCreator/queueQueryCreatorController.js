'use strict';

angular.module('liveopsConfigPanel')
.controller('QueueQueryCreatorController', ['$scope', 'Session', 'Group', 'Skill', '$q', function($scope, Session, Group, Skill, $q){
  $scope.fetchGroups = function(){
    return Group.cachedQuery({
      tenantId: Session.tenant.tenantId
    });
  };
  
  $scope.fetchSkills = function(){
    return Skill.cachedQuery({
      tenantId: Session.tenant.tenantId
    });
  };
  
  $scope.queryComponents = {};
  
  $scope.createComponentTracker = function(type, operator, items){
    var componentData = {
      list: [],
      selected: null,
      type: type,
      operator: operator,
      labelKey: 'queue.query.builder.' + type + '.' + operator,
      placeholderKey: 'queue.query.builder.' + type + '.placeholder',
      dropItems : []
    };
    
    items.$promise.then(function(originalItems){
      componentData.dropItems = angular.copy(originalItems);
    });
    
    if (! $scope.queryComponents[type]){
      $scope.queryComponents[type] = [];
    }
    
    $scope.queryComponents[type].push(componentData);
  };
  
  $scope.createComponentTracker('groups', 'or', $scope.fetchGroups());
  $scope.createComponentTracker('groups', 'and', $scope.fetchGroups());
  $scope.createComponentTracker('skills', 'or', $scope.fetchSkills());
  $scope.createComponentTracker('skills', 'and', $scope.fetchSkills());

  $scope.add = function(queryComponent){
    queryComponent.list.push(queryComponent.selected);
    queryComponent.dropItems.removeItem(queryComponent.selected);
    queryComponent.selected = null;
  };
  
  $scope.remove = function(queryComponent, item){
    queryComponent.list.removeItem(item);
    queryComponent.dropItems.push(item);
  };
  
}]);