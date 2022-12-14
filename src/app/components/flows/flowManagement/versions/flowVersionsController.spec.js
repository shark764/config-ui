/* global jasmine: false, spyOn: false  */

'use strict';

describe('Versions directive controller', function() {
  var $scope,
    $httpBackend,
    FlowVersion,
    Session,
    mockFlows,
    mockFlowVersions,
    apiHostname;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.version.mock'));
  beforeEach(module('liveopsConfigPanel.mockutils'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'FlowVersion', 'apiHostname', 'mockFlows', 'mockFlowVersions', 'Session', 'mockForm',
    function($rootScope, $controller, _$httpBackend, _FlowVersion, _apiHostname, _mockFlows, _mockFlowVersions, _Session, mockForm) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockFlows = _mockFlows;
      mockFlowVersions = _mockFlowVersions;
      FlowVersion = _FlowVersion;
      Session = _Session;
      apiHostname = _apiHostname;

      $scope.flow = mockFlows[0];

      $scope.createVersionForm = mockForm();

      $controller('FlowVersionsController', {
        '$scope': $scope
      });
    }
  ]));

  describe('getVersions function', function() {
    it('should be defined', function() {
      expect($scope.getVersions).toBeDefined();
      expect($scope.getVersions).toEqual(jasmine.any(Function));
    });

    it('should query for flow versions', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions');
      $scope.getVersions();
      $httpBackend.flush();
    });

    it('should do nothing if the flow is new', inject(function(Flow) {
      spyOn(FlowVersion, 'cachedQuery');
      $scope.flow = new Flow();
      $scope.getVersions();
      expect(FlowVersion.cachedQuery).not.toHaveBeenCalled();
    }));
  });

  describe('saveVersion function', function() {
    it('should be defined', function() {
      expect($scope.saveVersion).toBeDefined();
      expect($scope.saveVersion).toEqual(jasmine.any(Function));
    });

    it('should save the version', function() {
      $scope.version = new FlowVersion({
        tenantId: 'tenant-id',
        flowId: 'flowId1'
      });

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions').respond(201, {
        'result': mockFlowVersions[0]
      });
      $scope.saveVersion();
      $httpBackend.flush();
    });

    it('should reset the controller after creating', function() {
      $scope.version = new FlowVersion({
        tenantId: 'tenant-id',
        flowId: 'flowId1'
      });

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions').respond(201, {
        'result': mockFlowVersions[0]
      });

      spyOn($scope, 'createVersion');
      $scope.saveVersion();
      $httpBackend.flush();

      expect($scope.createVersionForm.$setPristine).toHaveBeenCalled();
      expect($scope.createVersionForm.$setUntouched).toHaveBeenCalled();
      expect($scope.createVersion).toHaveBeenCalled();
    });
  });

  describe('flow watch', function() {
    beforeEach(function() {
      $scope.createVersion();

      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions').respond(201, {
        'result': mockFlowVersions[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions').respond(200, {
        'result': [mockFlowVersions[0], mockFlowVersions[1]]
      });
    });

    it('should have a function to create a new version', function() {
      expect($scope.version).toBeDefined();
      expect($scope.version.flow).toBe(mockFlowVersions[0].flow);
      expect($scope.version.flowId).toBe(mockFlowVersions[0].flowId);
    });

    it('should clean listener when switching flow id', function() {
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/flows/flowId1/versions').respond({
        'result': []
      });

      $scope.cleanHandler = jasmine.createSpy('cleanHandler');
      var cleanHandler = $scope.cleanHandler;

      $scope.flow = {
        id: mockFlows[0].id,
        tenantId: Session.tenant.tenantId
      };

      $scope.$digest();

      expect(cleanHandler).not.toBe($scope.cleanHandler);
      expect(cleanHandler).toHaveBeenCalled();
    });

    it('should do nothing if the new flow is null', function() {
      spyOn($scope, 'createVersion');
      $scope.flow = null;
      $scope.$digest();
      expect($scope.createVersion).not.toHaveBeenCalled();
    });
  });
});

describe('flow versions directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel', function($controllerProvider) {
    $controllerProvider.register('FlowVersionsController', function() {});
  }));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    $scope.flow = {
      id: '1'
    };

    element = $compile('<flow-versions flow="flow" versions="versions"></flow-versions>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should insert a table', function() {
    expect(element.find('table').length).toEqual(1);
  });
});
