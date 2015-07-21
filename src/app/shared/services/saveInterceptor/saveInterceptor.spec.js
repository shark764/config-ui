'use strict';

/*global spyOn : false */

describe('Save Interceptor service', function(){
  var SaveInterceptor,
    $rootScope;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['SaveInterceptor', '$rootScope', function(_SaveInterceptor, _$rootScope) {
    SaveInterceptor = _SaveInterceptor;
    $rootScope = _$rootScope;
  }]));
  
  describe('response function', function(){
    it('should broadcast created resource on 201 status', inject(function() {
      spyOn($rootScope, '$broadcast');
      
      SaveInterceptor.response({
        config : {
          url: '/test'
        },
        status: 201,
        resource: {}
      });
      
      expect($rootScope.$broadcast).toHaveBeenCalledWith('created:resource:test', {});
    }));
    
    it('should broadcast updated resource on 200 status', inject(function() {
      spyOn($rootScope, '$broadcast');
      
      SaveInterceptor.response({
        config : {
          url: '/test/123'
        },
        status: 200,
        resource: {}
      });
      
      expect($rootScope.$broadcast).toHaveBeenCalledWith('updated:resource:test', {});
    }));
    
    it('should do nothing on a status other than 200 and 201', inject(function() {
      spyOn($rootScope, '$broadcast');
      
      SaveInterceptor.response({
        config : {
          url: '/test'
        },
        status: 205,
        resource: {}
      });
      
      expect($rootScope.$broadcast).not.toHaveBeenCalled();
    }));
  });
});
