'use strict';

/*global jasmine : false */

describe('LiveopsResourceFactory', function(){
  var Resource,
      resourceSpy,
      apiHostname,
      LiveopsResourceFactory,
      protoUpdateSpy,
      protoSaveSpy,
      givenConfig;

  beforeEach(module('liveopsConfigPanel', function($provide) {
    resourceSpy = jasmine.createSpy('ResourceMock').and.callFake(function(endpoint, fields, config) {
      givenConfig = config;

      protoSaveSpy = jasmine.createSpy('$save');
      protoUpdateSpy = jasmine.createSpy('$update');

      function resource(){
        this.$save = protoSaveSpy;
        this.$update = protoUpdateSpy;
      }

      return resource;
    });

    $provide.value('$resource', resourceSpy);
  }));

  beforeEach(inject(['apiHostname', 'LiveopsResourceFactory', function(_apiHostname_, _LiveopsResourceFactory_) {
    apiHostname = _apiHostname_;
    LiveopsResourceFactory = _LiveopsResourceFactory_;
  }]));

  it('should call the $resource constructor', inject(function() {
    Resource = LiveopsResourceFactory.create('/endpoint');

    expect(resourceSpy).toHaveBeenCalledWith(apiHostname + '/endpoint', jasmine.any(Object), {
      query: jasmine.any(Object),
      get: jasmine.any(Object),
      update: jasmine.any(Object),
      save: jasmine.any(Object)
    });
  }));

  it('should use given requestUrlFields if defined', inject(function() {
    Resource = LiveopsResourceFactory.create('/endpoint', undefined, {title : '@title'});

    expect(resourceSpy).toHaveBeenCalledWith(apiHostname + '/endpoint', {title : '@title'}, {
      query: jasmine.any(Object),
      get: jasmine.any(Object),
      update: jasmine.any(Object),
      save: jasmine.any(Object)
    });
  }));

  describe('update config', function(){
    it('should set the interceptor', inject(['SaveInterceptor', function(SaveInterceptor) {
      LiveopsResourceFactory.create('/endpoint');

      expect(givenConfig.update.interceptor).toEqual(SaveInterceptor);
    }]));

    describe('transformRequest function', function(){
      it('should return empty object when not given any updatefields', inject([function() {
        LiveopsResourceFactory.create('/endpoint');
        var transformRequest = givenConfig.update.transformRequest;
        var result = transformRequest({someProp: 'someValue', anotherProp: 'anotherValue'});
        expect(result).toEqual('{}');
      }]));

      it('should only return fields given by updatefields', inject([function() {
        LiveopsResourceFactory.create('/endpoint', [{
          name : 'myfield'
        }, {
          name : 'coolfield'
        }]);

        var transformRequest = givenConfig.update.transformRequest;
        var result = transformRequest({myfield: 'someValue', coolfield: 'thats cool', uncool : 'not cool at all'});
        expect(result).toEqual('{"myfield":"someValue","coolfield":"thats cool"}');
      }]));

      it('should not include null data if its optional', inject([function() {
        LiveopsResourceFactory.create('/endpoint', [{
          name : 'myfield',
          optional: true
        }]);

        var transformRequest = givenConfig.update.transformRequest;
        var result = transformRequest({myfield: null});
        expect(result).toEqual('{}');
      }]));

      it('should include null data if its not optional', inject([function() {
        LiveopsResourceFactory.create('/endpoint', [{
          name : 'myfield',
          optional: false
        }]);

        var transformRequest = givenConfig.update.transformRequest;
        var result = transformRequest({myfield: null});
        expect(result).toEqual('{"myfield":null}');
      }]));
    });

    describe('transformResponse', function(){
      it('should append a function to the transformResponse array to return data from the result object', inject([function() {
        LiveopsResourceFactory.create('/endpoint');
        var transformResponse = givenConfig.update.transformResponse[givenConfig.update.transformResponse.length - 1];
        var result = transformResponse({result : {someProp: 'somevalue'}});
        expect(result).toEqual({someProp: 'somevalue'});

        result = transformResponse({someProp: 'somevalue'});
        expect(result).toEqual({someProp: 'somevalue'});

        result = transformResponse([]);
        expect(result).toEqual([]);
      }]));
    });
  });

  describe('query config', function(){
    it('should set isArray to true', inject([function() {
      LiveopsResourceFactory.create('/endpoint');

      expect(givenConfig.query.isArray).toBeTruthy();
    }]));
  });

  describe('prototype save function', function(){
    it('should call $update if the object exists', inject(['$q', function($q) {
      Resource = LiveopsResourceFactory.create('/endpoint');

      var resource = new Resource();
      resource.id = 'id1';

      resource.$update = protoUpdateSpy.and.returnValue($q.when({}));
      resource.save();
      expect(protoUpdateSpy).toHaveBeenCalled();
    }]));
    
    it('should call $save if the object if new', inject(['$q', function($q) {
      Resource = LiveopsResourceFactory.create('/endpoint');

      var resource = new Resource();

      resource.$save = protoSaveSpy.and.returnValue($q.when({}));
      resource.save();
      expect(protoSaveSpy).toHaveBeenCalled();
    }]));
  });
  
  describe('prototype postUpdateError function', function(){
    it('should return a promise that is rejected with the given error', inject(function() {
      Resource = LiveopsResourceFactory.create('/endpoint');

      var resource = new Resource();
      var promise = resource.postUpdateError('some err');
      expect(promise.$$state.value).toEqual('some err');
    }));
  });
});
