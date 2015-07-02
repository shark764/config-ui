'use strict';

describe('TenantsController', function() {
    var $scope,
        $controller,
        $httpBackend,
        tenants,
        routeParams,
        apiHostname,
        users,
        Session,
        Tenant;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Tenant', 'apiHostname', 'Session',
      function($rootScope, _$controller_, $injector, _Tenant_, _apiHostname_, _Session_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Tenant = _Tenant_;
      Session = _Session_;

      tenants = [
        {'description': 'Test',
         'regionId': '1',
         'name': 'Test',
         'id': 't1',
       },
       {'description': 'A Tenant',
         'regionId': '1',
         'name': 'A Tenant',
         'id': 't2'
       }
      ];

      users = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];

      Session.activeRegionId = 1;
      apiHostname = _apiHostname_;

      routeParams = {};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/tenants?regionId=' + Session.activeRegionId).respond({'result' : tenants});
      $httpBackend.when('GET', apiHostname + '/v1/users').respond({'result' : users});
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
        'tenants': []
      }});

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});
      $controller('TenantsController', {'$scope': $scope, '$stateParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should fetch the list of tenants on create', function () {
      expect($scope.tenants).toBeDefined();
      expect($scope.tenants[0].id).toEqual(tenants[0].id);
      expect($scope.tenants[1].id).toEqual(tenants[1].id);
    });

    it('should fetch the list of users on create', function () {
      expect($scope.users).toBeDefined();
      expect($scope.users[0].id).toEqual(users[0].id);
      expect($scope.users[1].id).toEqual(users[1].id);
    });

    it('should have a function to create a new tenant and set it as selected', function () {
      $scope.$broadcast('on:click:create');
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
