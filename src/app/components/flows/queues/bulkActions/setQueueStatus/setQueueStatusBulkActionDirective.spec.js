'use strict';

describe('setQueueStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();
    element = $compile('<ba-set-queue-status bulk-action="bulkAction"></ba-set-queue-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set queue.status on bulkAction.execute', inject(['$httpBackend', 'apiHostname',
    function($httpBackend, apiHostname) {
    
      var mockQueue = {
        id: 'id1',
      };
      var returnQueue = angular.copy(mockQueue);
      returnQueue.status = true;

      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/queues/id1').respond(200, {
        result: returnQueue
      });

      isolateScope.status = true;
      isolateScope.bulkAction.apply(mockQueue);

      expect(mockQueue.status).toBeFalsy();

      $httpBackend.flush();

      expect(mockQueue.status).toEqual(true);
    }
  ]));
  
  it('should should only have the attribute in the PUT payload',
    inject(['$httpBackend', 'apiHostname',
      function ($httpBackend, apiHostname) {
        var mockQueue = {
            id: 'id1'
          };
        $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/queues/id1', {
          status: true
        }).respond(200);

        isolateScope.status = true;
        isolateScope.bulkAction.apply(mockQueue);

        $httpBackend.flush();
      }
    ]));
});
