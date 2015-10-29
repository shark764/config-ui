'use strict';

describe('setSkillStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.skill.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();

    element = $compile('<ba-set-skill-status bulk-action="bulkAction"></ba-set-skill-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.apply', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });
  
  it('should override bulkAction.reset', function() {
    expect(isolateScope.bulkAction.reset).toBeDefined();
    
    isolateScope.bulkAction.active = true;
    isolateScope.bulkAction.reset();
    expect(isolateScope.active).toBeFalsy();
    expect(isolateScope.bulkAction.checked).toBeFalsy();
  });

  it('should should set skill.active on bulkAction.execute', inject(['mockSkills', '$httpBackend', 'apiHostname',
    function(mockSkills, $httpBackend, apiHostname) {
      var returnSkill = angular.copy(mockSkills[0]);
      returnSkill.active = true;

      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/skills/skillId1').respond(200, {
        result: returnSkill
      });

      expect(mockSkills[0].active).toBeFalsy();
      isolateScope.active = true;
      isolateScope.bulkAction.apply(mockSkills[0]);
      $httpBackend.flush();

      expect(mockSkills[0].active).toEqual(true);
    }
  ]));
  
  it('should should only have the attribute in the PUT payload',
    inject(['mockSkills', '$httpBackend', 'apiHostname',
      function (mockSkills, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/skills/skillId1', {
          active: true
        }).respond(200);

        isolateScope.active = true;
        isolateScope.bulkAction.apply(mockSkills[0]);

        $httpBackend.flush();
      }
    ]));
});
