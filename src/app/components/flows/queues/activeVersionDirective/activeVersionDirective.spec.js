'use strict';
 
describe('activeVersion directive', function(){
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
      id: 'q1',
      tenantId: 't1'
    };

    $scope.version = {
      name: 'version1',
      id: 'v1'
    };

    $scope.placeholder = 'enter a value';
    $scope.hasHandles = true;

    $httpBackend.when('GET', apiHostname + '/v1/tenants/t1/queues/q1/versions/v1').respond({
        'result': $scope.version
      });
    
    
    doCompile = function(){
      element = $compile('<active-version queue="item"></active-version>')($scope);
      $scope.$digest();
      $httpBackend.flush();
      isolateScope = element.isolateScope();
    };
  }]));


  it('should get the version name based on the version id', inject(function() {
    Session.tenant = { tenantId: '1' };
    doCompile();
    expect(isolateScope.queueActiveVersion).toEqual($scope.version.name);
  }));

  it('should passing in a queue without an active version means the queue active version is not defined', inject(function(){
    $scope.item = {
      id: 'q2',
      tenantId: "t2"
    }
    doCompile();
    expect(isolateScope.queueActiveVersion).not.toBeDefined();
  }));

});