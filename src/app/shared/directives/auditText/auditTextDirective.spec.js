'use strict';

describe('auditText directive', function(){
  var $scope,
    $compile,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(module('pascalprecht.translate', function($translateProvider){
    $translateProvider.translations('en', {
      'value.displayName': '{{displayName}}',
      'plain.value': 'A string'
    });
    
    $translateProvider.preferredLanguage('en');
  }));
  
  beforeEach(inject(['$compile', '$rootScope', function(_$compile, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile;
  }]));
  
  describe('getAttributes function', function(){
    it('should return a list of all the attributes if its an element', function() {
      element = $compile('<audit-text attr-one another-attribute="value"></audit-text>')($scope);
      $scope.$digest();
      
      var attrs = element.isolateScope().getAttributes();
      expect(attrs).toEqual({attrOne: '', anotherAttribute: 'value'});
    });
    
    it('should return a list of all the attributes if its an attribute', function() {
      element = $compile('<span audit-text attr-one another-attribute="value"></span>')($scope);
      $scope.$digest();
      
      var attrs = element.isolateScope().getAttributes();
      expect(attrs).toEqual({auditText: '', attrOne: '', anotherAttribute: 'value'});
    });
  });
  
  describe('refresh function', function(){
    it('should do a plain translate if not given a userId', function() {
      element = $compile('<audit-text translation="plain.value"></audit-text>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      
      isolateScope.refresh();
      expect(element.text()).toEqual('A string');
    });
    
    it('should translate the displayname with the one returned by usercache', inject(['$q', 'UserCache', function($q, UserCache) {
      var deferred = $q.defer();
      deferred.resolve({id: 1,  displayName: 'bob'});
      var cacheResult = angular.extend({
        $promise: deferred.promise,
      }, {id: 1, displayName: 'bob'});
      spyOn(UserCache, 'get').and.returnValue(cacheResult);
      
      element = $compile('<audit-text translation="value.displayName" user-id="1"></audit-text>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      
      isolateScope.refresh();
      expect(element.text()).toEqual('bob');
    }]));
  });
  
});