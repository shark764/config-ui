/* global jasmine: false  */

'use strict';

describe('flowDraft controller', function() {
  var $scope,
    $httpBackend,
    apiHostname,
    FlowDraft,
    Session,
    mockFlows,
    mockFlowDrafts;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.flow.draft.mock'));

  beforeEach(inject(['$rootScope', '$controller', '$httpBackend', 'FlowDraft', 'apiHostname', 'mockFlows', 'mockFlowDrafts', 'Session',
    function($rootScope, $controller, _$httpBackend, _FlowDraft, _apiHostname, _mockFlows, _mockFlowDrafts, _Session) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      mockFlows = _mockFlows;
      mockFlowDrafts = _mockFlowDrafts;
      FlowDraft = _FlowDraft;
      Session = _Session;

      $scope.flow = mockFlows[0];

      $controller('FlowDraftsController', {
        '$scope': $scope
      });

      $httpBackend.flush();

      $scope.createDraftForm = {
        $setPristine: jasmine.createSpy('$setPristine'),
        $setUntouched: jasmine.createSpy('$setUntouched')
      };
    }
  ]));

  it('should have drafts defined', function() {
    expect($scope.drafts).toBeDefined();
    expect($scope.drafts[0].id).toEqual(mockFlowDrafts[0].id);
    expect($scope.drafts[1].id).toEqual(mockFlowDrafts[1].id);
  });

  describe('fetch function', function() {
    it('should be defined', function() {
      expect($scope.fetch).toBeDefined();
      expect($scope.fetch).toEqual(jasmine.any(Function));
    });

    it('should query for flow drafts', function() {
      $httpBackend.expectGET(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/drafts');
      $scope.fetch();
      $httpBackend.flush();
    });
  });

  describe('saveDraft function', function() {
    it('should be defined', function() {
      expect($scope.saveDraft).toBeDefined();
      expect($scope.saveDraft).toEqual(jasmine.any(Function));
    });

    it('should save the draft', function() {
      $scope.draft = new FlowDraft({
        flowId: 'flowId1',
        tenantId: 'tenant-id'
      });

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/drafts').respond(200);
      $scope.saveDraft();
      $httpBackend.flush();
    });

    it('should reset the draft after creation', function() {
      $scope.draft = new FlowDraft({
        flowId: 'flowId1',
        tenantId: 'tenant-id',
        flow: '[{some stuff}]'
      });

      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/drafts').respond(200);
      $scope.saveDraft();
      $httpBackend.flush();

      expect($scope.draft.flow).toEqual('[]');
    });
  });

  describe('deleteDraft function', function() {
    it('should be defined', function() {
      expect($scope.deleteDraft).toBeDefined();
      expect($scope.deleteDraft).toEqual(jasmine.any(Function));
    });

    it('should show a confirm box', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm');

      $scope.deleteDraft();
      expect(Alert.confirm).toHaveBeenCalled();
    }]));

    it('should delete the draft', inject(function(Alert) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback) {
        okCallback();
      });

      $httpBackend.expectDELETE(apiHostname + '/v1/tenants/tenant-id/flows/flowId1/drafts/draftId1').respond(200);
      $scope.deleteDraft(new FlowDraft({
        tenantId: 'tenant-id',
        flowId: 'flowId1',
        id: 'draftId1'
      }));
      $httpBackend.flush();
    }));
  });
});

describe('flow drafts directive', function() {
  var $scope,
    element,
    isolateScope,
    $compile;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel', function($controllerProvider) {
    $controllerProvider.register('FlowDraftsController', function() {});
  }));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $scope.flow = {
      id: '1'
    };

    element = $compile('<flow-drafts flow="flow" drafts="drafts"></flow-drafts>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should insert a table', inject(function() {
    expect(element.find('table').length).toEqual(1);
  }));
});
