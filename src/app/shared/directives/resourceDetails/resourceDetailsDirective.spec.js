'use strict';

/* global spyOn: false */
describe('resource details directive', function() {
  var $scope,
    User,
    $httpBackend,
    apiHostname,
    Session,
    element,
    isolateScope,
    doDefaultCompile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'User', 'apiHostname', '$templateCache', 'Session',
    function($compile, $rootScope, _$httpBackend_, _User_, _apiHostname_, _$templateCache_, _Session_) {
      $scope = $rootScope.$new();
      User = _User_;
      $httpBackend = _$httpBackend_;
      apiHostname = _apiHostname_;
      Session = _Session_;

      Session.tenant = {
        tenantId: 1
      };

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
        'result': [{}]
      });
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({
        'result': {}
      });

      $scope.user = new User({
        firstName: 'John',
        lastName: 'Benson'
      });

      doDefaultCompile = function() {
        element = $compile('<resource-details original-resource="user" resource-name="myresource"></resource-details>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      };
    }
  ]));

  it('should have a function to set the original resource to null', inject(function() {
    doDefaultCompile();

    isolateScope.originalResource = new User({});

    isolateScope.closeDetails();

    expect(isolateScope.originalResource).toBeNull();
  }));


  it('should not render the body or header if no body or header templates were provided', inject(function() {
    doDefaultCompile();

    var body = element.find('.detail-body');
    var header = element.find('.detail-header');

    expect(body.length).toBe(0);
    expect(header.length).toBe(0);
  }));

  it('should render the body and header if a body or header templates are provided', inject(['$compile', '$templateCache', function($compile, $templateCache) {
    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/skills').respond({
      'result': []
    });
    $httpBackend.expectGET(apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/skills');

    $templateCache.put('body.html', '<detail-body></detail-body>');
    $templateCache.put('header.html', '<detail-header></detail-header>');
    var ele = $compile('<resource-details original-resource="user" header-template-url="header.html" body-template-url="body.html"></resource-details>')($scope);
    $scope.$digest();

    var body = ele.find('detail-body');
    var header = ele.find('detail-header');

    expect(body.length).toBe(1);
    expect(header.length).toBe(1);
  }]));

  describe('cancel function', function() {
    beforeEach(function() {
    doDefaultCompile();
    });

    it('should reset the resource', inject(['DirtyForms', function(DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function(callback) {
        callback();
    });

      isolateScope.resource.firstName = 'JohnTest';
      isolateScope.resource.id = '123';
      isolateScope.detailsForm.$dirty = true;
      isolateScope.cancel();

      expect(isolateScope.resource.firstName).toEqual('John');
    }]));

    it('should reset the form', inject(['Alert', function(Alert) {
    isolateScope.detailsForm.$dirty = true;
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback) {
        cancelCallback();
      });
      spyOn(angular, 'noop');
    isolateScope.cancel();

      expect(angular.noop).toHaveBeenCalled();
    }]));

    it('should do nothing if the form is not dirty', inject(['Alert', function(Alert) {
      isolateScope.detailsForm.$dirty = false;
      spyOn(Alert, 'confirm');

      isolateScope.cancel();

      expect(Alert.confirm).not.toHaveBeenCalled();
  }]));
    
    it('should be called on cancel event', inject(['$rootScope', function($rootScope) {
      spyOn(isolateScope, 'cancel');
      $rootScope.$broadcast('resource:details:myresource:cancel');
      isolateScope.$digest();
      expect(isolateScope.cancel).toHaveBeenCalled();
    }]));
  });
  
  describe('save function', function() {
    beforeEach(function() {
    doDefaultCompile();
    });

    it('should update the resource with the details returned by API', inject(function() {
    var resultUser = angular.copy($scope.user);
    resultUser.id = 'abc';

    $httpBackend.when('POST', apiHostname + '/v1/users').respond({
      'result': resultUser
    });
    $httpBackend.expectPOST(apiHostname + '/v1/users');

    isolateScope.save();
    $httpBackend.flush();

    expect(isolateScope.resource.id).toBe(resultUser.id);
  }));
    
    it('should work with cancel', inject(['DirtyForms', function(DirtyForms) {
      var resultUser = angular.copy($scope.user);
      resultUser.firstName = 'Fred';
      resultUser.id = 'abc';

      $httpBackend.when('POST', apiHostname + '/v1/users').respond({
        'result': resultUser
    });
      $httpBackend.expectPOST(apiHostname + '/v1/users');

      isolateScope.save();
      $httpBackend.flush();

      spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function(callback){
        callback();
      });
      
      isolateScope.resource.firstName = 'Mark';
      isolateScope.detailsForm.$dirty = true;
      isolateScope.cancel();

      expect(isolateScope.resource.firstName).toBe('Fred');
    }]));
    
    describe('on success', function(){
      beforeEach(inject(['$q', '$rootScope', function($q, $rootScope){
        spyOn(isolateScope.resource, 'save').and.callFake(function(){
          var deferred = $q.defer();
          deferred.resolve('success');
          var promise = deferred.promise;
          return promise;
      });
        
        spyOn($rootScope, '$broadcast').and.callThrough();
    }]));

      
      it('should broadcast the given event, if defined', inject(['$rootScope', function($rootScope) {
        isolateScope.save('successEventName');
        isolateScope.$digest();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('successEventName', jasmine.any(Object));
      }]));
    });
    
    describe('on failure', function(){
      beforeEach(inject(['$q', '$rootScope', function($q, $rootScope){
        spyOn(isolateScope.resource, 'save').and.callFake(function(){
          var deferred = $q.defer();
          deferred.reject('failure');
          var promise = deferred.promise;
          return promise;
        });
        
        spyOn($rootScope, '$broadcast').and.callThrough();
        spyOn(isolateScope, 'handleErrors').and.callFake(function(error){
          return $q.reject(error);
        });
      }]));
      
      it('should broadcast the given event, if defined', inject(['$rootScope', function($rootScope) {
        isolateScope.save('successEventName', 'failEventName');
        isolateScope.$digest();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('failEventName', jasmine.any(Object));
      }]));
    });
  });
  
  describe('handleErrors function', function() {
    beforeEach(function() {
      doDefaultCompile();
    });

    it('should call Alert when record fails to save', inject(['Alert', function(Alert) {
      spyOn(Alert, 'error');
      
      isolateScope.handleErrors({data: {}});
      expect(Alert.error).toHaveBeenCalledWith('Record failed to save');
    }]));
    
    it('should call Alert when record fails to update', inject(['Alert', function(Alert) {
      spyOn(Alert, 'error');
      spyOn(isolateScope.resource, 'isNew').and.returnValue(false);
      
      isolateScope.handleErrors({data: {}});
      expect(Alert.error).toHaveBeenCalledWith('Record failed to update');
    }]));
    
    it('should set the error details of corresponding fields', inject([function() {
      isolateScope.detailsForm = {
          firstKey: {
            $setValidity: jasmine.createSpy('setValidity'),
            $error: {},
            $setTouched: jasmine.createSpy('touched')
          }
      };
      
      isolateScope.handleErrors({data: {error : {attribute: {
        'firstKey': 'The first error'
      }}}});
      expect(isolateScope.detailsForm.firstKey.$error).toEqual({api: 'The first error'});
      expect(isolateScope.detailsForm.firstKey.$setValidity).toHaveBeenCalledWith('api', false);
      expect(isolateScope.detailsForm.firstKey.$setTouched).toHaveBeenCalled();
    }]));
  });
});
