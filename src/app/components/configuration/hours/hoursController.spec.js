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
