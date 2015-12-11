'use strict';

describe('HoursController', function () {
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
    controller = $controller('HoursController', {
      '$scope': $scope
    });

    $httpBackend.flush();
  }]));

  describe('ON loadTimezones', function () {
    it('should initialize $scope.timezones', function () {
      expect($scope.timezones).toBeDefined();
      expect($scope.timezones.length).toEqual(16);
    });
  });

  describe('ON loadHours', function () {
    it('should initialize $scope.hours', function () {
      expect($scope.hours).toBeDefined();
      expect($scope.hours.length).toEqual(2);
    });
  });

  describe('ON submit', function () {
    it('should be defined on $scope', function() {
      expect($scope.submit).toBeDefined();
    });
    
    it('should POST to /v1/tenants/tenant-id/business-hours', inject(['apiHostname', function(apiHostname) {
      $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours').respond(200);
      
      $scope.selectedHour = new BusinessHour();
      $scope.submit();
      
      $httpBackend.flush();
    }]));
  });
  
  describe('ON hasHours', function() {
    it('should be defined on $scope', function() {
      expect($scope.hasHours).toBeDefined();
    });
    
    it('should return false if all times are null', function() {
      $scope.selectedHour = mockBusinessHours[0];
      var result = $scope.hasHours();
      expect(result).toBeFalsy();
    });
    
    it('should return true if some times are >= 0', function() {
      $scope.selectedHour = mockBusinessHours[1];
      var result = $scope.hasHours();
      expect(result).toBeTruthy();
    });
    
    it('should return false if some times are null and some are -1', function() {
      $scope.selectedHour = mockBusinessHours[0];
      mockBusinessHours[0].sunStartTimeMinutes = -1;
      mockBusinessHours[0].sunEndTimeMinutes = -1;
      
      var result = $scope.hasHours();
      expect(result).toBeFalsy();
    });
    
    it('should return true if some times are -1 but others are defined', function() {
      $scope.selectedHour = mockBusinessHours[0];
      mockBusinessHours[0].sunStartTimeMinutes = -1;
      mockBusinessHours[0].sunEndTimeMinutes = -1;
      
      mockBusinessHours[0].monStartTimeMinutes = 0;
      mockBusinessHours[0].monEndTimeMinutes = 60;
      
      var result = $scope.hasHours();
      expect(result).toBeTruthy();
    });
  });
  
  
  describe('ON showCreateException', function() {
    it('should be defined on $scope', function() {
      expect($scope.showCreateException).toBeDefined();
    });
    
    it('should define exceptionHour on call', function() {
      $scope.showCreateException();
      
      expect($scope.exceptionHour).toBeDefined();
      expect($scope.exceptionHour.isAllDay).toBeTruthy();
    });
  });
  
  describe('ON cancelException', function() {
    it('should be defined on $scope', function() {
      expect($scope.cancelException).toBeDefined();
    });
    
    it('should nullify exceptionHour', function() {
      $scope.cancelException();
      expect($scope.exceptionHour).toEqual(null);
    });
  });
  
  describe('ON submitException', function() {
    it('should be defined on $scope', function() {
      expect($scope.submitException).toBeDefined();
    });
    
    (function() {
      beforeEach(inject(['apiHostname', function(apiHostname) {
        $httpBackend.expect('POST', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId1/exceptions').respond(200);
      }]));
      
      it('should POST to /v1/tenants/tenant-id/business-hours/businessHourId1/exceptions', function() {
        $scope.selectedHour = $scope.hours[0];
        $scope.exceptionHour = new BusinessHourException();
        $scope.submitException();
        
        $httpBackend.flush();
      });
      
      it('should push exception to $scope.selectedHour.$exceptions', function() {
        $scope.selectedHour = $scope.hours[0];
        $scope.exceptionHour = new BusinessHourException();
        $scope.submitException();
        
        $httpBackend.flush();
        
        expect($scope.selectedHour.$exceptions.length).toEqual(3);
        expect($scope.exceptionHour).toEqual(null);
      });
    })();
  });
  
  describe('ON removeException', function() {
    it('should be defined on $scope', function() {
      expect($scope.removeException).toBeDefined();
    });
    
    (function() {
      beforeEach(function() {
        $httpBackend.expect('DELETE', apiHostname + '/v1/tenants/tenant-id/business-hours/businessHourId1/exceptions/businessHourException1').respond(200);
      });
      
      it('should DELETE /v1/tenants/tenant-id/business-hours/businessHourId1/exceptions/businessHourException1', function() {
        $scope.selectedHour = $scope.hours[0];
        var exception = $scope.selectedHour.$exceptions[0];
        $scope.removeException(exception);
        
        $httpBackend.flush();
      });
      
      it('should remove exception from $scope.selectedHour.$exceptions', function() {
        $scope.selectedHour = $scope.hours[0];
        var exception = $scope.selectedHour.$exceptions[0];
        $scope.removeException(exception);
        
        $httpBackend.flush();
        
        expect($scope.selectedHour.$exceptions.length).toEqual(1);
      });
    })();
  });
  
  describe('ON onIsHoursCustomChanged', function() {
    beforeEach(function() {
      $scope.selectedHour = $scope.hours[0];
    });
    
    it('should be defined on $scope', function() {
      expect($scope.onIsHoursCustomChanged).toBeDefined();
    });
    
    it('should set all times to -1 on isCustom false', function() {
      $scope.onIsHoursCustomChanged(false);
      var expected = -1;
      
      angular.forEach(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], function(day) {
        expect($scope.selectedHour[day + 'StartTimeMinutes']).toEqual(expected);
        expect($scope.selectedHour[day + 'EndTimeMinutes']).toEqual(expected);
      });
    });
    
    it('should set all times to -1 on isCustom false', function() {
      $scope.onIsHoursCustomChanged(true);
      var expected = -1;
      
      for(var day in ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']) {
        expect($scope.selectedHour[day + 'StartTimeMinutes']).not.toEqual(expected);
        expect($scope.selectedHour[day + 'EndTimeMinutes']).not.toEqual(expected);
      }
    });
  });
  
  describe('ON generateHoursMessage', function() {
    it('should be defined on $scope', function() {
      expect($scope.generateHoursMessage).toBeDefined();
    });
    
    it('should return hours.monday for value = monday', function() {
      var result = $scope.generateHoursMessage('monday');
      expect(result).toEqual({day: 'hours.monday'});
    });
  });
});