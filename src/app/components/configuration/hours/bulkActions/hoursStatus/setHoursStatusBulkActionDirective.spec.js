'use strict';

describe('setHoursStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile, _$rootScope, _BulkAction) {
      $scope = _$rootScope.$new();
      $compile = _$compile;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    element = $compile('<ba-set-hours-status bulk-action="bulkAction"></ba-set-hours-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set hours.active on bulkAction.execute', inject(function($httpBackend, apiHostname) {
      var mockHours = {
        id: 'hours1'
      };

      var returnHours = angular.copy(mockHours);
      returnHours.active = true;

      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/business-hours/hours1').respond(200, {
        result: returnHours
      });

      expect(mockHours.active).toBeFalsy();
      isolateScope.active = true;
      isolateScope.bulkAction.apply(mockHours);

      $httpBackend.flush();

      expect(mockHours.active).toEqual(true);
    }
  ));

  it('should should only have the attribute in the PUT payload', inject(function($httpBackend, apiHostname) {
      $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/business-hours/hours1', {
        active: true
      }).respond(200);

      var mockHours = {
        id: 'hours1'
      };

      isolateScope.active = true;
      isolateScope.bulkAction.apply(mockHours);

      $httpBackend.flush();
    }));
});
