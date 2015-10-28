'use strict';

describe('groupQueryController', function () {
  var $scope,
    $controller,
    apiHostname,
    mockGroups,
    mockSkills,
    jsedn,
    rootMap,
    controller;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.groups'));

  beforeEach(inject(['$controller', 'apiHostname', 'jsedn', 'mockGroups', 'mockSkills',
    function (_$controller, _apiHostname, _jsedn, _mockGroups, _mockSkills) {
      $controller = _$controller;
      apiHostname = _apiHostname;
      mockGroups = _mockGroups;
      mockSkills = _mockSkills;
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
        controller = $controller('groupQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'and'
          }
        });
      });

      it('should add group to query', function () {
        var expected = '{:groups (and (and {#uuid "groupId2" true}))}';

        controller.add(mockGroups[1]);
        
        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });

      it('should add 2 groups to query and "and" them together', function () {
        var expected = '{:groups (and (and {#uuid "groupId2" true} {#uuid "groupId1" true}))}';

        controller.add(mockGroups[1]);
        controller.add(mockGroups[0]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });

      it('should add 2 groups and a group to query', function () {
        var expected = '{:skills (and (and {#uuid "skillId2" (>= 1)})) :groups (and (and {#uuid "groupId2" true} {#uuid "groupId1" true}))}';

        var skillQueryController = $controller('skillQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'and'
          }
        });
        
        skillQueryController.add(mockSkills[1]);
        controller.add(mockGroups[1]);
        controller.add(mockGroups[0]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });

    describe('WHEN operator is "or"', function () {
      beforeEach(function () {
        controller = $controller('groupQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'or'
          }
        });
      });

      it('should add group to query', function () {
        var expected = '{:groups (and (or {#uuid "groupId2" true}))}';

        controller.add(mockGroups[1]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });

      it('should add 2 groups to query and "or" them together', function () {
        var expected = '{:groups (and (or {#uuid "groupId2" true} {#uuid "groupId1" true}))}';

        controller.add(mockGroups[1]);
        controller.add(mockGroups[0]);

        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });

  });

  describe('ON remove', function () {
    describe('WHEN operator is "and"', function () {
      beforeEach(function () {
        controller = $controller('groupQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'and'
          }
        });
      });
  
      it('should empty the query when the last group is removed', function () {
        controller.add(mockGroups[0]);
        controller.remove(mockGroups[0]);
  
        expect(jsedn.encode($scope.parentMap)).toEqual('{}');
      });
  
      it('should remove the group specified', function () {
        var expected = '{:groups (and (and {#uuid "groupId2" true}))}';
  
        controller.add(mockGroups[0]);
        controller.add(mockGroups[1]);
        controller.remove(mockGroups[0]);
  
        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });
  
    describe('WHEN operator is "or"', function () {
      beforeEach(function () {
        controller = $controller('groupQueryController', {
          '$scope': {
            parentMap: rootMap,
            operator: 'or'
          }
        });
      });
  
      it('should remove the group specified', function () {
        var expected = '{:groups (and (or {#uuid "groupId2" true}))}';
  
        controller.add(mockGroups[0]);
        controller.add(mockGroups[1]);
        controller.remove(mockGroups[0]);
  
        expect(jsedn.encode($scope.parentMap)).toEqual(expected);
      });
    });
    
    it('should not remove anything else when removing last item in operatorList', function() {
      var expected = '{:groups (and (and {#uuid "groupId1" true}))}';

      var andGroupQueryController = $controller('groupQueryController', {
        '$scope': {
          parentMap: rootMap,
          operator: 'and'
        }
      });
      
      andGroupQueryController.add(mockGroups[0]);
      controller.add(mockGroups[0]);
      controller.add(mockGroups[1]);
      
      controller.remove(mockGroups[0]);
      controller.remove(mockGroups[1]);

      expect(jsedn.encode($scope.parentMap)).toEqual(expected);
    });
  });

  describe('ON parseOperands', function () {
    beforeEach(inject([function () {
      controller = $controller('groupQueryController', {
        '$scope': {
          parentMap: rootMap,
          operator: 'and'
        }
      });
    }]));
  
    it('should return an empty list', inject([function () {
      var operands = controller.parseOperands();
  
      expect(operands.length).toEqual(0);
    }]));
  
    it('should return a single group', inject(['$httpBackend', function ($httpBackend) {
      controller.add(mockGroups[1]);
  
      var operands = controller.parseOperands();
  
      $httpBackend.flush();
  
      expect(operands.length).toEqual(1);
      expect(operands[0].id).toEqual(mockGroups[1].id);
    }]));
  
    it('should return a single group WHEN another "or" group is added', inject(['$httpBackend', function ($httpBackend) {
      var orGroupController = $controller('groupQueryController', {
        '$scope': {
          parentMap: rootMap,
          operator: 'or'
        }
      });
  
      orGroupController.add(mockGroups[1]);
      controller.add(mockGroups[1]);
  
      var operands = controller.parseOperands();
  
      $httpBackend.flush();
  
      expect(operands.length).toEqual(1);
      expect(operands[0].id).toEqual(mockGroups[1].id);
    }]));
  });
});