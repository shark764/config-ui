'use strict';

/*global spyOn : false */

describe('VersionsController', function() {
    var $scope,
        $controller,
        $httpBackend,
        versions,
        Version,
        routeParams;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', 'Version', function($rootScope, _$controller_, $injector, _Version_) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      Version = _Version_;

      versions = [
        new Version({
          name: 'q1',
          description: 'A pretty good version',
          id: 'q1'
        }),
        new Version({
          name: 'q2',
          description: 'Not as cool as the other version',
          id: 'q2'
        })
      ];

      routeParams = {id : 'q1'};

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/1/versions').respond({'result' : versions});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/1/versions/q1').respond({'result' : versions[0]});
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/flows/1/versions/q2').respond({'result' : versions[1]});

      routeParams.flowId = 1;

      $controller('VersionsController', {'$scope': $scope, 'Session' : {tenantId : 1}, '$routeParams' : routeParams});
      $httpBackend.flush();
    }]));

    it('should have versions defined', function() {
        expect($scope.versions).toBeDefined();
        expect($scope.versions[0].id).toEqual(versions[0].id);
        expect($scope.versions[1].id).toEqual(versions[1].id);
    });

    describe('save function', function() {
      describe('create', function() {
        beforeEach(function(){
          $scope.version = new Version({});
        });

        it('should create a new version if scope.version.id is empty', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows/1/versions').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/flows/1/versions');

          $scope.save();
          $httpBackend.flush();
        });

        it('should call savesuccess on create success', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows/1/versions').respond({'result' : {}});
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/flows/1/versions');

          spyOn($scope, 'saveSuccess');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveSuccess).toHaveBeenCalled();
        });

        it('should call savefailure on create error', function() {
          $httpBackend.when('POST', 'fakendpoint.com/v1/tenants/1/flows/1/versions').respond(500, '');
          $httpBackend.expectPOST('fakendpoint.com/v1/tenants/1/flows/1/versions');

          spyOn($scope, 'saveFailure');
          $scope.save();
          $httpBackend.flush();
          expect($scope.saveFailure).toHaveBeenCalled();
        });
      });
    });
});