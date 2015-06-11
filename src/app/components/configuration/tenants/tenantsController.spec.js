'use strict';

/* global spyOn: false  */

describe('TenantsController', function() {
    var $scope,
        $controller,
        $httpBackend,
        regions,
        tenants,
        region2tenants,
        routeParams,
        Tenant;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Tenant', function($rootScope, _$controller_, $injector, _Tenant_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Tenant = _Tenant_;

      regions = [{
                  'id': '1',
                  'description': 'US East (N. Virginia)',
                  'name': 'us-east-1'
                },{
                  'id': '2',
                  'description': 'Maritimes CA',
                  'name': 'ca-east-1'
                  }];

      tenants = [{'description': 'Test',
                   'regionId': '1',
                   'name': 'Test',
                   'id': 't1',
                 },
                 {'description': 'A Tenant',
                   'regionId': '1',
                   'name': 'A Tenant',
                   'id': 't2'
                 }];

      region2tenants = [
                  {'description': 'Very Tenant',
                    'regionId': '2',
                    'name': 'Very Tenant',
                    'id': 't3'
                  },
                  {'description': 'Much Tenant',
                    'regionId': '2',
                    'name': 'Much Tenant',
                    'id': 't4'
                  }];

      routeParams = {};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/regions').respond({'result' : regions});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants?regionId=1').respond({'result' : tenants});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants?regionId=2').respond({'result' : region2tenants});

      $controller('TenantsController', {'$scope': $scope, '$stateParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should have regions defined', function() {
      expect($scope.regions).toBeDefined();
      expect($scope.regions.length).toEqual(regions.length);
      expect($scope.regions[0].id).toEqual(regions[0].id);
    });

    it('should catch the routeUpdate event and set a new tenant', function() {
      spyOn($scope, 'setTenant');
      routeParams.id = 't2';
      $scope.$broadcast('$routeUpdate');
      expect($scope.setTenant).toHaveBeenCalledWith('t2');
    });

    describe('fetchTenants function', function() {
      it('should update the tenants for the new regionid', function() {
        $httpBackend.expectGET('fakendpoint.com/v1/tenants?regionId=2');
        $scope.fetchTenants('2');
        $httpBackend.flush();
        expect($scope.tenants.length).toEqual(region2tenants.length + 1);
        expect($scope.tenants[0].id).toEqual(region2tenants[0].id);
      });

      it('should select a tenant based on the routeparams', function() {
        $controller('TenantsController', {'$scope': $scope, $stateParams: {id: region2tenants[0].id}});
        $httpBackend.flush();
        $httpBackend.expectGET('fakendpoint.com/v1/tenants?regionId=2');
        $scope.fetchTenants('2');
        $httpBackend.flush();
        expect($scope.tenant.id).toEqual(region2tenants[0].id);
      });
    });
});