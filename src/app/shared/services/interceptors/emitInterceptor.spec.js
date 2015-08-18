'use strict';

/*global spyOn : false */

describe('emitInterceptor service', function(){
  var emitInterceptor,
    $rootScope;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['emitInterceptor', '$rootScope', function(_emitSaveInterceptor, _$rootScope) {
    emitInterceptor = _emitSaveInterceptor;
    $rootScope = _$rootScope;
  }]));
  
  describe('response function', function(){
    it('should broadcast created resource on 201 status', inject(function() {
      spyOn($rootScope, '$broadcast');
      
      emitInterceptor.response({
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
      
      emitInterceptor.response({
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
      
      emitInterceptor.response({
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
