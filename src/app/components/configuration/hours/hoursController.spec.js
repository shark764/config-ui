'use strict';


describe('hoursController', function() {
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

  beforeEach(inject(['$rootScope', '$httpBackend', 'apiHostname', 'Session', 'mockBusinessHours', 'loEvents', 'BusinessHour', 'BusinessHourException', '$controller',
    function($rootScope, _$httpBackend, _apiHostname, _Session, _mockBusinessHours, _loEvents, _BusinessHour, _BusinessHourException, $controller) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      Session = _Session;
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
  });

  describe('saveError function', function() {
    beforeEach(function(){
      controller.forms = {
        detailsForm: {
          $setPristine: jasmine.createSpy('$setPristine'),
          $dirty: false,
          loFormResetController: {
            resetErrors: jasmine.createSpy('resetErrors')
          }
        }
      };
    });

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

    it('should return false if some times are null and some are -1', function() {
      controller.selectedHour = mockBusinessHours[0];
      mockBusinessHours[0].sunStartTimeMinutes = -1;
      mockBusinessHours[0].sunEndTimeMinutes = -1;

      var result = controller.hasHours();
      expect(result).toBeFalsy();
    });

    it('should return true if some times are -1 but others are defined', function() {
      controller.selectedHour = mockBusinessHours[0];
      mockBusinessHours[0].sunStartTimeMinutes = -1;
      mockBusinessHours[0].sunEndTimeMinutes = -1;

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

    it('should set all times to -1 on isCustom false', function() {
      controller.onIsHoursCustomChanged(false);
      var expected = -1;

      angular.forEach(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], function(day) {
        expect(controller.selectedHour[day + 'StartTimeMinutes']).toEqual(expected);
        expect(controller.selectedHour[day + 'EndTimeMinutes']).toEqual(expected);
      });
    });

    it('should set all times to -1 on isCustom false', function() {
      controller.onIsHoursCustomChanged(true);
      var expected = -1;

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
});
