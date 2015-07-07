'use strict';

describe('QueueController', function() {
  var $scope,
  $controller,
  $httpBackend,
  queues,
  Queue,
  regions,
  apiHostname,
  Session,
  routeParams;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$controller', '$injector', 'Queue', 'apiHostname', 'Session',
    function($rootScope, _$controller_, $injector, _Queue_, _apiHostname, _Session_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Queue = _Queue_;
      apiHostname = _apiHostname;
      Session = _Session_;

      regions = [{
        id : 1
      }];

      queues = [
      new Queue({
        name: 'q1',
        description: 'A pretty good queue',
        id: 'q1'
      }),
      new Queue({
        name: 'q2',
        description: 'Not as cool as the other queue',
        id: 'q2'
      })
      ];

      Session.tenant = { tenantId : 1 };

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : regions});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/queues').respond({'result' : queues});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/queues/q1').respond({'result' : queues[0]});
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/queues/q2').respond({'result' : queues[1]});


      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
        'tenants': []
      }});

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});

      $controller('ContentController', {'$scope': $scope});
      $controller('QueueController', {'$scope': $scope, '$stateParams' : routeParams});
      $httpBackend.flush();
    }]));

  it('should have queues defined', function() {
    expect($scope.queues).toBeDefined();
    expect($scope.queues[0].id).toEqual(queues[0].id);
    expect($scope.queues[1].id).toEqual(queues[1].id);
  });

  it('should initialize a queue on createQueue', function() {
    $scope.$broadcast('on:click:create');

    expect($scope.selectedQueue).toBeDefined();
    expect($scope.selectedQueue.tenantId).toEqual(Session.tenant.tenantId);
    expect($scope.additional.initialQuery).toEqual('');
  });

    it('should create a version if creating a new queue', function () {
      var newQueue = new Queue({
        name: 'q3',
        description: 'super uncool queue',
        id: 'q3'
      });
      
      $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/queues/q3/versions').respond({});
      var result = angular.extend({}, newQueue, {
        activeVersion: 'queueVersion1'
      });
      
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/queues/q3').respond({'result': result});
      
      newQueue.postCreate(newQueue);
      
      $httpBackend.flush();
      
      expect(newQueue.activeVersion).toEqual('queueVersion1');
    });
});
