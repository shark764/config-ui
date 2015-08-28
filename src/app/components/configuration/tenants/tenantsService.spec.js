'use strict';

describe('Tenant service', function(){
  var Tenant;
  
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.tenants'));
  
  beforeEach(inject(['Tenant', function(_Tenant_) {
    Tenant = _Tenant_;
  }]));
  
  describe('getDisplay prototype function', function(){
    it('should return the tenant name ', inject(function() {
      var tenant = new Tenant({
        name: 'mytesttenant'
      });
      
      expect(tenant.getDisplay()).toEqual('mytesttenant');
    }));
  });
  
  describe('getAsArray prototype function', function(){
    it('should return an array with a single tenant and a promise', inject(['$httpBackend', 'apiHostname', function($httpBackend, apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id');
      var result = Tenant.prototype.getAsArray('tenant-id');
      $httpBackend.flush();
      
      expect(result.length).toEqual(1);
      expect(result.$promise).toBeDefined();
      expect(result.$resolved).toBeTruthy();
    }]));
    
    it('should store the tenant in the cache if it is not already there', inject(['$httpBackend', 'queryCache', function($httpBackend, queryCache) {
      spyOn(queryCache, 'get').and.returnValue(undefined);
      spyOn(queryCache, 'put');
      
      Tenant.prototype.getAsArray('tenant-id');
      $httpBackend.flush();
      
      expect(queryCache.put).toHaveBeenCalledWith('tenant-idarr', jasmine.any(Array));
    }]));
    
    it('should return the cached value if it exists there', inject(['mockTenants', 'queryCache', function(mockTenants, queryCache) {
      spyOn(queryCache, 'get').and.returnValue(mockTenants[0]);
      
      var result = Tenant.prototype.getAsArray('tenant-id');
      
      expect(result).toBe(mockTenants[0]);
    }]));
  });
});
