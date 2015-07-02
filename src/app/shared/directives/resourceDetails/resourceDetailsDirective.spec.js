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
    
    $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{}]});
    $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {}});
    
    $scope.user = new User({ firstName: 'John', lastName: 'Benson' });
    
    doDefaultCompile = function(){
      element = $compile('<resource-details original-resource="user"></resource-details>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));

  it('should not render the body or header if no body or header templates were provided', inject(function () {
    doDefaultCompile();

    var body = element.find('#detail-body-pane');
    var header = element.find('#detail-header-pane');

    expect(body.length).toBe(0);
    expect(header.length).toBe(0);
  }));

  it('should render the body and header if a body or header templates are provided', inject(['$compile', '$templateCache', function ($compile, $templateCache) {
    $httpBackend.when('GET', apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/skills').respond({'result' : []});
    $httpBackend.expectGET(apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/skills');

    $templateCache.put('body.html', '<detail-body-pane></detail-body-pane>');
    $templateCache.put('header.html', '<detail-header-pane></detail-header-pane>');
    var ele = $compile('<resource-details original-resource="user" header-template-url="header.html" body-template-url="body.html"></resource-details>')($scope);
    $scope.$digest();

    var body = ele.find('detail-body-pane');
    var header = ele.find('detail-header-pane');

    expect(body.length).toBe(1);
    expect(header.length).toBe(1);
  }]));

  it('should have a function to reset a resource that properly handles saves', inject(function() {
    doDefaultCompile();
    
    var resultUser = angular.copy($scope.user);
    resultUser.firstName = 'Fred';
    resultUser.id = 'abc';

    $httpBackend.when('POST', apiHostname + '/v1/tenants/users').respond({'result' : resultUser});
    $httpBackend.expectPOST(apiHostname + '/v1/tenants/users');
    
    isolateScope.save();
    $httpBackend.flush();

    isolateScope.cancel();

    expect(isolateScope.resource.firstName).toBe('Fred');

  }));

  it('should have a function to save a resource', inject(function() {
    doDefaultCompile();
    
    var resultUser = angular.copy($scope.user);
    resultUser.id = 'abc';

    $httpBackend.when('POST', apiHostname + '/v1/tenants/users').respond({'result' : resultUser});
    $httpBackend.expectPOST(apiHostname + '/v1/tenants/users');
    
    isolateScope.save();
    $httpBackend.flush();

    expect(isolateScope.resource.id).toBe(resultUser.id);
  }));
  
  describe('$stateChangeStart handler', function(){
    beforeEach(function(){
      doDefaultCompile();
    });
    
    it('should popup a confirm alert if the form is dirty', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm');
      isolateScope.detailsForm.$dirty = true;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}}); //Event params are checked by auth/routeSecurity.js
      expect(Alert.confirm).toHaveBeenCalled();
    }]));
    
    it('should do nothing and allow the state change to happen on ok', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback){
        okCallback();
      });
      
      spyOn(angular, 'noop');
      isolateScope.detailsForm.$dirty = true;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      expect(angular.noop).toHaveBeenCalled();
    }]));
    
    it('should prevent the event on cancel', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback){
        cancelCallback();
      });
      
      isolateScope.detailsForm.$dirty = true;
      var event = $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      
      expect(event.defaultPrevented).toBeTruthy();
    }]));
    
    it('should do nothing if the form is not dirty', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm');
      isolateScope.detailsForm.$dirty = false;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      expect(Alert.confirm).not.toHaveBeenCalled();
    }]));
  });
  
  describe('cancel function', function(){
    beforeEach(function(){
      doDefaultCompile();
    });
    
    it('should reset the resource on ok', inject(['Alert', function(Alert) {
      isolateScope.detailsForm.$dirty = true;
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback){
        okCallback();
      });
      
      isolateScope.resource.firstName='JohnTest';
      isolateScope.cancel();

      expect(isolateScope.resource.firstName).toEqual('John');
    }]));
    
    it('should reset the form on ok', inject(['Alert', function(Alert) {
      isolateScope.detailsForm.$dirty = true;
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback){
        okCallback();
      });
      
      spyOn(isolateScope, 'resetForm');
      isolateScope.cancel();

      expect(isolateScope.resetForm).toHaveBeenCalled();
    }]));
    
    it('should do nothing on dialog cancel', inject(['Alert', function(Alert) {
      isolateScope.detailsForm.$dirty = true;
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback){
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
  });
  
  describe('onbeforeunload function', function(){
    beforeEach(function(){
      doDefaultCompile();
    });
    
    it('should set $window.onbeforeunload', inject(['$window', function($window) {
      expect($window.onbeforeunload).toBeDefined();
      expect($window.onbeforeunload).toEqual(jasmine.any(Function));
    }]));
    
    it('should set a message if the form is dirty', inject(['$window', function($window) {
      isolateScope.detailsForm.$dirty = true;
      expect($window.onbeforeunload()).toEqual(jasmine.any(String));
    }]));
    
    it('should do nothing if the form isn\'t dirty', inject(['$window', function($window) {
      isolateScope.detailsForm.$dirty = false;
      expect($window.onbeforeunload()).toBeUndefined();
    }]));
  });
});
