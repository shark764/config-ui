'use strict';

/* global spyOn: false  */

describe('TenantsController', function() {
    var $scope,
        $controller,
        $httpBackend,
        regions,
        tenants,
        region2tenants,
        users;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', function($rootScope, _$controller_, $injector) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      
      users  = [ {
        'id': 'c6aa44f6-b19e-49f5-bd3f-66f00b885e39',
        'status': false,
        'updatedBy': 'b9a14681-9912-437d-b72b-320bbebfa40c',
        'externalId': 73795,
        'extension': 9969,
        'state': 'WRAP',
        'created': 'Wed Nov 07 2001 21:32:07 GMT+0000 (UTC)',
        'lastName': 'Lowe',
        'firstName': 'Munoz',
        'updated': 'Sun Aug 31 1997 19:52:45 GMT+0000 (UTC)',
        'email': 'munoz.lowe@hivedom.org',
        'displayName': 'Munoz Lowe',
        'password': '',
        'createdBy': '02f1eeff-8204-4902-9f4c-7960db3795fa',
        'role': 'Administrator'
      },
      {
        'id': '9f97f9d9-004c-469c-906d-b917bd79fbe8',
        'status': true,
        'updatedBy': '52fcfff0-b35f-4ba3-94b8-964511671045',
        'externalId': 80232,
        'extension': 5890,
        'state': 'NOT_READY',
        'created': 'Sat Apr 12 2008 07:40:10 GMT+0000 (UTC)',
        'lastName': 'Oliver',
        'firstName': 'Michael',
        'updated': 'Sat Nov 07 1970 10:53:22 GMT+0000 (UTC)',
        'email': 'michael.oliver@ezent.io',
        'displayName': 'Michael Oliver',
        'password': '',
        'createdBy': 'b8e5d096-f828-4269-ae5a-117e69917340',
        'role': 'Administrator'
      }];
      
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
                 'createdBy': '333',
                 'updated': '2015-05-13T10:16:50Z',
                 'name': 'Test',
                 'adminUserId': '444',
                 'created': '2015-05-13T10:08:48Z',
                 'updatedBy': '333',
                 'status': true,
                 'id': 't1',
                 'parentId': null},
                 {'description': 'A Tenant',
                   'regionId': '1',
                   'createdBy': '333',
                   'updated': '2015-05-13T10:16:50Z',
                   'name': 'A Tenant',
                   'adminUserId': '444',
                   'created': '2015-05-13T10:08:48Z',
                   'updatedBy': '333',
                   'status': true,
                   'id': 't2',
                   'parentId': null}];
      
      region2tenants = [{'description': 'Very Tenant',
                  'regionId': '2',
                  'createdBy': '333',
                  'updated': '2015-05-13T10:16:50Z',
                  'name': 'Very Tenant',
                  'adminUserId': '444',
                  'created': '2015-05-13T10:08:48Z',
                  'updatedBy': '333',
                  'status': true,
                  'id': 't3',
                  'parentId': null},
                  {'description': 'Much Tenant',
                    'regionId': '2',
                    'createdBy': '333',
                    'updated': '2015-05-13T10:16:50Z',
                    'name': 'Much Tenant',
                    'adminUserId': '444',
                    'created': '2015-05-13T10:08:48Z',
                    'updatedBy': '333',
                    'status': true,
                    'id': 't4',
                    'parentId': null}];
      
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/users').respond({'result' : users});
      $httpBackend.when('GET', 'fakendpoint.com/v1/regions').respond({'result' : regions});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants?regionId=1').respond({'result' : tenants});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants?regionId=2').respond({'result' : region2tenants});
      $httpBackend.expectGET('fakendpoint.com/v1/users');
      
      $controller('TenantsController', {'$scope': $scope});
      $httpBackend.flush();
    }]));

    it('should have users defined', function() {
        expect($scope.users).toBeDefined();
        expect($scope.users).toEqual(users);
    });
    
    describe('setTenants function', function() {
      it('should update the scope\'s tenant', function() {
        $scope.setTenant(tenants[1].id);
        expect($scope.tenant).toEqual(tenants[1]);
      });
      
      it('should set tenant to empty object when given no id', function() {
        $scope.setTenant();
        expect($scope.tenant).toEqual({});
      });
    });
    
    describe('fetch function', function() {
      it('should update the tenants for the new regionid', function() {
        $httpBackend.expectGET('fakendpoint.com/v1/tenants?regionId=2');
        $scope.fetch('2');
        $httpBackend.flush();
        expect($scope.tenants).toEqual(region2tenants);
      });
      
      it('should select a tenant based on the routeparams', function() {
        $httpBackend.expectGET('fakendpoint.com/v1/users');
        
        $controller('TenantsController', {'$scope': $scope, $routeParams: {id: region2tenants[0].id}});
        $httpBackend.flush();
        $httpBackend.expectGET('fakendpoint.com/v1/tenants?regionId=2');
        $scope.fetch('2');
        $httpBackend.flush();
        expect($scope.tenant).toEqual(region2tenants[0]);
      });
    });
    
    describe('save function', function() {
      describe('create', function() {
        beforeEach(function(){
          $scope.tenant = {};
        });
        
        it('should create a new tenant if scope.tenant is empty', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants');
          
          $scope.save();
          $httpBackend.flush();
        });
        
        it('should call savesuccess on create success', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants');
          
          spyOn($scope, 'saveSuccess');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveSuccess).toHaveBeenCalled();
        });
        
        it('should call savefailure on create error', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants').respond(500, '');
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants');
          
          spyOn($scope, 'saveFailure');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveFailure).toHaveBeenCalled();
        });
      });
      
      describe('update function', function() {
        beforeEach(function(){
          $scope.tenant = region2tenants[0];
          $scope.tenant.description = 'a better description';
        });
        
        it('should update existing tenant if scope.tenant.id exists', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/t3').respond({'result' : {}});
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/t3');
          
          $scope.save();
          $httpBackend.flush();
        });
        
        it('should call savesuccess on update success', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/t3').respond({'result' : {}});
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/t3');
          
          spyOn($scope, 'saveSuccess');
          $scope.save();
          $httpBackend.flush();
          
          expect($scope.saveSuccess).toHaveBeenCalled();
        });
        
        it('should call savefailure on update error', function() {
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