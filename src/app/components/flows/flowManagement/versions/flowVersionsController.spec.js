/* global jasmine: false, spyOn: false  */

'use strict';

describe('Versions directive controller', function () {
  var $scope,
    $controller,
    $httpBackend,
    FlowVersion,
    Session,
    mockFlows,
    mockFlowVersions;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows.versions'));
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'FlowVersion', 'apiHostname', 'mockFlows', 'mockFlowVersions', 'Session',
    function ($rootScope, _$controller_, $injector, _FlowVersion_, apiHostname, _mockFlows, _mockFlowVersions, _Session) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = $injector.get('$httpBackend');
      mockFlows = _mockFlows;
      mockFlowVersions = _mockFlowVersions;
      FlowVersion = _FlowVersion_;
      Session = _Session;

      $scope.flow = mockFlows[0];

      $scope.createVersionForm = {
        $setPristine: angular.noop,
        $setUntouched: angular.noop
      };

      $controller('FlowVersionsController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    }
  ]));

  describe('getVersions function', function () {
    it('should be defined', function () {
      expect($scope.getVersions).toBeDefined();
      expect($scope.getVersions).toEqual(jasmine.any(Function));
    });

    it('should query for flow versions', function () {
      $httpBackend.expectGET('fakendpoint.com/v1/tenants/tenant-id/flows/flowId1/versions');
      $scope.getVersions();
      $httpBackend.flush();
    });
  });

  describe('on new version creation', function () {
    beforeEach(function () {
      $scope.createVersion();

      $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/tenant-id/flows/flowId1/versions').respond(201, {
        'result': mockFlowVersions[0]
      });
      
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/tenant-id/flows/flowId1/versions').respond(200, {
        'result': [mockFlowVersions[0], mockFlowVersions[1]]
      });
    });

    it('should have a function to create a new version', function () {
      expect($scope.version).toBeDefined();
      expect($scope.version.flow).toBe(mockFlowVersions[0].flow);
      expect($scope.version.flowId).toBe(mockFlowVersions[0].flowId);
    });

    it('should clean listener when switching flow id', function () {
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/tenant-id/flows/flowId1/versions').respond({
        'result': []
      });

      spyOn($scope, 'cleanHandler');
      var cleanHandler = $scope.cleanHandler;

      $scope.flow = {
        id: mockFlows[0].id,
        tenantId: Session.tenant.tenantId
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
