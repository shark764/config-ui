'use strict';

/* global spyOn, jasmine: false  */

describe('groups controller', function () {
  var $scope,
    groups,
    g1Users,
    g2Users,
    user1;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$httpBackend', '$controller', 'apiHostname', 'Session',
    function ($rootScope, $httpBackend, $controller, apiHostname, Session) {
      groups = [{
        id: 'g1'
      }, {
        id: 'g2'
      }];
  
      g1Users = [{
        memberId: '1'
      }];
  
      g2Users = [];
  
      user1 = {
        id: '1',
        displayName: 'a nice display name.'
      };
  
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups').respond({
        'result': groups
      });
  
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups/g1/users').respond({
        'result': g1Users
      });
  
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups/g2/users').respond({
        'result': g2Users
      });
  
      $httpBackend.when('GET', apiHostname + '/v1/users/1').respond({
        'result': user1
      });
  
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
        'result': [{
          'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
          'description': 'US East (N. Virginia)',
          'name': 'us-east-1'
        }]
      });
  
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({
        'result': {
          'tenants': []
        }
      });
  
      $scope = $rootScope.$new();
  
      Session.tenant = {
        tenantId: 1
      };
  
      Session.user = {
        id: 2
      };
      $controller('GroupsController', {'$scope': $scope});
      $scope.$digest();
      $httpBackend.flush();
  }]));

  it('should have groups', inject(function () {
    expect($scope.groups).toBeDefined();
    expect($scope.groups.length).toEqual(2);
  }));

  it('should refetch groups when tenant changes', inject(['Session', function (Session) {
    expect($scope.fetch).toBeDefined();
    spyOn($scope, 'fetch');

    Session.tenant = {
      tenantId: 2
    };

    $scope.$digest();

    expect($scope.fetch).toHaveBeenCalled();
  }]));

  describe('"additional" config', function () {
    it('should be defined', inject(function () {
      expect($scope.additional).toBeDefined();
    }));

    it('should have a postSave function', inject(function () {
      expect($scope.additional.postSave).toBeDefined();
      expect($scope.additional.postSave).toEqual(jasmine.any(Function));
    }));

    it('postSave function should call additionalMembers', inject(function () {
      spyOn($scope, 'updateMembers');
      $scope.additional.postSave({
        resource: {},
        originalResource: {}
      });
      expect($scope.updateMembers).toHaveBeenCalled();
    }));
  });

  describe('fetch function', function () {
    it('should be defined', inject(function () {
      expect($scope.fetch).toBeDefined();
    }));

    it('should query for groups', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/1/groups');
      $scope.fetch();
      $httpBackend.flush();
    }]));

    it('should call updateMembers for each group', inject(['$httpBackend', function ($httpBackend) {
      spyOn($scope, 'updateMembers');
      $scope.fetch();
      $httpBackend.flush();
      expect($scope.updateMembers.calls.count()).toEqual(groups.length);
    }]));
  });

  describe('createGroup function', function () {
    it('should catch the on:click:create event', inject(['Session', function (Session) {
      $scope.$broadcast('on:click:create');
      expect($scope.selectedGroup).toBeDefined();
      expect($scope.selectedGroup.tenantId).toEqual(Session.tenant.tenantId);
    }]));

    it('should set selectedGroup to default values', inject(function () {
      $scope.$broadcast('on:click:create');
      expect($scope.selectedGroup.tenantId).toEqual(1);
      expect($scope.selectedGroup.status).toBeTruthy();
      expect($scope.selectedGroup.owner).toEqual(2);
    }));
  });

  describe('updateMembers function', function () {
    it('should be defined', inject(function () {
      expect($scope.updateMembers).toBeDefined();
      expect($scope.updateMembers).toEqual(jasmine.any(Function));
    }));

    it('should query for the members list', inject(['$httpBackend', 'apiHostname', function ($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/1/groups/g1/users');
      $scope.updateMembers(groups[0]);
      $httpBackend.flush();
    }]));

    it('should fetch the users in the members list', inject(['UserCache', '$httpBackend', function (UserCache, $httpBackend) {
      spyOn(UserCache, 'get');
      $scope.updateMembers(groups[0]);
      $httpBackend.flush();
      expect(UserCache.get).toHaveBeenCalledWith('1', jasmine.any(Function));
    }]));

    it('should add the display name to the member', inject(['UserCache', '$httpBackend', function (UserCache, $httpBackend) {
      spyOn(UserCache, 'get').and.callFake(function(id, callback){callback(user1);});
      $scope.updateMembers(groups[0]);
      $httpBackend.flush();
      expect(groups[0].members[0].displayName).toBeDefined();
      expect(groups[0].members[0].displayName).toEqual(user1.displayName);
    }]));
  });
});