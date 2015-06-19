/* global spyOn, jasmine: false  */

'use strict';

describe('Versions directive controller', function () {
  var $scope,
    $controller,
    $httpBackend,
    versions,
    FlowVersion,
    flowId,
    flow;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'FlowVersion', 'apiHostname',
    function ($rootScope, _$controller_, $injector, _FlowVersion_, apiHostname) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      FlowVersion = _FlowVersion_;

      versions = [
        new FlowVersion({
          name: 'q1',
          description: 'A pretty good version',
          id: 'q1'
        }),
        new FlowVersion({
          name: 'q2',
          description: 'Not as cool as the other version',
          id: 'q2'
        })
      ];

      flowId = 555;
      flow = '[]';

      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/' + flowId + '/versions').respond({
        'result': versions
      });
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
        'tenants': []
      }});

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});

      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/' + flowId + '/versions').respond({'result': versions});


      $scope.flow = {
        id: flowId
      };

      $scope.createVersionForm = {
        $setPristine: angular.noop,
        $setUntouched: angular.noop
      };

      $scope.versions = [];

      $controller('FlowVersionsController', {
        '$scope': $scope,
        'Session': {
          tenant: {
            tenantId: 1
          }
        }
      });

      $httpBackend.flush();
    }
  ]));

  it('should have versions defined', function () {
    expect($scope.versions).toBeDefined();
    expect($scope.versions[0].id).toEqual(versions[0].id);
    expect($scope.versions[1].id).toEqual(versions[1].id);
  });
  
  describe('fetch function', function () {
    it('should be defined', function () {
      expect($scope.fetch).toBeDefined();
      expect($scope.fetch).toEqual(jasmine.any(Function));
    });
    
    it('should query for flow versions', function () {
      $httpBackend.expectGET('fakendpoint.com/v1/tenants/1/flows/' + flowId + '/versions');
      $scope.fetch();
      $httpBackend.flush();
    });
    
    it('should set the v property', function () {
      $scope.fetch();
      $httpBackend.flush();
      
      expect($scope.versions[0].v).toEqual(2);
      expect($scope.versions[1].v).toEqual(1);
    });
  });

  describe('on new version creation', function () {
    beforeEach(function () {
      $scope.createVersion();

      $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows/' + flowId + '/versions').respond(201, {
        'result': versions[0]
      });
    });

    it('should have a function to create a new version', function () {
      expect($scope.version).toBeDefined();
      expect($scope.version.flow).toBe(flow);
      expect($scope.version.flowId).toBe(flowId);
    });

    it('should succeed on save and push new item to list', function () {
      spyOn($scope, 'createVersion');

      $scope.saveVersion();

      expect($scope.versions.length).toEqual(2);

      $httpBackend.flush();

      expect($scope.versions.length).toEqual(3);

      expect($scope.createVersion).toHaveBeenCalled();
    });

    it('should clean listener when switching flow id', function () {
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/' + versions[1].id + '/versions').respond({
        'result': []
      });

      spyOn($scope, 'cleanHandler');
      var cleanHandler = $scope.cleanHandler;

      $scope.flow = {
        id: versions[1].id
      };

      $scope.$digest();

      expect(cleanHandler).not.toBe($scope.cleanHandler);
      expect(cleanHandler).toHaveBeenCalled();
    });
  });
});

describe('flow versions directive', function(){
  var $scope,
    element,
    isolateScope,
    $compile;

  beforeEach(module('liveopsConfigPanel', function($controllerProvider){
    $controllerProvider.register('FlowVersionsController', function(){});
  }));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $scope.flow = {id: '1'};
    
    element = $compile('<flow-versions flow="flow" versions="versions"></flow-versions>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should insert a table', inject(function() {
    expect(element.find('table').length).toEqual(1);
  }));

  
});
