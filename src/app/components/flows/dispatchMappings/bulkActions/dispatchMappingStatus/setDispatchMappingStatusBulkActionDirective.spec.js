'use strict';

describe('setDispatchMappingStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.configuration.dispatchMappings.dispatchMappingsController'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    $scope.bulkAction = new BulkAction();

    element = $compile('<ba-set-dispatch-mapping-status bulk-action="bulkAction"></ba-set-dispatch-mapping-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set dispatchMapping.status on bulkAction.execute', inject(['mockDispatchMappings', '$httpBackend', 'apiHostname',
    function(mockDispatchMappings, $httpBackend, apiHostname) {
      var returnMapping = angular.copy(mockDispatchMappings[0]);
      returnMapping.active = true;

      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/dispatchMappingId1').respond(200, {
        result: returnMapping
      });
      
      expect(mockDispatchMappings[0].active).toBeFalsy();
      isolateScope.active = true;
      isolateScope.bulkAction.apply(mockDispatchMappings[0]);

      $httpBackend.flush();

      expect(mockDispatchMappings[0].active).toEqual(true);
    }
  ]));
  
  it('should only have the attribute in the PUT payload',
    inject(['mockDispatchMappings', '$httpBackend', 'apiHostname', function (mockDispatchMappings, $httpBackend, apiHostname) {
        $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/dispatch-mappings/dispatchMappingId1', {
          active: true
        }).respond(200);

        isolateScope.active = true;
        isolateScope.bulkAction.apply(mockDispatchMappings[0]);

        $httpBackend.flush();
      }
    ]));
});
