'use strict';

/* global spyOn : false */
describe('userGroups directive', function(){
  var $scope,
    $httpBackend,
    $compile,
    element,
    isolateScope,
    groups,
    userGroups,
    Group,
    TenantUserGroups,
    apiHostname,
    User,
    $injector;

  beforeEach(module('gulpAngular'));

  beforeEach(function(){
    module('liveopsConfigPanel', function($provide) {
      $provide.service('Session', function() {
        return {
          tenant : {
            tenantId : 1
          },
          isAuthenticated : function(){
            return true;
          }
        };
      });
    });
  });

  beforeEach(inject(['$compile', '$rootScope', 'User', '$httpBackend', 'apiHostname', 'Group', 'TenantUserGroups', '$injector', function (_$compile_, _$rootScope_, _User_, _$httpBackend_, _apiHostname_, _Group_, _TenantUserGroups_, _$injector_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    Group = _Group_;
    TenantUserGroups = _TenantUserGroups_;
    apiHostname = _apiHostname_;
    User = _User_;
    $injector = _$injector_;

    $scope.user = new User({id : 1});

    //Mock the group services
    groups = [{id: 'g1'}, {id: 'g2'}, {id: 'g3'}];
    userGroups = [{id: 'g2'}, {id: 'g3'}];
    userGroups.$promise = {
        then : function(){}
    };

    spyOn(TenantUserGroups, 'query').and.returnValue(userGroups);
    spyOn(Group, 'query').and.returnValue(groups);

    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups').respond({'result' : groups});
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/users/1/groups').respond({'result' : userGroups});

    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
      'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }]});

    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
      'tenants': []
    }});

    element = $compile('<user-groups user="user"></user-groups>')($scope);
    $scope.$digest();

    isolateScope = element.isolateScope();
    isolateScope.updateCollapseState = function(){}; //Stub this out so we dont trigger digests in the tests
  }]));

  it('should have groups defined', inject(function() {
    expect(isolateScope.groups).toBeDefined();
  }));

  it('should load the groups for the tenant', inject(function() {
    expect(isolateScope.groups.length).toEqual(groups.length);
    expect(isolateScope.groups).toEqual(groups);
  }));

  it('should have userGroups defined', inject(function() {
    expect(isolateScope.userGroups).toBeDefined();
  }));

  it('should load the user\'s groups', inject(function() {
   expect(isolateScope.userGroups.length).toEqual(userGroups.length);
   expect(isolateScope.userGroups).toEqual(userGroups);
  }));

  describe('fetch function', function(){
    it('should be called when user changes', inject(function() {
      spyOn(isolateScope, 'fetch');
      $scope.user = new User({id: 2});
      $scope.$digest();
      expect(isolateScope.fetch).toHaveBeenCalled();
    }));
   });

  describe('remove function', function(){
     it('should call TenantUserGroup delete', inject(function() {
       $httpBackend.when('DELETE', apiHostname + '/v1/tenants/1/groups/g2/users/1').respond({});
       $httpBackend.expectDELETE(apiHostname + '/v1/tenants/1/groups/g2/users/1');
       isolateScope.remove({tenantId : 1, memberId:1, groupId : 'g2'});
       $httpBackend.flush();
     }));
   });
});
