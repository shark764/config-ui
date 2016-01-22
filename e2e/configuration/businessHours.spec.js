'use strict';

describe('The business hours view', function() {
  var loginPage = require('../login/login.po.js'),
    hours = require('./businessHours.po.js'),
    profile = require('../userProfile/profile.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params,
    random,
    hourCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
    browser.get(shared.businessHoursPageUrl);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.businessHoursPageUrl);
    hourCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include list of hours, create hours section and standard page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsPanel.isDisplayed()).toBeFalsy(); //Hide side panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Business Hours Management');
  });

  it('should display business hours fields in create', function() {
    shared.createBtn.click();

    expect(shared.detailsFormHeader.getText()).toBe('Creating New Business Hours');
    expect(hours.nameFormField.isDisplayed()).toBeTruthy();
    expect(hours.descriptionFormField.isDisplayed()).toBeTruthy();

    // Display timezone and default to US/Eastern
    expect(hours.timezoneFormDropDown.isDisplayed()).toBeTruthy();
    expect(hours.timezoneFormDropDown.$('option:checked').getText()).toBe('(-05:00) US/Eastern');

    // Display hours radio buttons and default to 24/7
    expect(hours.customHoursRadio.isDisplayed()).toBeTruthy();
    expect(hours.allHoursRadio.isDisplayed()).toBeTruthy();
    expect(hours.customHoursRadio.isSelected()).toBeFalsy();
    expect(hours.allHoursRadio.isSelected()).toBeTruthy();

    // Not display custom hours table
    expect(hours.customHoursTable.isDisplayed()).toBeFalsy();

    // Display exceptions fields
    expect(hours.addExceptionBtn.isDisplayed()).toBeTruthy();
    expect(hours.addExceptionForm.isPresent()).toBeFalsy();
    expect(hours.exceptionsTable.isDisplayed()).toBeFalsy();

    // Should display Submit and cancel buttons
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
    expect(shared.cancelFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should create new hours and add to table', function() {
    random = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    hours.nameFormField.sendKeys('Business Hours ' + random);
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.tableElements.count()).toBeGreaterThan(hourCount);
      expect(hours.nameFormField.getAttribute('value')).toBe('Business Hours ' + random);
      expect(shared.detailsFormHeader.getText()).toBe('Business Hours ' + random);
    });
  });

  it('should display timezones in the dropdown', function() {
    shared.createBtn.click();

    expect(hours.timezoneDropDownItems.count()).toBe(583);
  });

  it('should display business hours details when selected from table', function() {
    hours.firstTableRow.click();

    // Verify hours name in table matches populated field
    expect(hours.firstTableRow.element(by.css(hours.nameColumn)).getText()).toContain(hours.nameFormField.getAttribute('value'));
    expect(hours.firstTableRow.element(by.css(hours.descriptionColumn)).getText()).toBe(hours.descriptionFormField.getAttribute('value'));
    expect(hours.timezoneFormDropDown.$('option:checked').getText()).toContain(hours.firstTableRow.element(by.css(hours.timezoneColumn)).getText());

    hours.secondTableRow.isPresent().then(function(secondRowExists) {
      if (secondRowExists) {
        // Change selected hours and ensure details are updated
        hours.secondTableRow.click();
        expect(hours.secondTableRow.element(by.css(hours.nameColumn)).getText()).toContain(hours.nameFormField.getAttribute('value'));
        expect(hours.secondTableRow.element(by.css(hours.descriptionColumn)).getText()).toBe(hours.descriptionFormField.getAttribute('value'));
        expect(hours.timezoneFormDropDown.$('option:checked').getText()).toContain(hours.secondTableRow.element(by.css(hours.timezoneColumn)).getText());
      }
    });
  });

  it('should require name field when creating', function() {
    shared.createBtn.click();
    hours.nameFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(hours.requiredErrors.count()).toBe(1);
    expect(hours.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require name field when editing', function() {
    hours.firstTableRow.click().then(function() {
      hours.nameFormField.clear();
      hours.nameFormField.sendKeys('\t');

      // Submit button is still disabled
      expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      shared.submitFormBtn.click();

      expect(hours.requiredErrors.count()).toBe(1);
      expect(hours.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
      expect(shared.successMessage.isPresent()).toBeFalsy();
    });
  });

  it('should not require description when editing', function() {
    hours.firstTableRow.click();

    // Edit fields
    hours.descriptionFormField.sendKeys('Edit');
    hours.descriptionFormField.clear();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(hours.requiredErrors.count()).toBe(0);
    });
  });

  // TODO TITAN2-6929
  xit('should reset fields after editing and selecting Cancel', function() {
    random = Math.floor((Math.random() * 500) + 1);
    hours.firstTableRow.click();

    var originalName = hours.nameFormField.getAttribute('value');
    var originalDescription = hours.descriptionFormField.getAttribute('value');
    var originalTimezone = hours.timezoneFormDropDown.getAttribute('value');

    // Edit fields
    hours.nameFormField.sendKeys('Edit');
    hours.descriptionFormField.sendKeys('Edit');
    hours.timezoneFormDropDown.all(by.css('option')).count().then(function(timezoneCount) {
      hours.timezoneFormDropDown.all(by.css('option')).get((random % timezoneCount) + 1).click();
    });
    hours.regularHours.getAttribute('value').then(function(customHours) {
      if (customHours) { // Switch to 24/7 hours
        hours.allHoursRadio.click();
      } else { // Switch to custom hours
        hours.customHoursRadio.click();
      }
    }).then(function(customHours) {
      shared.cancelFormBtn.click();

      // Warning message is displayed
      shared.waitForAlert();
      shared.dismissChanges();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(hours.nameFormField.getAttribute('value')).toBe(originalName);
      expect(hours.descriptionFormField.getAttribute('value')).toBe(originalDescription);
      expect(hours.timezoneFormDropDown.getAttribute('value')).toBe(originalTimezone);
      expect(hours.regularHours.getAttribute('value')).toBe(customHours);
    });
  });

  // TODO: Custom hours validation, Exception management
});
