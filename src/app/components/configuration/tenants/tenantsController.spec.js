'use strict';

describe('TenantsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    apiHostname,
    Session,
    mockTenants;
  
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.tenants'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'apiHostname', 'Session', 'mockTenants',
    function ($rootScope, _$controller_, _$httpBackend, _apiHostname_, _Session_, _mockTenants) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend;
      
      apiHostname = _apiHostname_;
      mockTenants = _mockTenants;
      Session = _Session_;

      $controller('TenantsController', {
        '$scope': $scope
      });
    }
  ]));

  describe('fetchTenants function', function(){
    it('should fetch the list of tenants', inject(['queryCache', function (queryCache) {
      queryCache.removeAll();
      
      $httpBackend.expectGET(apiHostname + '/v1/tenants?regionId=regionId2').respond({
          'result': []
        });

      Session.activeRegionId = 'regionId2';

      $scope.tenants = null;
      $scope.fetchTenants();
      $httpBackend.flush();
    }]));
  });
  
  describe('fetchUsers function', function(){
    it('should fetch the list of users', inject(['queryCache', function (queryCache) {
      queryCache.removeAll();
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/users').respond({
          'result': []
        });

      $scope.fetchUsers();
      $httpBackend.flush();
    }]));
  });

  it('should have a function to create a new tenant and set it as selected', function () {
    $scope.$broadcast('table:on:click:create');
    expect($scope.selectedTenant).toBeDefined();
    expect($scope.selectedTenant.regionId).toBe(Session.activeRegionId);
  });
    
    describe('create function', function(){
      it('should set the adminUserId to the current active user', function () {
        Session.user = {id: 'me'};
        $scope.create();
        expect($scope.selectedTenant.adminUserId).toEqual('me');
      });
    });
});
