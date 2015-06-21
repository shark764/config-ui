'use strict';

describe('SkillsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    Session,
    apiHostname,
    skills;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

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
    skills = [{
      id: 'skill-id'
    }, {
      id: 'skill-id'
    }];

    Session.tenant.tenantId = 123;
    Session.user = {
      id: 456
    };

    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/skills').respond({
      'result': skills
    });

    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }]});

    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
      'tenants': []
    }});

    $controller('SkillsController', {'$scope': $scope});

    $httpBackend.flush();
  });

  it('should have stuff defined at startup', function() {
    expect($scope.Session).toBeDefined();
    expect($scope.tableConfig).toBeDefined();
    expect($scope.fetch).toBeDefined();

    expect($scope.skills.length).toEqual(2);
  });

  it('should set selectedGroup on createSkill', function() {
    $scope.$broadcast('on:click:create');

    expect($scope.selectedSkill).toBeDefined();
    expect($scope.selectedSkill.tenantId).toEqual(Session.tenant.tenantId);
  });

});
