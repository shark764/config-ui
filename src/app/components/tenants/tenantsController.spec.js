'use strict';

/* global spyOn: false  */

describe('TenantsController', function () {
  var $scope,
    $controller,
    $httpBackend,
    regions,
    tenants,
    region2tenants,
    users,
    routeParams;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(inject(['$rootScope', '$controller', '$injector', function ($rootScope, _$controller_, $injector) {
    $scope = $rootScope.$new();
    $controller = _$controller_;

    users = [{
      'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39',
      'lastName': 'Lowe',
      'firstName': 'Munoz',
      'displayName': 'Munoz Lowe'
    }, {
      'id': '9f97f9d9-004c-469c-906d-b917bd79fbe8',
      'lastName': 'Oliver',
      'firstName': 'Michael',
      'displayName': 'Michael Oliver'
    }];

    regions = [{
      'id': '1',
      'description': 'US East (N. Virginia)',
      'name': 'us-east-1'
    }, {
      'id': '2',
      'description': 'Maritimes CA',
      'name': 'ca-east-1'
    }];

    tenants = [{
      'description': 'Test',
      'regionId': '1',
      'name': 'Test',
      'id': 't1',
    }, {
      'description': 'A Tenant',
      'regionId': '1',
      'name': 'A Tenant',
      'id': 't2'
    }];

    region2tenants = [{
      'description': 'Very Tenant',
      'regionId': '2',
      'name': 'Very Tenant',
      'id': 't3'
    }, {
      'description': 'Much Tenant',
      'regionId': '2',
      'name': 'Much Tenant',
      'id': 't4'
    }];

    routeParams = {};

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', 'fakendpoint.com/v1/users').respond({
      'result': users
    });
    $httpBackend.when('GET', 'fakendpoint.com/v1/regions').respond({
      'result': regions
    });
    $httpBackend.when('GET', 'fakendpoint.com/v1/tenants?regionId=1').respond({
      'result': tenants
    });
    $httpBackend.when('GET', 'fakendpoint.com/v1/tenants?regionId=2').respond({
      'result': region2tenants
    });

    $controller('TenantsController', {
      '$scope': $scope,
      '$routeParams': routeParams
    });
    $httpBackend.flush();
  }]));

  it('should have users defined', function () {
    expect($scope.users.result).toBeDefined();
    expect($scope.users.result).toEqual(users);
  });

  it('should have regions defined', function () {
    expect($scope.regions.result).toBeDefined();
    expect($scope.regions.result).toEqual(regions);
  });

  it('should catch the routeUpdate event and set a new tenant', function () {
    spyOn($scope, 'setTenant');
    routeParams.id = 't2';
    $scope.$broadcast('$routeUpdate');
    expect($scope.setTenant).toHaveBeenCalledWith('t2');
  });

  describe('saveSuccess function', function () {
    it('should clear the tenant', function () {
      $scope.tenant = tenants[0];
      $scope.saveSuccess();
      expect($scope.tenant).toEqual({});
    });

    it('should refetch the list of tenants', function () {
      spyOn($scope, 'fetchTenants');
      $scope.saveSuccess();
      expect($scope.fetchTenants).toHaveBeenCalled();
    });
  });

  describe('saveFailure function', function () {
    it('should set the error message', function () {
      $scope.saveFailure({
        data: 'some message'
      });
      expect($scope.error).toEqual('some message');
    });
  });

  describe('setTenants function', function () {
    it('should update the scope\'s tenant', function () {
      $scope.setTenant(tenants[1].id);
      expect($scope.tenant).toEqual(tenants[1]);
    });

    it('should set tenant to empty object when given no id', function () {
      $scope.setTenant();
      expect($scope.tenant).toEqual({});
    });
  });

  describe('fetch function', function () {
    it('should update the tenants for the new regionid', function () {
      $httpBackend.expectGET('fakendpoint.com/v1/tenants?regionId=2');
      $scope.fetchTenants('2');
      $httpBackend.flush();
      expect($scope.tenants.result).toEqual(region2tenants);
    });

    it('should select a tenant based on the routeparams', function () {
      $httpBackend.expectGET('fakendpoint.com/v1/users');

      $controller('TenantsController', {
        '$scope': $scope,
        $routeParams: {
          id: region2tenants[0].id
        }
      });
      $httpBackend.flush();
      $httpBackend.expectGET('fakendpoint.com/v1/tenants?regionId=2');
      $scope.fetchTenants('2');
      $httpBackend.flush();
      expect($scope.tenant).toEqual(region2tenants[0]);
    });
  });

  describe('save function', function () {
    describe('create', function () {
      beforeEach(function () {
        $scope.tenant = {};
      });

      it('should create a new tenant if scope.tenant is empty', function () {
        $httpBackend.when('POST', 'fakendpoint.com/v1/tenants').respond({
          'result': {}
        });
        $httpBackend.expectPOST('fakendpoint.com/v1/tenants');

        $scope.save();
        $httpBackend.flush();
      });

      it('should call savesuccess on create success', function () {
        $httpBackend.when('POST', 'fakendpoint.com/v1/tenants').respond({
          'result': {}
        });
        $httpBackend.expectPOST('fakendpoint.com/v1/tenants');

        spyOn($scope, 'saveSuccess');
        $scope.save();
        $httpBackend.flush();
        expect($scope.saveSuccess).toHaveBeenCalled();
      });

      it('should call savefailure on create error', function () {
        $httpBackend.when('POST', 'fakendpoint.com/v1/tenants').respond(500, '');
        $httpBackend.expectPOST('fakendpoint.com/v1/tenants');

        spyOn($scope, 'saveFailure');
        $scope.save();
        $httpBackend.flush();
        expect($scope.saveFailure).toHaveBeenCalled();
      });
    });

    describe('update function', function () {
      beforeEach(function () {
        $scope.tenant = region2tenants[0];
        $scope.tenant.description = 'a better description';
      });

      it('should update existing tenant if scope.tenant.id exists', function () {
        $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/t3').respond({
          'result': {}
        });
        $httpBackend.expectPUT('fakendpoint.com/v1/tenants/t3');

        $scope.save();
        $httpBackend.flush();
      });

      it('should call savesuccess on update success', function () {
        $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/t3').respond({
          'result': {}
        });
        $httpBackend.expectPUT('fakendpoint.com/v1/tenants/t3');

        spyOn($scope, 'saveSuccess');
        $scope.save();
        $httpBackend.flush();

        expect($scope.saveSuccess).toHaveBeenCalled();
      });

      it('should call savefailure on update error', function () {
        $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/t3').respond(500, '');
        $httpBackend.expectPUT('fakendpoint.com/v1/tenants/t3');

        spyOn($scope, 'saveFailure');
        $scope.save();
        $httpBackend.flush();

        expect($scope.saveFailure).toHaveBeenCalled();
      });
    });
  });
});