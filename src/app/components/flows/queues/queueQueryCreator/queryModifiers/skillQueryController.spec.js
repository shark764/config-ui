'use strict';

describe('skillQueryController', function () {
  var $scope,
    $controller,
    apiHostname,
    mockSkills,
    mockGroups,
    jsedn,
    rootMap,
    controller;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.skill.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.group.mock'));

  beforeEach(inject(['$controller', 'apiHostname', 'jsedn', 'mockSkills', 'mockGroups',
    function (_$controller, _apiHostname, _jsedn, _mockSkills, _mockGroups) {
      $controller = _$controller;
      apiHostname = _apiHostname;
      mockSkills = _mockSkills;
      mockGroups = _mockGroups;
      jsedn = _jsedn;
    }
  ]));

  beforeEach(inject(['$rootScope', function ($rootScope) {
    $scope = $rootScope.$new();
    rootMap = new jsedn.Map();
    $scope.parentMap = rootMap;
  }]));

  describe('ON add', function () {
    describe('WHEN operator is "and"', function () {
      beforeEach(function () {
        controller = $controller('skillQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'and'
          }
        });
      });

      it('should add skill to query with proficiency >=1', function () {
        var expected = '{:skills (and (and {#uuid "skillId2" (>= 1)}))}';

        controller.add(mockSkills[1]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });

      it('should add 2 skills to query and "and" them together', function () {
        var expected = '{:skills (and (and {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)}))}';

        mockSkills[0].proficiency = 50;
        mockSkills[0].proficiencyOperator = 'gt';

        controller.add(mockSkills[1]);
        controller.add(mockSkills[0]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });

      it('should add 2 skills and a group to query', function () {
        var expected = '{:groups (and (and {#uuid "groupId1" true})) :skills (and (and {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)}))}';
        
        var groupQueryController = $controller('groupQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'and'
          }
        });
        
        mockSkills[0].proficiency = 50;
        mockSkills[0].proficiencyOperator = 'gt';

        groupQueryController.add(mockGroups[0]);
        controller.add(mockSkills[1]);
        controller.add(mockSkills[0]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });

    describe('WHEN operator is "or"', function () {
      beforeEach(function () {
        controller = $controller('skillQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'or'
          }
        });
      });

      it('should add skill to query with proficiency >=1', function () {
        var expected = '{:skills (and (or {#uuid "skillId2" (>= 1)}))}';

        controller.add(mockSkills[1]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });

      it('should add 2 skills to query and "or" them together', function () {
        var expected = '{:skills (and (or {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)}))}';

        mockSkills[0].proficiency = 50;
        mockSkills[0].proficiencyOperator = 'gt';

        controller.add(mockSkills[1]);
        controller.add(mockSkills[0]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });

  });

  describe('ON remove', function () {
    describe('WHEN operator is "and"', function () {
      beforeEach(function () {
        controller = $controller('skillQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'and'
          }
        });
      });
      
      it('should empty the query when the last skill is removed', function() {
        mockSkills[0].proficiencyOperator = 'gte';
        
        controller.add(mockSkills[0]);
        controller.remove(mockSkills[0]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual('{}');
      });
      
      it('should remove the skill specified', function() {
        var expected = '{:skills (and (and {#uuid "skillId2" (>= 1)}))}';
        
        mockSkills[0].proficiencyOperator = 'gte';
        
        controller.add(mockSkills[0]);
        controller.add(mockSkills[1]);
        controller.remove(mockSkills[0]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });
    
    describe('WHEN operator is "or"', function () {
      beforeEach(function () {
        controller = $controller('skillQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'or'
          }
        });
      });
      
      it('should remove the skill specified', function() {
        var expected = '{:skills (and (or {#uuid "skillId2" (>= 1)}))}';
        
        mockSkills[0].proficiencyOperator = 'gte';
        
        controller.add(mockSkills[0]);
        controller.add(mockSkills[1]);
        controller.remove(mockSkills[0]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
      
      it('should not remove anything else when removing last item in operatorList', function() {
        var expected = '{:skills (and (and {#uuid "skillId1" (>= 50)}))}';

        var andSkillQueryController = $controller('skillQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'and'
          }
        });
        
        mockSkills[0].proficiencyOperator = 'gte';
        mockSkills[0].proficiency = 50;
        
        andSkillQueryController.add(mockSkills[0]);
        controller.add(mockSkills[0]);
        controller.add(mockSkills[1]);
        
        controller.remove(mockSkills[0]);
        controller.remove(mockSkills[1]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });
  });
  
  describe('ON parseOperands', function() {
    beforeEach(inject([function () {
      controller = $controller('skillQueryController', {
        '$scope': {
          parentMap: rootMap,
          operator: 'and'
        }
      });
    }]));
    
    it('should return an empty list', inject([function() {
      var operands = controller.parseOperands();
      
      expect(operands.length).toEqual(0);
    }]));
    
    it('should return a single skill', inject(['$httpBackend', function($httpBackend) {
      controller.add(mockSkills[1]);
      
      var operands = controller.parseOperands();
      
      $httpBackend.flush();
      
      expect(operands.length).toEqual(1);
      expect(operands[0].id).toEqual(mockSkills[1].id);
    }]));
    
    it('should return a single skill WHEN another "or" skill is added', inject(['$httpBackend', function($httpBackend) {
      var orSkillController = $controller('skillQueryController', {
        '$scope': {
          parentMap: rootMap,
          operator: 'or'
        }
      });
      
      orSkillController.add(mockSkills[1]);
      controller.add(mockSkills[1]);
      
      var operands = controller.parseOperands();
      
      $httpBackend.flush();
      
      expect(operands.length).toEqual(1);
      expect(operands[0].id).toEqual(mockSkills[1].id);
    }]));
    
    it('should return a single skill that hasProficiency', inject(['$httpBackend', function($httpBackend) {
      mockSkills[0].proficiency = 50;
      mockSkills[0].proficiencyOperator = 'lte';
      
      controller.add(mockSkills[0]);
      
      var operands = controller.parseOperands();
      
      $httpBackend.flush();
      
      expect(operands.length).toEqual(1);
      expect(operands[0].id).toEqual(mockSkills[0].id);
    }]));
  });
});