'use strict';

describe('QueueController', function() {
  var $scope,
  $controller,
  $httpBackend,
  mockQueues,
  Queue,
  apiHostname,
  Session,
  routeParams,
  mockQueueVersions;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.queues'));
  beforeEach(module('liveopsConfigPanel.mock.content.queueversions'));
  
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'Queue', 'apiHostname', 'Session', 'mockQueues', 'mockQueueVersions',
    function($rootScope, _$controller_, $injector, _Queue_, _apiHostname, _Session_, _mockQueues, _mockQueueVersions) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Queue = _Queue_;
      apiHostname = _apiHostname;
      Session = _Session_;
      mockQueues = _mockQueues;
      mockQueueVersions = _mockQueueVersions;

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      
      $controller('QueueController', {'$scope': $scope, '$stateParams' : routeParams});
    }]));
    
    
  describe('ON fetchQueues', function() {
    it('should be defined', function() {
      expect($scope.fetchQueues).toBeDefined();
    });
    
    it('should return queues on call', function() {
      var queues = $scope.fetchQueues();
      
      $httpBackend.flush();
      
      expect(queues[0].id).toEqual(queues[0].id);
      expect(queues[1].id).toEqual(queues[1].id);
    });
  });
  
  it('should initialize a queue on createQueue', function() {
    $scope.$broadcast('table:on:click:create');

    expect($scope.selectedQueue).toBeDefined();
    expect($scope.selectedQueue.tenantId).toEqual(Session.tenant.tenantId);
    expect($scope.initialVersion.query).toEqual('{}');
  });

  it('should create a version if creating a new queue', function () {
    var newQueue = new Queue({
      name: 'q3',
      description: 'super uncool queue',
      tenantId: Session.tenant.tenantId
    });
    
    $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues/queueId3/versions').respond({});
    var result = angular.extend({}, newQueue, {
      activeVersion: 'queueVersion1'
    });
    
    
    $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/queues/queueId3').respond({'result': result});
    
    $scope.initialVersion = $scope.getDefaultVersion();
    $scope.selectedQueue = newQueue;
    $scope.submit();
    
    $httpBackend.flush();
    
    expect(newQueue.activeVersion).toEqual('queueVersion1');
  });
  
  describe('fetchVersions function', function() {
    it('should be defined', function() {
      expect($scope.fetchVersions).toBeDefined();
    });
    
    it('should return versions', function() {
      $scope.selectedQueue = mockQueues[1];
      var versions = $scope.fetchVersions();
      
      $httpBackend.flush();
      
      expect(versions.length).toEqual(2);
    });
    
    it('should return empty array if no selected queue', function() {
      $scope.selectedQueue = null;
      var versions = $scope.fetchVersions();
      expect(versions.length).toEqual(0);
    });
  });
  
  it('should reset the selected version when another item si selected', inject(['QueueVersion', function(QueueVersion) {
    $scope.selectedQueueVersion = new QueueVersion({
      id: 'thing'
    });
    
    $scope.$broadcast('table:resource:selected');
    $scope.$digest();
    expect($scope.selectedQueueVersion).toBeNull();
  }]));
  
  it('should set up a default version when creating a new version', inject(['QueueVersion', 'Session', function(QueueVersion, Session) {
    $scope.selectedQueue = mockQueues[0];
    $scope.$broadcast('create:queue:version');
    $scope.$digest();
    expect($scope.selectedQueueVersion).toBeDefined();
    expect($scope.selectedQueueVersion.query).toEqual('{}');
    expect($scope.selectedQueueVersion.tenantId).toEqual(Session.tenant.tenantId);
    expect($scope.selectedQueueVersion.name).toEqual('v1');
  }]));
  
  it('should copy the version into selectedqueueversion on copy event', inject(['QueueVersion', function(QueueVersion) {
    spyOn($scope, 'fetchVersions').and.returnValue([{}]);
    
    var myQueueVersion = new QueueVersion({
      query: 'query stuff',
      name: 'v1',
      tenantId: 'tenant1',
      queueId: 'queueId1',
      minPriority: 5,
      maxPriority: 90,
      priorityValue: 1,
      priorityRate: 1,
      priorityUnit: 'seconds'
    });
    
    $scope.$broadcast('copy:queue:version', myQueueVersion);
    
    $scope.$digest();
    expect($scope.selectedQueueVersion).toBeDefined();
    expect($scope.selectedQueueVersion.query).toEqual('query stuff');
    expect($scope.selectedQueueVersion.tenantId).toEqual('tenant1');
    expect($scope.selectedQueueVersion.name).toEqual('v2');
    expect($scope.selectedQueueVersion.queueId).toEqual('queueId1');
    expect($scope.selectedQueueVersion.minPriority).toEqual(5);
    expect($scope.selectedQueueVersion.maxPriority).toEqual(90);
    expect($scope.selectedQueueVersion.priorityValue).toEqual(1);
    expect($scope.selectedQueueVersion.priorityRate).toEqual(1);
    expect($scope.selectedQueueVersion.priorityUnit).toEqual('seconds');
  }]));
  
  describe('saveVersion function', function() {
    it('should be defined', function() {
      expect($scope.saveVersion).toBeDefined();
    });
    
    it('should save the selected queueversion', inject(['QueueVersion', function(QueueVersion) {
      $scope.selectedQueueVersion = new QueueVersion({
        queueId: 'queueId1',
        tenantId: 'tenant-id'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues/queueId1/versions').respond(200);
      $scope.saveVersion();
      $httpBackend.flush();
    }]));
  });
});
