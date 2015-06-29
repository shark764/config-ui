'use strict';

/*global jasmine, spyOn:false */

describe('FlowManagementController', function() {
    var $scope,
        $controller,
        $httpBackend,
        flows,
        flows2,
        Flow,
        apiHostname,
        Session,
        regions,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(module('gulpAngular'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Flow', 'Session', 'apiHostname',
      function($rootScope, _$controller_, $injector, _Flow_, _Session_, _apiHostname_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Session = _Session_;
      apiHostname = _apiHostname_;
      Flow = _Flow_;
      Session.tenant = {
        tenantId: 1
      };

      regions = [
        {
          id: 1
        }
      ];

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

      flows2 = [
        new Flow({
          name: 'q3',
          description: 'Das flow',
          id: 'q3'
        })
      ];

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', apiHostname + '/v1/tenants/1/flows').respond({'result' : flows});
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : regions});
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
        'tenants': []
      }});

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});


      $controller('ContentController', {'$scope': $scope});
      $controller('FlowManagementController', {'$scope': $scope, '$stateParams' : routeParams, 'Session' : Session});
      $httpBackend.flush();
    }]));

    it('should have flows defined', function() {
        expect($scope.flows).toBeDefined();
        expect($scope.flows[0].id).toEqual(flows[0].id);
        expect($scope.flows[1].id).toEqual(flows[1].id);
    });

    it('should have a function to create a new flow and set it as selected', function() {
        $scope.$broadcast('on:click:create');
        expect($scope.selectedFlow).toBeDefined();
        expect($scope.selectedFlow.tenantId).toBe(Session.tenant.tenantId);
    });

    describe('updateActiveVersionName function', function(){
      it('should be defined', function() {
        expect($scope.updateVersionName).toBeDefined();
        expect($scope.updateVersionName).toEqual(jasmine.any(Function));
      });

      it('should fetch only the active version', function() {
        var newFlow = new Flow({
          activeVersion : '1',
          id: '1'
        });

        $httpBackend.when('GET', apiHostname + '/v1/tenants/1/flows/1/versions/1').respond({'result' : {}});
        $httpBackend.expectGET(apiHostname + '/v1/tenants/1/flows/1/versions/1');
        $scope.updateVersionName(newFlow);
        $httpBackend.flush();
      });

      it('should set the activeVersionName property on the flow', function() {
        var newFlow = new Flow({
          activeVersion : '1',
          id: '1'
        });

        $httpBackend.when('GET', apiHostname + '/v1/tenants/1/flows/1/versions/1').respond({'result' : {name : 'a name'}});
        $scope.updateVersionName(newFlow);
        $httpBackend.flush();

        expect(newFlow.activeVersionName).toEqual('a name');
      });
    });

    describe('postSave function', function(){
      it('should be defined', function() {
        expect($scope.additional.postSave).toBeDefined();
        expect($scope.additional.postSave).toEqual(jasmine.any(Function));
      });

      it('should call updateVersionName', function() {
        spyOn($scope, 'updateVersionName');
        $scope.additional.postSave({originalResource : {info : 'info', id: 3}});
        expect($scope.updateVersionName).toHaveBeenCalledWith({info : 'info', id: 3});
      });

      it('should create a version if creating a new flow', function() {
        spyOn($scope, 'updateVersionName');
        var newFlow = new Flow({id: 3, save: function(){}});
        $httpBackend.when('POST', apiHostname + '/v1/tenants/1/flows/3/versions').respond({'result' : {version: 'fv1'}});
        $httpBackend.expectPOST(apiHostname + '/v1/tenants/1/flows/3/versions');
        $scope.additional.postSave({originalResource : {}, resource : newFlow}, newFlow, true);
        $httpBackend.flush();

        expect(newFlow.activeVersion).toEqual('fv1');
      });
    });

    describe('fetch function', function(){
      it('should get data', function() {
        Session.tenant.tenantId = 2;

        $httpBackend.when('GET', apiHostname + '/v1/tenants/2/flows').respond({'result' : flows2});
        $scope.fetch();
        $httpBackend.flush();

        expect($scope.flows).toBeDefined();
        expect($scope.flows[0].id).toEqual(flows2[0].id);
      });

      it('should call updateVersionName if the flows have an activeVersion', function() {
        var newFlows = [new Flow({id: 'f1', activeVersion: '123'})];
        Session.tenant.tenantId = 2;

        spyOn($scope, 'updateVersionName');
        $httpBackend.when('GET', apiHostname + '/v1/tenants/2/flows').respond({'result' : newFlows});
        $scope.fetch();
        $httpBackend.flush();

        expect($scope.updateVersionName).toHaveBeenCalled();
      });

      it('should not call updateVersionName if the flow does not have an activeVersion', function() {
        spyOn($scope, 'updateVersionName');
        $scope.fetch();
        $httpBackend.flush();

        expect($scope.updateVersionName).not.toHaveBeenCalled();
      });
    });
});
