'use strict';

describe('QueueController', function() {
    var $scope,
        $controller,
        $httpBackend,
        queues,
        Queue,
        regions,
        Session,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Queue', 'apiHostname', 'Session',
      function($rootScope, _$controller_, $injector, _Queue_, apiHostname, _Session_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Queue = _Queue_;
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
});
