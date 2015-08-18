'use strict';
 
describe('flowVersionNameDirective directive', function(){
  var $scope,
    element,
    Session,
    isolateScope,
    doCompile;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  beforeEach(module('liveopsConfigPanel.mock.content'));
  
  beforeEach(inject(['$compile', '$rootScope', 'Session', '$httpBackend', 'apiHostname', function($compile, _$rootScope_, _Session, $httpBackend, apiHostname) {
    $scope = _$rootScope_.$new();
    Session = _Session;
    
    $scope.item = { 
      activeVersion: 'v1',
      id: 'f1'
    };

    $scope.version = {
      name: 'version1',
      id: 'v1'
    };

    $scope.placeholder = 'enter a value';
    $scope.hasHandles = true;

    $httpBackend.when('GET', apiHostname + '/v1/tenants/1/flows/f1/versions/v1').respond({
        'result': $scope.version
      });
    
    
    doCompile = function(){
      element = $compile('<flow-version-name flow="item"></flow-version-name>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));


  it('should get the version name based on the version id', inject(['$httpBackend', function($httpBackend) {
    Session.tenant = { tenantId: '1' };
    doCompile();
    $httpBackend.flush();
    expect(isolateScope.name).toEqual($scope.version.name);
  }]));

  it('should passing in a queue without an active version means the queue active version is not defined', inject(function(){
    $scope.item = {
      id: 'q2',
      tenantId: 't2'
    };
    doCompile();
    expect(isolateScope.name).not.toBeDefined();
  }));

});