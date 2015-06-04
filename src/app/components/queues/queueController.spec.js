'use strict';

/*global spyOn : false */

describe('QueueController', function() {
    var $scope,
        $controller,
        $httpBackend,
        queues,
        Queue,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Queue', function($rootScope, _$controller_, $injector, _Queue_) {
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

      $controller('QueueController', {'$scope': $scope, 'Session' : {tenantId : 1}, '$routeParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should have queues defined', function() {
        expect($scope.queues).toBeDefined();
        expect($scope.queues[0].id).toEqual(queues[0].id);
        expect($scope.queues[1].id).toEqual(queues[1].id);
    });

    it('should load the queue that\'s defined routeParam on init', function() {
      expect($scope.queue).toBeDefined();
      expect($scope.queue.id).toEqual(queues[0].id);
    });

    it('should catch when routeParam changes', function() {
      spyOn($scope, 'setQueue').and.callThrough();
      routeParams.id = 'q2';
      $scope.$broadcast('$routeUpdate');
      $scope.$digest();
      $httpBackend.flush();

      expect($scope.setQueue).toHaveBeenCalledWith('q2');
    });

    describe('setQueue function', function(){
      it('should blank the queue when called with nothing', function() {
        $scope.setQueue();
        expect($scope.queue).toEqual(new Queue({}));
      });

      it('should fetch a queue via the QueueService when called with an id', function() {
        $httpBackend.expectGET('fakendpoint.com/v1/tenants/1/queues/q2');
        $scope.setQueue('q2');
        $httpBackend.flush();
        expect($scope.queue.id).toEqual(queues[1].id);
      });
    });

    describe('save function', function() {
      describe('create', function() {
        beforeEach(function(){
          $scope.queue = new Queue({});
        });

        it('should create a new queue if scope.queue.id is empty', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/queues').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/queues');

          $scope.save();
          $httpBackend.flush();
        });

        it('should call savesuccess on create success', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/queues').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/queues');

          spyOn($scope, 'saveSuccess');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveSuccess).toHaveBeenCalled();
        });

        it('should call savefailure on create error', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/queues').respond(500, '');
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/queues');

          spyOn($scope, 'saveFailure');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveFailure).toHaveBeenCalled();
        });
      });

      describe('update function', function() {
        beforeEach(function(){
          $scope.queue = queues[0];
          $scope.queue.description = 'a better description';
        });

        it('should update existing queue if scope.queue.id exists', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/1/queues/q1').respond({'result' : {}});
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/1/queues/q1');

          $scope.save();
          $httpBackend.flush();
        });

        it('should call savesuccess on update success', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/1/queues/q1').respond({'result' : {}});
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/1/queues/q1');

          spyOn($scope, 'saveSuccess');
          $scope.save();
          $httpBackend.flush();

          expect($scope.saveSuccess).toHaveBeenCalled();
        });

        it('should call savefailure on update error', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/1/queues/q1').respond(500, '');
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/1/queues/q1');

          spyOn($scope, 'saveFailure');
          $scope.save();
          $httpBackend.flush();

          expect($scope.saveFailure).toHaveBeenCalled();
        });
      });
    });
});