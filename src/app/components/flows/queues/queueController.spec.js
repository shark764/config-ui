'use strict';

describe('QueueController', function() {
  var $scope,
  $httpBackend,
  mockQueues,
  Queue,
  apiHostname,
  Session,
  routeParams,
  mockQueueVersions,
  QueueVersion,
  controller;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.queue.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.queue.version.mock'));
  
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'Queue', 'apiHostname', 'Session', 'mockQueues', 'mockQueueVersions', 'QueueVersion',
    function($rootScope, $controller, $injector, _Queue_, _apiHostname, _Session_, _mockQueues, _mockQueueVersions, _QueueVersion) {
      $scope = $rootScope.$new();
      Queue = _Queue_;
      apiHostname = _apiHostname;
      Session = _Session_;
      mockQueues = _mockQueues;
      mockQueueVersions = _mockQueueVersions;
      QueueVersion = _QueueVersion;

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      
      controller = $controller('QueueController', {'$scope': $scope, '$stateParams' : routeParams});
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
  
  it('should reset the selected version when another item is selected', function() {
    $scope.selectedQueueVersion = new QueueVersion({
      id: 'thing'
    });
    
    $scope.$broadcast('table:resource:selected');
    $scope.$digest();
    expect($scope.selectedQueueVersion).toBeNull();
  });
  
  it('should set up a default version when creating a new version', inject(['Session', function(Session) {
    $scope.selectedQueue = mockQueues[0];
    $scope.$broadcast('create:queue:version');
    $scope.$digest();
    expect($scope.selectedQueueVersion).toBeDefined();
    expect($scope.selectedQueueVersion.query).toEqual('{}');
    expect($scope.selectedQueueVersion.tenantId).toEqual(Session.tenant.tenantId);
    expect($scope.selectedQueueVersion.name).toEqual('v1');
  }]));
  
  it('should copy the version into selectedqueueversion on copy event', function() {
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
  });
  
  describe('saveVersion function', function() {
    it('should be defined', function() {
      expect($scope.saveVersion).toBeDefined();
    });
    
    it('should save the selected queueversion', function() {
      $scope.selectedQueueVersion = new QueueVersion({
        queueId: 'queueId1',
        tenantId: 'tenant-id'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues/queueId1/versions').respond(200);
      $scope.saveVersion();
      $httpBackend.flush();
    });
  });
  
  describe('submit function', function() {
    it('should be defined', function() {
      expect($scope.submit).toBeDefined();
    });
    
    it('should save the selected queue', function() {
      spyOn(controller, 'saveInitialVersion');
      $scope.initialVersion = new QueueVersion();
      
      $scope.selectedQueue = new Queue({
        tenantId: 'tenant-id'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues').respond(200, mockQueues[0]);
      $scope.submit();
      $httpBackend.flush();
    });
  });
  
  describe('saveInitialVersion function', function() {
    it('should be defined', function() {
      expect(controller.saveInitialVersion).toBeDefined();
    });
    
    it('should save the initial queue version from scope', function() {
      spyOn(mockQueues[0], 'save');
      
      $scope.initialVersion = new QueueVersion({
        tenantId: 'tenant-id',
        queueId: 'queue-id'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues/queue-id/versions').respond(200, mockQueueVersions[0]);
      controller.saveInitialVersion(mockQueues[0]);
      $httpBackend.flush();
    });
    
    it('ON save success should update the queue and set the active version', function() {
      $scope.initialVersion = new QueueVersion({
        tenantId: 'tenant-id',
        queueId: 'queueId1'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues/queueId1/versions').respond(200, mockQueueVersions[0]);
      
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/queues/queueId1', {
        activeVersion: mockQueueVersions[0].version,
        name: mockQueues[0].name,
        description: mockQueues[0].description
      }).respond(200, mockQueues[0]);
      
      controller.saveInitialVersion(mockQueues[0]);
      $httpBackend.flush();
    });
    
    it('ON save failure should not update the queue', function() {
      $scope.initialVersion = new QueueVersion({
        tenantId: 'tenant-id',
        queueId: 'queueId1'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues/queueId1/versions').respond(400, {
        error: {
          attribute: {
            
          }
        }
      });
      
      controller.saveInitialVersion(mockQueues[0]);
      $httpBackend.flush();
    });
    
    it('ON save failure should copy the initial queue version', function() {
      $scope.forms = {
          versionForm : {
            query : {
              $setValidity: jasmine.createSpy('setValidity'),
              $setTouched: jasmine.createSpy('setTouched')
            }
          }
      };
      
      $scope.initialVersion = new QueueVersion({
        tenantId: 'tenant-id',
        queueId: 'queueId1',
        query: '12345'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/tenant-id/queues/queueId1/versions').respond(400, {
        error: {
          attribute: {
            query: 'Invalid query'
          }
        }
      });
      
      controller.saveInitialVersion(mockQueues[0]);
      $httpBackend.flush();
      
      expect($scope.selectedQueueVersion.query).toEqual('12345');
    });
  });
});
