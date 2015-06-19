'use strict';

/* global spyOn, jasmine: false  */

describe('groups controller', function(){
  var $scope,
    $httpBackend,
    apiHostname,
    controller,
    groups,
    g1Users,
    g2Users,
    user1,
    UserName,
    Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', function($compile, $rootScope, _$httpBackend_, $controller, _apiHostname_) {
    apiHostname = _apiHostname_;
    
    groups = [{
      id: 'g1'
    }, {
      id : 'g2'
    }];
    
    g1Users = [{
      memberId : '1'
    }];
    
    g2Users = [];
    
    user1 = {
        id: '1'
    };
    
    UserName = {
        get: function(){}
    };
    
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups').respond({'result' : groups});
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups/g1/users').respond({'result' : g1Users});
    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/groups/g2/users').respond({'result' : g2Users});
    $httpBackend.when('GET', apiHostname + '/v1/users/1').respond({'result' : user1});
    
    $scope = $rootScope.$new();
    Session = {tenant : {tenantId : 1}, user : {id : 2}};

    controller = $controller('GroupsController', {'$scope': $scope, 'Session' : Session, 'UserName' : UserName});
    $httpBackend.flush();
  }]));

  it('should have groups', inject(function() {
    expect($scope.groups).toBeDefined();
    expect($scope.groups.length).toEqual(2);
  }));

  it('should set selectedGroup on createGroup', function() {
    $scope.$broadcast('on:click:create');
    
    expect($scope.selectedGroup).toBeDefined();
    expect($scope.selectedGroup.tenantId).toEqual(Session.tenant.tenantId);
  });
  
  it('should refetch groups when tenant changes', inject(function() {
    spyOn($scope, 'fetch');
    Session.tenant = {tenantId : '2'};
    $scope.$digest();
    expect($scope.fetch).toHaveBeenCalled();
  }));
  
  describe('"additional" config', function(){
    it('should be defined', inject(function() {
      expect($scope.additional).toBeDefined();
    }));
    
    it('should have a postSave function', inject(function() {
      expect($scope.additional.postSave).toBeDefined();
      expect($scope.additional.postSave).toEqual(jasmine.any(Function));
    }));
    
    it('postSave function should call additionalMembers', inject(function() {
      spyOn($scope, 'updateMembers');
      $scope.additional.postSave({resource: {}, originalResource: {}});
      expect($scope.updateMembers).toHaveBeenCalled();
    }));
  });
  
  describe('fetch function', function(){
    it('should be defined', inject(function() {
      expect($scope.fetch).toBeDefined();
    }));
    
    it('should query for groups', inject(function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/1/groups');
      $scope.fetch();
      $httpBackend.flush();
    }));
    
    it('should call updateMembers for each group', inject(function() {
      spyOn($scope, 'updateMembers');
      $scope.fetch();
      $httpBackend.flush();
      expect($scope.updateMembers.calls.count()).toEqual(groups.length);
    }));
  });
  
  describe('createGroup function', function(){
    it('should be defined', inject(function() {
      expect($scope.createGroup).toBeDefined();
      expect($scope.createGroup).toEqual(jasmine.any(Function));
    }));
    
    it('should set selectedGroup to default values', inject(function() {
      $scope.createGroup();
      expect($scope.selectedGroup.tenantId).toEqual(1);
      expect($scope.selectedGroup.status).toBeTruthy();
      expect($scope.selectedGroup.owner).toEqual(2);
    }));
  });
  
  describe('updateMembers function', function(){
    it('should be defined', inject(function() {
      expect($scope.updateMembers).toBeDefined();
      expect($scope.updateMembers).toEqual(jasmine.any(Function));
    }));
    
    it('should query for the members list', inject(function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/1/groups/g1/users');
      $scope.updateMembers(groups[0]);
      $httpBackend.flush();
    }));
    
    it('should fetch the users in the members list', inject(function() {
      spyOn(UserName, 'get');
      $scope.updateMembers(groups[0]);
      $httpBackend.flush();
      expect(UserName.get).toHaveBeenCalledWith('1', jasmine.any(Function));
    }));
    
    it('should add the display name to the member', inject(function() {
      UserName.get = function(id, callback){
        callback({displayName: 'A display name'});
      };

      $scope.updateMembers(groups[0]);
      $httpBackend.flush();
      expect(groups[0].members[0].displayName).toBeDefined();
      expect(groups[0].members[0].displayName).toEqual('A display name');
    }));
  });
});
