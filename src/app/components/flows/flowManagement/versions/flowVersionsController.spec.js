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

      $scope.versions = [];

      $controller('FlowVersionsController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    }
  ]));

  it('should have versions defined', function () {
    expect($scope.versions).toBeDefined();
    expect($scope.versions[0].id).toEqual(mockFlowVersions[0].id);
    expect($scope.versions[1].id).toEqual(mockFlowVersions[1].id);
  });

  describe('fetch function', function () {
    it('should be defined', function () {
      expect($scope.fetch).toBeDefined();
      expect($scope.fetch).toEqual(jasmine.any(Function));
    });

    it('should query for flow versions', function () {
      $httpBackend.expectGET('fakendpoint.com/v1/tenants/tenant-id/flows/flowId1/versions');
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

      $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/tenant-id/flows/flowId1/versions').respond(201, {
        'result': mockFlowVersions[0]
      });
    });

    it('should have a function to create a new version', function () {
      expect($scope.version).toBeDefined();
      expect($scope.version.flow).toBe(mockFlowVersions[0].flow);
      expect($scope.version.flowId).toBe(mockFlowVersions[0].flowId);
    });

    xit('should succeed on save and push new item to list', function () {
      spyOn($scope, 'createVersion');

      $scope.saveVersion();

      expect($scope.versions.length).toEqual(2);

      $httpBackend.flush();

      expect($scope.versions.length).toEqual(3);

      expect($scope.createVersion).toHaveBeenCalled();
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
