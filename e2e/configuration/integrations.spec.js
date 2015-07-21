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

  xit('should successfully create new Integration', function() {
    randomIntegration = Math.floor((Math.random() * 1000) + 1);
    var integrationAdded = false;
    var newIntegrationAccount = 'Integration ' + randomIntegration;
    shared.createBtn.click();

    // Edit fields
    integrations.accountSIDFormField.sendKeys(newIntegrationAccount);
    integrations.authTokenFormField.sendKeys(randomIntegration);
    integrations.webRTCFormSwitch.click();
    shared.submitFormBtn.click();

    expect(integrations.requiredErrors.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(integrationCount);

    // Confirm integration is displayed in integration list
    shared.tableElements.then(function(rows) {
      for (var i = 1; i <= rows.length; ++i) {
        // Check if integration name in table matches newly added integration
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
          if (value == newIntegrationAccount) {
            integrationAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new integration was found in the integration table
      expect(integrationAdded).toBeTruthy();
    });
  });

  it('should include integration page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide right panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Integration Management');
  });

  it('should include valid Integration fields when creating a new Integration', function() {
    shared.createBtn.click();
    expect(integrations.creatingIntegrationHeader.isDisplayed()).toBeTruthy();
    expect(integrations.accountSIDFormField.isDisplayed()).toBeTruthy();
    expect(integrations.authTokenFormField.isDisplayed()).toBeTruthy();
    expect(integrations.webRTCFormSwitch.isDisplayed()).toBeTruthy();
  });

  it('should require field input when creating a new Integration', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Integration is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(integrationCount);
  });

  xit('should require Account SID when creating a new Integration', function() {
    // TODO After error messages are added
    shared.createBtn.click();

    // Edit fields
    integrations.authTokenFormField.sendKeys('Integration Token');
    integrations.webRTCFormSwitch.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Integration is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(integrationCount);

    // Touch Account SID input field
    integrations.accountSIDFormField.click();
    integrations.authTokenFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(integrations.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(integrations.nameRequiredError.get(0).getText()).toBe('Field "Account SID" is required');

    // New Integration is not saved
    expect(shared.tableElements.count()).toBe(integrationCount);
  });

  xit('should require Auth Token when creating a new Integration', function() {
    // TODO After error messages are added
    shared.createBtn.click();

    // Edit fields
    integrations.accountSIDFormField.sendKeys('Integration Account SID');
    integrations.webRTCFormSwitch.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New Integration is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(integrationCount);

    // Touch Auth Token input field
    integrations.authTokenFormField.click();
    integrations.accountSIDFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(integrations.nameRequiredError.get(1).isDisplayed()).toBeTruthy();
    expect(integrations.nameRequiredError.get(1).getText()).toBe('Field "Auth Token" is required');

    // New Integration is not saved
    expect(shared.tableElements.count()).toBe(integrationCount);
  });

  it('should clear fields on Cancel', function() {
    shared.createBtn.click();

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

    // New integration is not created
    // TODO
    //expect(integrations.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(integrationCount);

    // Form fields are cleared and reset to default
    expect(integrations.accountSIDFormField.getAttribute('value')).toBe('');
    expect(integrations.authTokenFormField.getAttribute('value')).toBe('');
    expect(integrations.webRTCFormSwitch.isSelected()).toBeFalsy;
  });

  it('should display integration details when selected from table', function() {
    // Select first integration from table
    shared.firstTableRow.click();

    // Verify integration details in table matches populated field
    expect(integrations.typeHeader.getText()).toContain(shared.firstTableRow.element(by.css(integrations.typeColumn)).getText());
    expect(shared.firstTableRow.element(by.css(integrations.accountColumn)).getText()).toBe(integrations.accountSIDFormField.getAttribute('value'));
    shared.firstTableRow.element(by.css(integrations.statusColumn)).getText().then(function(integrationStatus) {
      if (integrationStatus == 'Enabled') {
        expect(integrations.statusSwitch.isSelected()).toBeTruthy();
      } else if (integrationStatus == 'Disabled') {
        expect(integrations.statusSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    shared.firstTableRow.element(by.css(integrations.webRTCColumn)).getText().then(function(integrationWebRTC) {
      if (integrationWebRTC == 'Enabled') {
        expect(integrations.webRTCFormSwitch.isSelected()).toBeTruthy();
      } else if (integrationWebRTC == 'Disabled') {
        expect(integrations.webRTCFormSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });

    // TODO Once integrations can be added
    // Change selected queue and ensure details are updated
    /*
    shared.secondTableRow.click();
    expect(integrations.typeHeader.getText()).toContain(shared.secondTableRow.element(by.css(integrations.typeColumn)).getText());
    expect(shared.secondTableRow.element(by.css(integrations.accountColumn)).getText()).toBe(integrations.accountSIDFormField.getAttribute('value'));
    shared.secondTableRow.element(by.css(integrations.statusColumn)).getText().then(function(integrationStatus) {
      if (integrationStatus == 'Enabled') {
        expect(integrations.statusSwitch.isSelected()).toBeTruthy();
      } else if (integrationStatus == 'Disabled') {
        expect(integrations.statusSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    shared.secondTableRow.element(by.css(integrations.webRTCColumn)).getText().then(function(integrationWebRTC) {
      if (integrationWebRTC == 'Enabled') {
        expect(integrations.webRTCFormSwitch.isSelected()).toBeTruthy();
      } else if (integrationWebRTC == 'Disabled') {
        expect(integrations.webRTCFormSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    */
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

    // TODO
    //expect(integrations.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(integrationCount);

    // Fields reset to original values
    expect(integrations.accountSIDFormField.getAttribute('value')).toBe(originalAccountSID);
    expect(integrations.authTokenFormField.getAttribute('value')).toBe(originalAuthToken);
    expect(integrations.webRTCFormSwitch.isSelected()).toBe(originalWebRTC);
  });

  xit('should allow the Integration fields to be updated', function() {
    // TODO Once integrations is fixed
    // Edit fields
    integrations.accountSIDFormField.sendKeys('Edit');
    integrations.authTokenFormField.sendKeys('Edit');
    integrations.webRTCFormSwitch.click();

    var editAccountSID = integrations.accountSIDFormField.getAttribute('value');
    var editAuthToken = integrations.authTokenFormField.getAttribute('value');
    var editWebRTC = integrations.webRTCFormSwitch.isSelected();
    shared.submitFormBtn.click();

    expect(integrations.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBe(integrationCount);

    // Changes persist
    browser.refresh();
    expect(integrations.accountSIDFormField.getAttribute('value')).toBe(editAccountSID);
    expect(integrations.authTokenFormField.getAttribute('value')).toBe(editAuthToken);
    expect(integrations.webRTCFormSwitch.isSelected()).toBe(editWebRTC);
  });

  xit('should require Account SID field when editing a Integration', function() {
    // Edit fields
    integrations.accountSIDFormField.clear();
    integrations.authTokenFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(integrations.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(integrations.requiredError.get(0).getText()).toBe('Field "Account SID" is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should require Auth Token field when editing a Integration', function() {
    // Edit fields
    integrations.authTokenFormField.clear();
    integrations.accountSIDFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(integrations.requiredError.get(1).isDisplayed()).toBeTruthy();
    expect(integrations.requiredError.get(1).getText()).toBe('Field "Auth Token" is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});
