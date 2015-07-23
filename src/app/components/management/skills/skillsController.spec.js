'use strict';

describe('SkillsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    Session,
    apiHostname;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.skills'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'Session', 'apiHostname',
    function ($rootScope, _$controller_, _$httpBackend_, _Session_, _apiHostname_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      Session = _Session_;
      apiHostname = _apiHostname_;
    }
  ]));

  beforeEach(function() {
    $controller('SkillsController', {'$scope': $scope});
  });
  
  describe('ON fetchSkills', function() {
    it('should be defined', function() {
      expect($scope.fetchSkills);
    });
    
    it('should return skills on call', function() {
      var skills = $scope.fetchSkills();
      
      $httpBackend.flush();
      
      expect(skills.length).toEqual(2);
    });
  });
  
  it('should have stuff defined at startup', function() {
    expect($scope.Session).toBeDefined();
    expect($scope.tableConfig).toBeDefined();
  });

  it('should set selectedGroup on createSkill', function() {
    $scope.$broadcast('table:on:click:create');

    expect($scope.selectedSkill).toBeDefined();
    expect($scope.selectedSkill.tenantId).toEqual(Session.tenant.tenantId);
  });

});
