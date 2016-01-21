'use strict';

describe('hoursExcpetionOverlap', function () {
  var $scope,
    controller,
    $httpBackend,
    element,
    apiHostname,
    Session;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', 'apiHostname', 'Session',
    function ($compile, $rootScope, _$httpBackend, _apiHostname_, _Session_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      Session = _Session_;
      apiHostname = _apiHostname_;

      $scope.exceptionHour = {};
      var tempDate = new Date('2016-01-20');
      var tempDate2 = new Date('2016-01-10');
      $scope.existingException = [{
        isAllDay:true,
        date:tempDate,
        description:null,
        startTimeMinutes:-1,
        endTimeMinutes:-1
      }, {
        isAllDay:false,
        date:tempDate2,
        description:null,
        startTimeMinutes:200,
        endTimeMinutes:600
      } ];

      element = $compile('<input type="date" ng-model="exceptionHour.date" ng-resource="exceptionHour" items="existingException" lo-hour-exception-overlap />')($scope);
    }
  ]));

  describe('on validate', function() {
    it('should return false when a date matches an allDay existing exception', function(){
      var dateVal = new Date('2016-01-20');

      $scope.exceptionHour = {
        isAllDay:true,
        date:dateVal,
        description:null,
        startTimeMinutes:-1,
        endTimeMinutes:-1
      };
      expect(element.data().$ngModelController.$validators.overlap()).toBeFalsy();
    });

    it('should return true when a date does not match an existining exception', function(){
      $scope.exceptionHour.date = new Date('2016-01-19T00:00:00Z');
      expect(element.data().$ngModelController.$validators.overlap()).toBeTruthy();

    });

    it('should return true when a date which includes times does not match existing exception', function(){
      $scope.exceptionHour.date = '2016-01-29T00:00:00Z';
      $scope.exceptionHour.startTimeMinutes = 300;
      $scope.exceptionHour.endTimeMinutes = 500;
      expect(element.data().$ngModelController.$validators.overlap()).toBeTruthy();
    });

    it('should return false when a date which includes times overlaps an existing exception', function(){
      $scope.exceptionHour.date = '2016-01-10T00:00:00Z';
      $scope.exceptionHour.startTimeMinutes = 300;
      $scope.exceptionHour.endTimeMinutes = 500;
      expect(element.data().$ngModelController.$validators.overlap()).toBeFalsy();
    });

    it('should compareExceptionHourOverlap return false when the exact same object is compared to itself', function(){
      expect(element.data().$ngModelController.compareExceptionHourOverlap($scope.exceptionHour, $scope.exceptionHour)).toBeFalsy();
    });
  });

});