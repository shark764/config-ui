'use strict';

/*global spyOn : false */

describe('MediaController', function() {
    var $scope,
        $controller,
        $httpBackend,
        queues,
        Queue,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', '_Queue_', function($rootScope, _$controller_, $injector, _Queue_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Queue = _Queue_;

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

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/queues').respond({'result' : queues});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/queues/q1').respond({'result' : queues[0]});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/queues/q2').respond({'result' : queues[1]});

      $controller('QueueController', {'$scope': $scope, 'Session' : {tenant : {id : 1}}, '$routeParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should have queues defined', function() {
        expect($scope.queues).toBeDefined();
        expect($scope.queues[0].id).toEqual(queues[0].id);
        expect($scope.queues[1].id).toEqual(queues[1].id);
    });

    xit('should load the queue that\'s defined routeParam on init', function() {
      expect($scope.queue).toBeDefined();
      expect($scope.queue.id).toEqual(queues[0].id);
    });

    xit('should catch when routeParam changes', function() {
      spyOn($scope, 'setQueue').and.callThrough();
      routeParams.id = 'q2';
      $scope.$broadcast('$routeUpdate');
      $scope.$digest();
      $httpBackend.flush();

      expect($scope.setQueue).toHaveBeenCalledWith('q2');
    });
});