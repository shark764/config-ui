'use strict';

describe('QueueQueryCreatorController', function() {
  var $scope,
  controller,
  QueueVersion,
  jsedn,
  loEvents;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['$rootScope', '$controller', 'QueueVersion', 'jsedn', 'loEvents',
    function($rootScope, $controller, _QueueVersion, _jsedn, _loEvents) {
      $scope = $rootScope.$new();
      QueueVersion = _QueueVersion;
      jsedn = _jsedn;
      loEvents = _loEvents;
      
      $scope.rootMap = jsedn.parse('{}');
      $scope.version = new QueueVersion();
      controller = $controller('QueueQueryCreatorController', {'$scope': $scope});
      $scope.$digest();
    }]));
    
  it('should catch the table create event and reinitialize the builder UI', inject(['$rootScope', function($rootScope) {
    $rootScope.$broadcast(loEvents.tableControls.itemCreate);
    $scope.$digest();
    
    var mockComponent = {
      name: 'myComponent',
      enabled: false,
      keyword: ':myKey'
    };

    $scope.queryComponents = [mockComponent];
    expect($scope.myComponent).toBeUndefined();
    $scope.rootMap = jsedn.parse('{}');
    controller.initComponentState();
    expect(mockComponent.enabled).toBeFalsy();
    expect($scope.myComponent).toBeUndefined();
  }]));
  
  describe('rootMap watch', function() {
    it('should encode the rootMap and set the version\'s query', function() {
      expect($scope.version.query).toEqual('{}');
      $scope.rootMap = jsedn.parse('[]');
      $scope.$digest();
      expect($scope.version.query).toEqual('[]');
    });
    
    it('should do nothing if the map is null', function() {
      expect($scope.version.query).toEqual('{}');
      $scope.rootMap = null;
      $scope.$digest();
      expect($scope.version.query).toEqual('{}');
    });
    
    it('should do nothing if the queue version is null or undefined', function() {
      $scope.version = null;
      $scope.rootMap = jsedn.parse('[]');
      spyOn(jsedn, 'encode');
      $scope.$digest();
      expect(jsedn.encode).not.toHaveBeenCalled();
    });
  });
  
  describe('version.query watch', function() {
    it('should parse the new query and set the rootMap', function() {
      $scope.version.query = '[1, 2, 3]';
      $scope.$digest();
      expect(jsedn.encode($scope.rootMap)).toEqual('[1 2 3]');
    });
  });
  
  describe('queryComponent skillcomponent remove function', function() {
    it('should remove the :skills keyword from the rootMap', inject(['filterFilter', function(filterFilter) {
      var rootMap = jsedn.parse('{:skills (and (and {#uuid "skillId2" (>= 1)}))}');
      expect(rootMap.exists(jsedn.kw(':skills'))).toBeTruthy();
      
      var skillComponent = filterFilter($scope.queryComponents, {name: 'skillcomponent'})[0];
      
      skillComponent.remove(rootMap);
      expect(rootMap.exists(jsedn.kw(':skills'))).toBeFalsy();
    }]));
    
    it('should leave other keywords intact in the rootMap', inject(['filterFilter', function(filterFilter) {
      var rootMap = jsedn.parse('{:skills (and (and {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)})) :groups (and (and {#uuid "groupId1" true}))}');
      expect(rootMap.exists(jsedn.kw(':groups'))).toBeTruthy();
      
      var skillComponent = filterFilter($scope.queryComponents, {name: 'skillcomponent'})[0];
      
      skillComponent.remove(rootMap);
      expect(rootMap.exists(jsedn.kw(':groups'))).toBeTruthy();
    }]));
  });
  
  describe('queryComponent groupcomponent remove function', function() {
    it('should remove the :groups keyword from the rootMap', inject(['filterFilter', function(filterFilter) {
      var rootMap = jsedn.parse('{:groups (and (and {#uuid "groupId2" true} {#uuid "groupId1" true}))}');
      expect(rootMap.exists(jsedn.kw(':groups'))).toBeTruthy();
      
      var groupComponent = filterFilter($scope.queryComponents, {name: 'groupcomponent'})[0];
      
      groupComponent.remove(rootMap);
      expect(rootMap.exists(jsedn.kw(':groups'))).toBeFalsy();
    }]));
    
    it('should leave other keywords intact in the rootMap', inject(['filterFilter', function(filterFilter) {
      var rootMap = jsedn.parse('{:groups (and (and {#uuid "groupId1" true})) :skills (and (and {#uuid "skillId2" (>= 1)} {#uuid "skillId1" (> 50)}))}');
      expect(rootMap.exists(jsedn.kw(':skills'))).toBeTruthy();
      
      var groupComponent = filterFilter($scope.queryComponents, {name: 'groupcomponent'})[0];
      
      groupComponent.remove(rootMap);
      expect(rootMap.exists(jsedn.kw(':skills'))).toBeTruthy();
    }]));
  });
  
  describe('add function', function() {
    it('should save the component in the scope under it\'s name', function() {
      var mockComponent = {
        someProp: 'someVal',
        name: 'myComponent'
      };
      
      expect($scope.myComponent).toBeUndefined();
      $scope.add(mockComponent);
      expect($scope.myComponent).toBe(mockComponent);
    });
    
    it('should set the component as enabled', function() {
      var mockComponent = {
        enabled: false,
        name: 'myComponent'
      };
      
      $scope.add(mockComponent);
      expect(mockComponent.enabled).toBeTruthy();
    });
  });
  
  describe('remove function', function() {
    it('should remove the stored copy in the scope', function() {
      var mockComponent = {
        keyword: ':myKey',
        name: 'myComponent',
        remove: jasmine.createSpy('remove'),
        enabled: true
      };
      
      $scope.myComponent = mockComponent;
      $scope.remove(mockComponent);
      expect($scope.myComponent).toBeNull();
    });
    
    it('should set the component as not enabled', function() {
      var mockComponent = {
          keyword: ':myKey',
          name: 'myComponent',
          remove: jasmine.createSpy('remove'),
          enabled: true
        };
        
        $scope.remove(mockComponent);
        expect(mockComponent.enabled).toBeFalsy();
    });
    
    it('should call the remove function on the given component if the key exists in the rootMap', function() {
      var mockComponent = {
          keyword: ':myKey',
          name: 'myComponent',
          remove: jasmine.createSpy('remove'),
          enabled: true
        };
        
        $scope.rootMap = jsedn.parse('{:myKey []}');
        $scope.remove(mockComponent);
        expect(mockComponent.remove).toHaveBeenCalled();
    });
    
    it('should show a confirm alert if the component has contents', inject(['Alert', function(Alert) {
      var mockComponent = {
          keyword: ':myKey',
          name: 'myComponent',
          remove: jasmine.createSpy('remove'),
          enabled: true
        };
        
        spyOn(Alert, 'confirm');
        $scope.rootMap = jsedn.parse('{:myKey [1 2 3]}');
        $scope.remove(mockComponent);
        expect(Alert.confirm).toHaveBeenCalled();
    }]));
    
    it('should call remove on the component if the user accepts the confirm message', inject(['Alert', function(Alert) {
      var mockComponent = {
          keyword: ':myKey',
          name: 'myComponent',
          remove: jasmine.createSpy('remove'),
          enabled: true
        };
        
        spyOn(Alert, 'confirm').and.callFake(function(message, okCallback){
          okCallback();
        });
        $scope.rootMap = jsedn.parse('{:myKey [1 2 3]}');
        $scope.remove(mockComponent);
        expect(mockComponent.remove).toHaveBeenCalled();
    }]));
    
    it('should do nothing if the user cancels the confirm message', inject(['Alert', function(Alert) {
      var mockComponent = {
          keyword: ':myKey',
          name: 'myComponent',
          remove: jasmine.createSpy('remove'),
          enabled: true
        };
        
        spyOn(Alert, 'confirm');
        $scope.rootMap = jsedn.parse('{:myKey [1 2 3]}');
        $scope.remove(mockComponent);
        expect(mockComponent.remove).not.toHaveBeenCalled();
    }]));
  });
  
  describe('initComponentState function', function() {
    it('should add the component if its keyword exists in the rootMap', function() {
      var mockComponent = {
        name: 'myComponent',
        enabled: false,
        keyword: ':myKey'
      };

      $scope.queryComponents = [mockComponent];
      expect($scope.myComponent).toBeUndefined();
      $scope.rootMap = jsedn.parse('{:myKey [1 2 3] :anotherKey [5  5]}');
      controller.initComponentState();
      expect(mockComponent.enabled).toBeTruthy();
      expect($scope.myComponent).toBe(mockComponent);
    });
  });
});
