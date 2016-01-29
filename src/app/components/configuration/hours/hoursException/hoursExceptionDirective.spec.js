'use strict';

describe('hoursExceptionController', function () {
  var $scope,
    controller,
    element,
    $httpBackend,
    apiHostname,
    mockBusinessHours,
    mockQueriedBusinessHours,
    Session,
    loEvents,
    BusinessHour,
    BusinessHourException;

  beforeEach(module('gulpAngular', 'liveopsConfigPanel', 'liveopsConfigPanel.timezone.mock', 
      'liveopsConfigPanel.tenant.businessHour.mock', 'liveopsConfigPanel.mockutils'));

  beforeEach(inject(['$rootScope', '$httpBackend', 'apiHostname', 'Session', 'mockBusinessHours', 'loEvents', 'BusinessHour', 'BusinessHourException',
    function ($rootScope, _$httpBackend, _apiHostname_, _Session_, _mockBusinessHours_, _loEvents_, _BusinessHour_, _BusinessHourException_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      Session = _Session_;
      apiHostname = _apiHostname_;
      mockBusinessHours = _mockBusinessHours_;
      BusinessHour = _BusinessHour_;
      BusinessHourException = _BusinessHourException_;

      loEvents = _loEvents_;
    }
  ]));

  beforeEach(inject(['$compile', '$rootScope', '$controller', 'mockForm', function ($compile, $rootScope, $controller, mockForm) {
    mockQueriedBusinessHours = BusinessHour.query({
      tenantId: 'tenant-id'
    });

    $httpBackend.flush();

    $scope.hours = mockQueriedBusinessHours[0];
    $scope.form = mockForm();

    element = $compile('<hours-exceptions></hours-exceptions>')($scope);
    controller = $controller('hoursExceptionController', {
      '$scope': $scope
    });
  }]));

  describe('ON addHoursException', function() {
    it('shoud be defined on controller', function() {
      expect(controller.addHoursException).toBeDefined();
    });

    it('should add an additional BusinessHourException to hours.$exceptions', function() {
      expect($scope.hours.$exceptions.length).toEqual(2);

      controller.addHoursException();

      expect($scope.hours.$exceptions.length).toEqual(3);
    });

    it('should create hours.$exceptions array if undefined', function() {
      delete $scope.hours.$exceptions;

      controller.addHoursException();

      expect($scope.hours.$exceptions.length).toEqual(1);
    });

    it('should set isAllDay to true', function() {
      delete $scope.hours.$exceptions;

      controller.addHoursException();

      expect($scope.hours.$exceptions[0].isAllDay).toBeTruthy();
    });

    it('should call $setDirty', function() {
      controller.addHoursException();

      expect($scope.form.$setDirty).toHaveBeenCalled();
    });
  });

  describe('ON removeException', function() {
    it('should be defined on controller', function() {
      expect(controller.removeException).toBeDefined();
    });

    (function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId1/exceptions/businessHourException1').respond(200);
      });

      it('should DELETE /v1/tenants/tenant-id/business-hours/businessHourId1/exceptions/businessHourException1', function() {
        controller.removeException(0);

        $httpBackend.flush();
      });

      it('should remove exception from controller.selectedHour.$exceptions', function() {
        controller.removeException(0);

        $httpBackend.flush();

        expect($scope.hours.$exceptions.length).toEqual(1);
      });
    })();
  });
});
