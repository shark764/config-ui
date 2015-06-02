'use strict';

describe('QueueController', function() {
    var $scope,
        $controller,
        $httpBackend,
        queues;

    beforeEach(module('liveopsConfigPanel'));
    beforeEach(inject(['$rootScope', '$controller', '$injector', function($rootScope, _$controller_, $injector) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
      queues = [];
      
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants/1/queues').respond({'result' : queues});
      
      $controller('QueueController', {'$scope': $scope, 'Session' : {tenantId : 1}});
      $httpBackend.flush();
    }]));

    it('should have queues defined', function() {
        expect($scope.queues).toBeDefined();
        expect($scope.queues).toEqual(queues);
    });
});