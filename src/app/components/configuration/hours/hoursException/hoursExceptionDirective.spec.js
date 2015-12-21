'use strict';

describe('hoursExceptionController', function () {
  var $scope,
    controller,
    $httpBackend,
    apiHostname,
    mockBusinessHours,
    Session,
    loEvents,
    BusinessHour,
    BusinessHourException;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.timezone.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.businessHour.mock'));

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

  beforeEach(inject(['$controller', function ($controller) {
    controller = $controller('hoursController', {
      '$scope': $scope
    });

    $httpBackend.flush();
  }]));
  
  describe('ON submitException', function() {
    xit('should be defined on controller', function() {
      expect(controller.submitException).toBeDefined();
    });
    
    (function() {
      beforeEach(inject(['apiHostname', function(apiHostname) {
        $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId1/exceptions').respond(200);
      }]));
      
      xit('should POST to /v1/tenants/tenant-id/business-hours/businessHourId1/exceptions', function() {
        controller.selectedHour = controller.hours[0];
        controller.exceptionHour = new BusinessHourException();
        controller.submitException();
        
        $httpBackend.flush();
      });
      
      xit('should push exception to controller.selectedHour.$exceptions', function() {
        controller.selectedHour = controller.hours[0];
        controller.exceptionHour = new BusinessHourException();
        controller.submitException();
        
        $httpBackend.flush();
        
        expect(controller.selectedHour.$exceptions.length).toEqual(3);
        expect(controller.exceptionHour).toEqual(null);
      });
    })();
  });
  
  describe('ON removeException', function() {
    xit('should be defined on controller', function() {
      expect(controller.removeException).toBeDefined();
    });
    
    (function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId1/exceptions/businessHourException1').respond(200);
      });
      
      xit('should DELETE /v1/tenants/tenant-id/business-hours/businessHourId1/exceptions/businessHourException1', function() {
        controller.selectedHour = controller.hours[0];
        var exception = controller.selectedHour.$exceptions[0];
        controller.removeException(exception);
        
        $httpBackend.flush();
      });
      
      xit('should remove exception from controller.selectedHour.$exceptions', function() {
        controller.selectedHour = controller.hours[0];
        var exception = controller.selectedHour.$exceptions[0];
        controller.removeException(exception);
        
        $httpBackend.flush();
        
        expect(controller.selectedHour.$exceptions.length).toEqual(1);
      });
    })();
  });
});