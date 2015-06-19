'use strict';

describe('GroupsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    Session,
    apiHostname,
    groups;
  
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
    groups = [{
      id: 'group-id'
    }, {
      id: 'group-id'
    }];
    
    Session.tenant.tenantId = 123;
    Session.user = {
      id: 456
    };
    
    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/groups').respond({
      'result': groups
    });
    
    $controller('GroupsController', {'$scope': $scope});
    
    $httpBackend.flush();
  });
  
  it('should have stuff defined at startup', function() {
    expect($scope.Session).toBeDefined();
    expect($scope.tableConfig).toBeDefined();
    expect($scope.fetch).toBeDefined();
    
    expect($scope.groups.length).toEqual(2);
  });
  
  it('should set selectedGroup on createGroup', function() {
    $scope.$broadcast('on:click:create');
    
    expect($scope.selectedGroup).toBeDefined();
    expect($scope.selectedGroup.tenantId).toEqual(Session.tenant.tenantId);
  });

});