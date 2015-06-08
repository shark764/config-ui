'use strict';

/*global spyOn : false */

describe('FlowsController', function() {
    var $scope,
        $controller,
        $httpBackend,
        flows,
        Flow,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Flow', function($rootScope, _$controller_, $injector, _Flow_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Flow = _Flow_;

      flows = [
        new Flow({
          name: 'q1',
          description: 'A pretty good flow',
          id: 'q1'
        }),
        new Flow({
          name: 'q2',
          description: 'Not as cool as the other flow',
          id: 'q2'
        })
      ];

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows').respond({'result' : flows});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/q1').respond({'result' : flows[0]});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/q2').respond({'result' : flows[1]});

      $controller('FlowsController', {'$scope': $scope, 'Session' : {tenantId : 1}, '$routeParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should have flows defined', function() {
        expect($scope.flows).toBeDefined();
        expect($scope.flows[0].id).toEqual(flows[0].id);
        expect($scope.flows[1].id).toEqual(flows[1].id);
    });

    describe('save function', function() {
      describe('create', function() {
        beforeEach(function(){
          $scope.flow = new Flow({});
        });

        it('should create a new flow if scope.flow.id is empty', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/flows');

          $scope.save();
          $httpBackend.flush();
        });

        it('should call savesuccess on create success', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/flows');

          spyOn($scope, 'saveSuccess');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveSuccess).toHaveBeenCalled();
        });

        it('should call savefailure on create error', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows').respond(500, '');
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/flows');

          spyOn($scope, 'saveFailure');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveFailure).toHaveBeenCalled();
        });
      });

      describe('update function', function() {
        beforeEach(function(){
          $scope.flow = flows[0];
          $scope.flow.description = 'a better description';
        });

        it('should update existing flow if scope.flow.id exists', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/1/flows/q1').respond({'result' : {}});
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/1/flows/q1');

          $scope.save();
          $httpBackend.flush();
        });

        it('should call savesuccess on update success', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/1/flows/q1').respond({'result' : {}});
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/1/flows/q1');

          spyOn($scope, 'saveSuccess');
          $scope.save();
          $httpBackend.flush();

          expect($scope.saveSuccess).toHaveBeenCalled();
        });

        it('should call savefailure on update error', function() {
          $httpBackend.when('PUT', 'fakendpoint.com/v1/tenants/1/flows/q1').respond(500, '');
          $httpBackend.expectPUT('fakendpoint.com/v1/tenants/1/flows/q1');

          spyOn($scope, 'saveFailure');
          $scope.save();
          $httpBackend.flush();

          expect($scope.saveFailure).toHaveBeenCalled();
        });
      });
    });
});