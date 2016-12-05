'use strict';


describe('hoursController', function() {
  var $scope,
    controller,
    $httpBackend,
    apiHostname,
    mockBusinessHours,
    Session,
    Tenant,
    Region,
    loEvents,
    BusinessHour,
    BusinessHourException;

  beforeEach(module('gulpAngular', 'liveopsConfigPanel', 'liveopsConfigPanel.timezone.mock',
      'liveopsConfigPanel.tenant.businessHour.mock', 'liveopsConfigPanel.mockutils'));

  beforeEach(inject(['$rootScope', '$httpBackend', 'apiHostname', 'Session', 'Tenant','Region','mockBusinessHours', 'loEvents', 'BusinessHour', 'BusinessHourException', '$controller',
    function($rootScope, _$httpBackend, _apiHostname, _Session, _Tenant,_Region,_mockBusinessHours, _loEvents, _BusinessHour, _BusinessHourException, $controller) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      Session = _Session;
      Tenant = _Tenant;
      Region = _Region;
      apiHostname = _apiHostname;
      mockBusinessHours = _mockBusinessHours;
      BusinessHour = _BusinessHour;
      BusinessHourException = _BusinessHourException;
      loEvents = _loEvents;

      controller = $controller('hoursController', {
        '$scope': $scope
      });

      $httpBackend.flush();
    }
  ]));

  it('should call reset when selectedHour changes', function() {
    spyOn(controller, 'reset');
    $scope.$apply('hc.selectedHour = {id: \'1234\'}');
    expect(controller.reset).toHaveBeenCalled();
  });

  it('should initialize a new selectedHour on table create event', inject(function($rootScope, loEvents) {
    controller.exceptionHour = {};
    controller.selectedHour = {
      id: 'existing',
      active: false,
      timezone: 'anotherZone'
    };

    $rootScope.$broadcast(loEvents.tableControls.itemCreate);
    $scope.$digest();
    $httpBackend.flush();
    $httpBackend.expect('GET', apiHostname + '/v1/tenants/tenant-id').respond(200);

    expect(controller.selectedHour.id).toBeFalsy();
    expect(controller.selectedHour.active).toBeTruthy();
    expect(controller.selectedHour.timezone).toEqual('someTimeZone');
    expect(controller.exceptionHour).toBeNull();


  }));

  describe('ON loadTimezones', function() {
    it('should initialize controller.timezones', function() {
      expect(controller.timezones).toBeDefined();
      expect(controller.timezones.length).toEqual(16);
    });
  });

  describe('ON loadHours', function() {
    it('should initialize controller.hours', function() {
      expect(controller.hours).toBeDefined();
      expect(controller.hours.length).toEqual(2);
    });
  });

  describe('ON reset', function() {
    it('should reset', function() {
      spyOn(controller, 'hasHours').and.returnValue(true);

      controller.reset();
      expect(controller.isHoursCustom).toBeTruthy();
      expect(controller.exceptionHour).toBeNull();
    });
  });

  describe('ON submit', function() {
    it('should be defined on controller', function() {
      expect(controller.submit).toBeDefined();
    });

    it('should POST to /v1/tenants/tenant-id/business-hours', function() {
      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours').respond(200);

      controller.selectedHour = new BusinessHour();
      controller.submit();

      $httpBackend.flush();
    });

    it('should save new exceptions on success', function() {
      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours').respond(200, {
        result: {
          id: '1234',
          $exceptions: [new BusinessHourException()]
        }
      });

      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours/1234/exceptions').respond(200);

      controller.selectedHour = new BusinessHour();
      controller.submit();

      $httpBackend.flush();
    });

    it('should do nothing on success if the exceptions are not new', function() {
      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours').respond(200, {
        result: {
          id: '1234',
          $exceptions: [new BusinessHourException({id: '4333'})]
        }
      });

      controller.selectedHour = new BusinessHour();
      controller.submit();

      $httpBackend.flush();
    });

    it('should set the form error if saving an exception fails', inject(function(mockForm, mockModel) {
      controller.forms = {};
      controller.forms.detailsForm = mockForm();
      controller.forms.detailsForm.startTimeMinutes0 = mockModel();

      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours').respond(200, {
        result: {
          id: '1234',
          $exceptions: [new BusinessHourException()]
        }
      });

      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours/1234/exceptions').respond(500, {
        error: {
          attribute: {
            startTimeMinutes: 'Invalid exception'
          }
        }
      });

      controller.selectedHour = new BusinessHour();
      controller.submit();

      $httpBackend.flush();
      expect(controller.forms.detailsForm.startTimeMinutes0.$setValidity).toHaveBeenCalled();
    }));
  });

  describe('saveError function', function() {
    beforeEach(inject(function(mockForm){
      controller.forms = {};
      controller.forms.detailsForm = mockForm();
      controller.forms.detailsForm.loFormResetController = {
          resetErrors: jasmine.createSpy('resetErrors')
      };
    }));

    it('should return a rejected promise', function(done) {
      controller.saveError('error').catch(function(){
        done();
      });

      $scope.$digest();
    });

    it('should remove all errors when the form becomes dirty', function() {
      controller.saveError('error');

      $scope.$apply('hc.forms.detailsForm.$dirty = true');
      expect(controller.forms.detailsForm.loFormResetController.resetErrors).toHaveBeenCalled();
    });

    it('should remove the watch after it is triggered once', function() {
      controller.saveError('error');

      $scope.$apply('hc.forms.detailsForm.$dirty = true');
      expect(controller.forms.detailsForm.loFormResetController.resetErrors).toHaveBeenCalled();

      $scope.$apply('hc.forms.detailsForm.$dirty = false');
      controller.forms.detailsForm.loFormResetController.resetErrors.calls.reset(); //Reset the spy

      $scope.$apply('hc.forms.detailsForm.$dirty = true');
      expect(controller.forms.detailsForm.loFormResetController.resetErrors).not.toHaveBeenCalled();
    });
  });

  describe('ON hasHours', function() {
    it('should be defined on controller', function() {
      expect(controller.hasHours).toBeDefined();
    });

    it('should return false if there is no selected hour', function() {
      controller.selectedHour = null;
      var result = controller.hasHours();
      expect(result).toBeFalsy();
    });

    it('should return false if all times are null', function() {
      controller.selectedHour = mockBusinessHours[0];
      var result = controller.hasHours();
      expect(result).toBeFalsy();
    });

    it('should return true if some times are >= 0', function() {
      controller.selectedHour = mockBusinessHours[1];
      var result = controller.hasHours();
      expect(result).toBeTruthy();
    });

    it('should return false if some times are null and some are 0', function() {
      controller.selectedHour = mockBusinessHours[0];
      mockBusinessHours[0].sunStartTimeMinutes = 0;
      mockBusinessHours[0].sunEndTimeMinutes = 0;

      var result = controller.hasHours();
      expect(result).toBeFalsy();
    });

    it('should return true if some times are 0 but others are defined', function() {
      controller.selectedHour = mockBusinessHours[0];
      mockBusinessHours[0].sunStartTimeMinutes = 0;
      mockBusinessHours[0].sunEndTimeMinutes = 0;

      mockBusinessHours[0].monStartTimeMinutes = 0;
      mockBusinessHours[0].monEndTimeMinutes = 60;

      var result = controller.hasHours();
      expect(result).toBeTruthy();
    });
  });

  describe('ON onIsHoursCustomChanged', function() {
    beforeEach(function() {
      controller.selectedHour = controller.hours[0];
    });

    it('should be defined on controller', function() {
      expect(controller.onIsHoursCustomChanged).toBeDefined();
    });

    it('should do nothing if isHoursCustom is true', function() {
      angular.forEach(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], function(day) {
        controller.selectedHour[day + 'StartTimeMinutes'] = 10;
        controller.selectedHour[day + 'EndTimeMinutes'] = 11;
      });

      controller.isHoursCustom = true;
      controller.onIsHoursCustomChanged();

      angular.forEach(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], function(day) {
        expect(controller.selectedHour[day + 'StartTimeMinutes']).toEqual(10);
        expect(controller.selectedHour[day + 'EndTimeMinutes']).toEqual(11);
      });
    });

    it('should set all times to 0 on isCustom false', function() {
      controller.onIsHoursCustomChanged(false);
      var expected = 0;

      angular.forEach(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], function(day) {
        expect(controller.selectedHour[day + 'StartTimeMinutes']).toEqual(expected);
        expect(controller.selectedHour[day + 'EndTimeMinutes']).toEqual(expected);
      });
    });

    it('should set all times to 0 on isCustom false', function() {
      controller.onIsHoursCustomChanged(true);
      var expected = 0;

      for (var day in ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']) {
        expect(controller.selectedHour[day + 'StartTimeMinutes']).not.toEqual(expected);
        expect(controller.selectedHour[day + 'EndTimeMinutes']).not.toEqual(expected);
      }
    });
  });

  describe('ON generateHoursMessage', function() {
    it('should be defined on controller', function() {
      expect(controller.generateHoursMessage).toBeDefined();
    });

    it('should return hours.monday for value = monday', function() {
      var result = controller.generateHoursMessage('monday');
      expect(result).toEqual({
        day: 'hours.monday'
      });
    });
  });

  describe('ON updateActive', function() {
    it('should save the business hour', function() {
      controller.selectedHour = new BusinessHour({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      controller.selectedHour.$original = controller.selectedHour;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/business-hours/1234').respond(200);
      controller.updateActive();

      $httpBackend.flush();
    });

    it('should toggle the active property to true when it is false', function() {
      controller.selectedHour = new BusinessHour({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });
      controller.selectedHour.$original = controller.selectedHour;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/business-hours/1234', {
        active: true
      }).respond(200);
      controller.updateActive();

      $httpBackend.flush();
    });

    it('should toggle the active property to false when it is true', function() {
      controller.selectedHour = new BusinessHour({
        tenantId: 'myTenant',
        active: true,
        id: '1234'
      });
      controller.selectedHour.$original = controller.selectedHour;

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/business-hours/1234', {
        active: false
      }).respond(200);
      controller.updateActive();

      $httpBackend.flush();
    });

    it('should update only the active status', function() {
      controller.selectedHour = new BusinessHour({
        tenantId: 'myTenant',
        active: false,
        id: '1234',
        anotherProperty: 'somevalue'
      });

      controller.selectedHour.$original = controller.selectedHour;
      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/business-hours/1234', {
        active: true
      }).respond(200);
      controller.updateActive();

      $httpBackend.flush();
    });

    it('should update the $original value on success', function() {
      controller.selectedHour = new BusinessHour({
        tenantId: 'myTenant',
        active: false,
        id: '1234'
      });

      controller.selectedHour.$original = angular.copy(controller.selectedHour);
      expect(controller.selectedHour.$original.active).toBeFalsy();

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/myTenant/business-hours/1234').respond(200, {
        result: {
          tenantId: 'myTenant',
          active: true,
          id: '1234'
        }
      });

      controller.updateActive();

      $httpBackend.flush();

      expect(controller.selectedHour.$original.active).toBeTruthy();
    });
  });
});
