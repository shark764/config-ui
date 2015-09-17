'use strict';

angular.module('liveopsConfigPanel')
.controller('QueueQueryCreatorController', ['$scope', 'Session', 'version', 'queue', 'Group', 'Skill', 'jsedn', '$q', function($scope, Session, version, queue, Group, Skill, jsedn, $q){
  $scope.version = version;
  $scope.queue = queue;
  
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

  $scope.publish = function (){
    var ednGroups = null;
    var ednSkills = null;
    var ednTest = null;
    var kwGroups = null;
    var kwSkills = null;

    for ( var type in $scope.queryComponents ){
      var tmp = ":" + type;

      if (type == 'groups'){
        kwGroups = new jsedn.kw(tmp);
        ednGroups = $scope.processGroups($scope.queryComponents[type]);
      }

      if (type == 'skills'){
        kwSkills = new jsedn.kw(tmp);
        ednSkills = $scope.processSkills($scope.queryComponents[type]);
      }
    }

    if (ednGroups != null && ednSkills != null){
      ednTest = jsedn.unify("{?key1 ?key1-val ?key2 ?key2-val}", "{key1 " + kwGroups + " key1-val " + jsedn.encode(ednGroups) + " key2 " + kwSkills + " key2-val " + jsedn.encode(ednSkills) + "}")
    } else if (ednGroups != null) {
      ednTest = jsedn.unify("{?key1 ?key1-val}", "{key1 " + kwGroups + " key1-val " + jsedn.encode(ednGroups) + "}")
    } else if (ednSkills != null){
      ednTest = jsedn.unify("{?key1 ?key1-val}", "{key1 " + kwSkills + " key1-val " + jsedn.encode(ednSkills) + "}")
    } else {
      ednTest = null;
    }

    
  };

  $scope.processGroups = function (groups){
    var andList = [];
    var orList = [];
    var andVector = null;
    var orVector = null;

    for (var andOr = 0; andOr < groups.length; andOr++){
      for ( var listItem = 0; listItem < groups[andOr].list.length; listItem++){
        if (groups[andOr].operator == 'or'){
          orList.push(groups[andOr].list[listItem].name);
        } else if (groups[andOr].operator == 'and'){
          andList.push(groups[andOr].list[listItem].name);
        }
      }
    }

    if (andList.length > 0){
      var andVector = new jsedn.Vector(andList);
    }

    if (orList.length > 0){
      var orVector = new jsedn.Vector(orList);
    }

    if (orVector != null && andVector != null){
      return jsedn.unify("((some ?key1-val1) (every ?key1-val2))", "{key1-val1 " + orVector + " key1-val2 " + andVector +"}");
    } else if (orVector != null) {
      return jsedn.unify("(some ?key1-val)", "{key1-val " +orVector + "}");
    } else if (andVector != null){
      return jsedn.unify("(every ?key1-val)", "{key1-val " + andVector + "}");
    } else {
      return null;
    }
  }

  $scope.processSkills = function (skills){
    var andList = [];
    var orList = [];
    var andVector = null;
    var orVector = null;

    for (var andOr = 0; andOr < skills.length; andOr++){
      for ( var listItem = 0; listItem < skills[andOr].list.length; listItem++){
        if (skills[andOr].operator == 'or'){
          orList.push(skills[andOr].list[listItem].name);
        } else if (skills[andOr].operator == 'and'){
          andList.push(skills[andOr].list[listItem].name);
        }
      }
    }

    if (andList.length > 0){
      var andVector = new jsedn.Vector(andList);
    }

    if (orList.length > 0){
      var orVector = new jsedn.Vector(orList);
    }

    if (orVector != null && andVector != null){
      return jsedn.unify("((some ?key1-val1) (every ?key1-val2))", "{key1-val1 " + orVector + " key1-val2 " + andVector +"}");
    } else if (orVector != null) {
      return jsedn.unify("(some ?key1-val)", "{key1-val " +orVector + "}");
    } else if (andVector != null){
      return jsedn.unify("(every ?key1-val)", "{key1-val " + andVector + "}");
    } else {
      return null;
    }
  }
  
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