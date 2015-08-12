/* global jasmine: false  */

'use strict';

describe('flowDraft controller', function () {
  var $scope,
    $controller,
    $httpBackend,
    FlowDraft,
    Session,
    mockFlows,
    mockFlowDrafts;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows.drafts'));
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'FlowDraft', 'apiHostname', 'mockFlows', 'mockFlowDrafts', 'Session',
    function ($rootScope, _$controller_, $injector, _FlowDraft_, apiHostname, _mockFlows, _mockFlowDrafts, _Session) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = $injector.get('$httpBackend');
      mockFlows = _mockFlows;
      mockFlowDrafts = _mockFlowDrafts;
      FlowDraft = _FlowDraft_;
      Session = _Session;

      $scope.flow = mockFlows[0];

      $controller('FlowDraftsController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    }
  ]));

  it('should have drafts defined', function () {
    expect($scope.drafts).toBeDefined();
    expect($scope.drafts[0].id).toEqual(mockFlowDrafts[0].id);
    expect($scope.drafts[1].id).toEqual(mockFlowDrafts[1].id);
  });

  describe('fetch function', function () {
    it('should be defined', function () {
      expect($scope.fetch).toBeDefined();
      expect($scope.fetch).toEqual(jasmine.any(Function));
    });

    it('should query for flow drafts', inject(['apiHostname', function (apiHostname) {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/drafts');
      $scope.fetch();
      $httpBackend.flush();
    }]));
  });
});

describe('flow drafts directive', function(){
  var $scope,
    element,
    isolateScope,
    $compile;

  beforeEach(module('liveopsConfigPanel', function($controllerProvider){
    $controllerProvider.register('FlowDraftsController', function(){});
  }));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $scope.flow = {id: '1'};

    element = $compile('<flow-drafts flow="flow" drafts="drafts"></flow-drafts>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should insert a table', inject(function() {
    expect(element.find('table').length).toEqual(1);
  }));
});
