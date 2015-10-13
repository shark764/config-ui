'use strict';

describe('skillQueryController', function () {
  var $scope,
    $groupScope,
    $controller,
    apiHostname,
    mockSkills,
    mockGroups,
    jsedn,
    rootMap,
    groupQueryController;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));

  beforeEach(inject(['$controller', 'apiHostname', 'jsedn', 'mockSkills', 'mockGroups',
    function (_$controller, _apiHostname, _jsedn, _mockSkills, _mockGroups) {
      $controller = _$controller;
      apiHostname = _apiHostname;
      mockSkills = _mockSkills;
      mockGroups = _mockGroups;
      jsedn = _jsedn;
    }
  ]));
  
  beforeEach(inject(['$rootScope', function($rootScope) {
    $scope = $rootScope.$new();
    rootMap = new jsedn.Map();
    $scope.parentMap = rootMap;
  }]));
  
  beforeEach(inject(['$rootScope', function($rootScope) {
    $groupScope = $rootScope.$new();
    $groupScope.parentMap = rootMap;
    $groupScope.operator = 'and';
    
    groupQueryController = $controller('groupQueryController', {
      '$scope': $groupScope
    });
  }]));
  
  describe('ON add', function() {
    var skillQueryController;
    
    describe('WHEN operator is "and"', function() {
      beforeEach(function() {
        $scope.operator = 'and';
        skillQueryController = $controller('skillQueryController', {
          '$scope': $scope
        });
      });
      
      it('should add skill to query with proficiency >=1', function() {
        var expected = '{:skills (and (and {#uuid "skillId2" (>= 1)}))}'
        
        $scope.add(mockSkills[1]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected)
      });
      
      it('should add 2 skills to query and and them together', function() {
        var expected = '{:skills (and (and {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)}))}'
        
        mockSkills[0].proficiency = 50;
        mockSkills[0].proficiencyOperator = 'gt';
        
        $scope.add(mockSkills[1]);
        $scope.add(mockSkills[0]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected)
      });
      
      it('should add 2 skills and a group to query', function() {
        var expected = '{:groups (and (and {#uuid "groupId1" true})) :skills (and (and {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)}))}'
        
        mockSkills[0].proficiency = 50;
        mockSkills[0].proficiencyOperator = 'gt';
        
        $groupScope.add(mockGroups[0]);
        $scope.add(mockSkills[1]);
        $scope.add(mockSkills[0]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected)
      });
    });
    
    describe('WHEN operator is "or"', function() {
      beforeEach(function() {
        $scope.operator = 'or';
        skillQueryController = $controller('skillQueryController', {
          '$scope': $scope
        });
      });
      
      it('should add skill to query with proficiency >=1', function() {
        var expected = '{:skills (and (or {#uuid "skillId2" (>= 1)}))}'
        
        $scope.add(mockSkills[1]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected)
      });
      
      it('should add 2 skills to query and and them together', function() {
        var expected = '{:skills (and (or {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)}))}'
        
        mockSkills[0].proficiency = 50;
        mockSkills[0].proficiencyOperator = 'gt';
        
        $scope.add(mockSkills[1]);
        $scope.add(mockSkills[0]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected)
      });
    });
    
  });
});