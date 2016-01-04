'use strict';
var shared = require('../shared.po.js');

var BusinessHoursPage = function() {
  this.nameFormField = element(by.model('hc.selectedHour.name'));
  this.descriptionFormField = element(by.model('hc.selectedHour.description'));
  this.statusFormToggle = element(by.model('hc.selectedHour.active'));
  this.timezoneFormDropDown = element(by.model('hc.selectedHour.timezone'));
  this.timezoneDropDownItems = this.timezoneFormDropDown.all(by.css('option'));

  // Regular Hours fields
  this.regularHours = element(by.model('hc.isHoursCustom'));
  this.allHoursRadio = element(by.id('247-hours-radio'));
  this.customHoursRadio = element(by.id('custom-hours-radio'));
  this.customHoursTable = element(by.id('week-hours-table'));
  this.removeCustomHours = this.customHoursTable.all(by.css('.remove'));

  this.sunStartTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.sunStartTimeMinutes'));
  this.sunEndTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.sunEndTimeMinutes'));
  this.monStartTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.monStartTimeMinutes'));
  this.monEndTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.monEndTimeMinutes'));
  this.tueStartTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.tueStartTimeMinutes'));
  this.tuenEndTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.tueEndTimeMinutes'));
  this.wedStartTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.wedStartTimeMinutes'));
  this.wedEndTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.wedEndTimeMinutes'));
  this.thuStartTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.thuStartTimeMinutes'));
  this.thuEndTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.thuEndTimeMinutes'));
  this.friStartTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.friStartTimeMinutes'));
  this.friEndTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.friEndTimeMinutes'));
  this.satStartTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.satStartTimeMinutes'));
  this.satEndTimeFields = this.customHoursTable.element(by.model('hc.selectedHour.satEndTimeMinutes'));

  // Exception fields
  this.addExceptionBtn = element(by.id('add-exception-btn'));
  this.addExceptionForm = element(by.id('add-exception-form'));
  this.exceptionDateField = this.addExceptionForm.element(by.model('hc.exceptionHour.date'));
  this.exceptionAllDayRadio = this.addExceptionForm.element(by.id('exception-all-day'));
  this.exceptionCustomHoursRadio = this.addExceptionForm.element(by.id('exception-custom-hours'));
  this.exceptionStartTimeField = this.addExceptionForm.element(by.model('hc.exceptionHour.startTimeMinutes'));
  this.exceptionEndTimeField = this.addExceptionForm.element(by.model('hc.exceptionHour.startTimeMinutes'));
  this.submitException = this.addExceptionForm.element(by.id('submit-exception'));
  this.cancelException = this.addExceptionForm.element(by.id('cancel-exception'));

  this.exceptionsTable = element(by.id('exceptions-table'));
  this.removeExceptions = this.exceptionsTable.all(by.css('.remove'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.timezoneColumn = 'td:nth-child(4)';
  this.statusColumn = 'td:nth-child(5)';

  this.requiredErrors = element.all(by.css('.lo-error'));
};

module.exports = new BusinessHoursPage();
