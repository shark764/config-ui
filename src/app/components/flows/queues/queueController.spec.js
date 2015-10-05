'use strict';

describe('QueueController', function() {
  var $scope,
  $controller,
  $httpBackend,
  mockQueues,
  Queue,
  apiHostname,
  Session,
  routeParams;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.queues'));
  
  beforeEach(inject(['$rootScope', '$controller', '$injector', 'Queue', 'apiHostname', 'Session', 'mockQueues',
    function($rootScope, _$controller_, $injector, _Queue_, _apiHostname, _Session_, _mockQueues) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Queue = _Queue_;
      apiHostname = _apiHostname;
      Session = _Session_;
      mockQueues = _mockQueues;

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
    
  it('should reset the query on create cancel', inject(['$rootScope', function($rootScope){
    $scope.selectedQueue = new Queue();
    $scope.initialVersion = {query: 'somevalues'};
    $rootScope.$broadcast('resource:details:queue:canceled');
    expect($scope.initialVersion.query).toEqual('{}');
  }]));

  it('should not reset if the selectedQueue is not a new queue', inject(['$rootScope', function($rootScope){
    $scope.selectedQueue = mockQueues[0];
    $scope.initialVersion = {query: 'somevalues'};
    $rootScope.$broadcast('resource:details:queue:canceled');
    expect($scope.initialVersion.query).toEqual('somevalues');
  }]));
});
