'use strict';

describe('The integrations view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    integrations = require('./integrations.po.js'),
    params = browser.params,
    integrationCount,
    randomIntegration;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.integrationsPageUrl);
    integrationCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include integration page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide right panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Integration Management');
  });

  it('should display integration details when selected from table', function() {
    // Select first integration from table
    shared.firstTableRow.click();

    // Verify integration details in table matches populated field
    expect(integrations.typeHeader.getText()).toContain(shared.firstTableRow.element(by.css(integrations.typeColumn)).getText());
    expect(shared.firstTableRow.element(by.css(integrations.accountColumn)).getText()).toBe(integrations.accountSIDFormField.getAttribute('value'));
    shared.firstTableRow.element(by.css(integrations.statusColumn)).getText().then(function(integrationStatus) {
      if (integrationStatus == 'Enabled') {
        expect(integrations.statusSwitchToggle.isSelected()).toBeTruthy();
      } else if (integrationStatus == 'Disabled') {
        expect(integrations.statusSwitchToggle.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    shared.firstTableRow.element(by.css(integrations.webRTCColumn)).getText().then(function(integrationWebRTC) {
      if (integrationWebRTC == 'Enabled') {
        // TODO Bug TITAN2-3324
        //expect(integrations.webRTCFormSwitchToggle.isSelected()).toBeTruthy();
      } else if (integrationWebRTC == 'Disabled') {
        expect(integrations.webRTCFormSwitchToggle.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });

    // Change selected integration and ensure details are updated
    shared.secondTableRow.click();
    expect(integrations.typeHeader.getText()).toContain(shared.secondTableRow.element(by.css(integrations.typeColumn)).getText());
    expect(shared.secondTableRow.element(by.css(integrations.accountColumn)).getText()).toBe(integrations.accountSIDFormField.getAttribute('value'));
    shared.secondTableRow.element(by.css(integrations.statusColumn)).getText().then(function(integrationStatus) {
      if (integrationStatus == 'Enabled') {
        expect(integrations.statusSwitchToggle.isSelected()).toBeTruthy();
      } else if (integrationStatus == 'Disabled') {
        expect(integrations.statusSwitchToggle.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    shared.secondTableRow.element(by.css(integrations.webRTCColumn)).getText().then(function(integrationWebRTC) {
      if (integrationWebRTC == 'Enabled') {
        // TODO Bug TITAN2-3324
        //expect(integrations.webRTCFormSwitchToggle.isSelected()).toBeTruthy();
      } else if (integrationWebRTC == 'Disabled') {
        expect(integrations.webRTCFormSwitchToggle.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
  });

  it('should include valid Integration fields when editing an existing Integration', function() {
    shared.firstTableRow.click();

    expect(integrations.typeHeader.isDisplayed()).toBeTruthy();
    expect(integrations.accountSIDFormField.isDisplayed()).toBeTruthy();
    expect(integrations.authTokenFormField.isDisplayed()).toBeTruthy();
    expect(integrations.webRTCFormSwitch.isDisplayed()).toBeTruthy();
  });

  it('should reset Integration fields after editing and selecting Cancel', function() {
    shared.firstTableRow.click();

    var originalAccountSID = integrations.accountSIDFormField.getAttribute('value');
    var originalAuthToken = integrations.authTokenFormField.getAttribute('value');
    var originalWebRTC = integrations.webRTCFormSwitch.isSelected();

    // Edit fields
    integrations.accountSIDFormField.sendKeys('Integration Account SID');
    integrations.authTokenFormField.sendKeys('Integration Token');
    integrations.webRTCFormSwitch.click();
    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(integrationCount);

    // Fields reset to original values
    expect(integrations.accountSIDFormField.getAttribute('value')).toBe(originalAccountSID);
    expect(integrations.authTokenFormField.getAttribute('value')).toBe(originalAuthToken);
    expect(integrations.webRTCFormSwitch.isSelected()).toBe(originalWebRTC);
  });

  it('should allow the Integration fields to be updated', function() {
    shared.firstTableRow.click();

    // Edit fields
    integrations.accountSIDFormField.sendKeys('Edit');
    integrations.authTokenFormField.sendKeys('Edit');
    integrations.webRTCFormSwitch.click();

    var editAccountSID = integrations.accountSIDFormField.getAttribute('value');
    var editAuthToken = integrations.authTokenFormField.getAttribute('value');
    var editWebRTC = integrations.webRTCFormSwitchToggle.isSelected();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(integrationCount);

      // Changes persist
      browser.refresh();
      expect(integrations.accountSIDFormField.getAttribute('value')).toBe(editAccountSID);
      expect(integrations.authTokenFormField.getAttribute('value')).toBe(editAuthToken);
      // TODO Bug TITAN2-3324
      //expect(integrations.webRTCFormSwitchToggle.isSelected()).toBe(editWebRTC);

      // Reset values
      integrations.accountSIDFormField.sendKeys('\u0008\u0008\u0008\u0008');
      integrations.authTokenFormField.sendKeys('\u0008\u0008\u0008\u0008');
      integrations.webRTCFormSwitch.click();

      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  xit('should require Account SID field when editing a Integration', function() {
    // TODO After TITAN2-3323 All fields or none are required
    shared.firstTableRow.click();

    // Edit fields
    integrations.accountSIDFormField.sendKeys('temp');
    integrations.accountSIDFormField.clear();
    integrations.authTokenFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(integrations.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(integrations.requiredErrors.get(0).getText()).toBe('Field "Account SID" is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should require Auth Token field when editing a Integration', function() {
    // TODO After TITAN2-3323 All fields or none are required
    shared.firstTableRow.click();

    // Edit fields
    integrations.authTokenFormField.sendKeys('temp');
    integrations.authTokenFormField.clear();
    integrations.accountSIDFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(integrations.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(integrations.requiredErrors.get(0).getText()).toBe('Field "Auth Token" is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});
