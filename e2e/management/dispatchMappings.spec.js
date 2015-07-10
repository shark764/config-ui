'use strict';

describe('The dispatchMappings view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    dispatchMappings = require('./dispatchMappings.po.js'),
    params = browser.params,
    dispatchMappingCount,
    randomDispatchMapping;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.dispatchMappingsPageUrl);
    dispatchMappingCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should successfully create new Dispatch Mapping', function() {
    randomDispatchMapping = Math.floor((Math.random() * 1000) + 1);
    var dispatchMappingAdded = false;
    var newDispatchMappingName = 'DispatchMapping ' + randomDispatchMapping;
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.nameFormField.sendKeys(newDispatchMappingName);
    dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping ' + randomDispatchMapping);
    dispatchMappings.interactionTypeDropdown.get(0).click();
    shared.submitFormBtn.click();

    expect(dispatchMappings.requiredErrors.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(dispatchMappingCount);

    // Confirm dispatchMapping is displayed in dispatchMapping list
    shared.tableElements.then(function(rows) {
      for (var i = 1; i <= rows.length; ++i) {
        // Check if dispatchMapping name in table matches newly added dispatchMapping
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
          if (value == newDispatchMappingAccount) {
            dispatchMappingAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new dispatchMapping was found in the dispatchMapping table
      expect(dispatchMappingAdded).toBeTruthy();
    });
  });

  it('should include dispatchMapping page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('DispatchMapping Management');
  });

  it('should include valid DispatchMapping fields when creating a new DispatchMapping', function() {
    shared.createBtn.click();
    expect(dispatchMappings.creatingDispatchMappingHeader.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.accountSIDFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.authTokenFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.webRTCFormSwitch.isDisplayed()).toBeTruthy();
  });

  it('should require field input when creating a new DispatchMapping', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Submit without field input
    shared.submitFormBtn.click();

    // New DispatchMapping is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);
  });

  xit('should require Account SID when creating a new DispatchMapping', function() {
    // TODO After error messages are added
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.authTokenFormField.sendKeys('DispatchMapping Token');
    dispatchMappings.webRTCFormSwitch.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New DispatchMapping is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);

    // Touch Account SID input field
    dispatchMappings.accountSIDFormField.click();
    dispatchMappings.authTokenFormField.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.nameRequiredError.get(0).getText()).toBe('Field "Account SID" is required');

    // New DispatchMapping is not saved
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);
  });

  xit('should require Auth Token when creating a new DispatchMapping', function() {
    // TODO After error messages are added
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.accountSIDFormField.sendKeys('DispatchMapping Account SID');
    dispatchMappings.webRTCFormSwitch.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New DispatchMapping is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);

    // Touch Auth Token input field
    dispatchMappings.authTokenFormField.click();
    dispatchMappings.accountSIDFormField.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.nameRequiredError.get(1).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.nameRequiredError.get(1).getText()).toBe('Field "Auth Token" is required');

    // New DispatchMapping is not saved
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);
  });

  it('should clear fields on Cancel', function() {
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.accountSIDFormField.sendKeys('DispatchMapping Account SID');
    dispatchMappings.authTokenFormField.sendKeys('DispatchMapping Token');
    dispatchMappings.webRTCFormSwitch.click();
    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New dispatchMapping is not created
    // TODO
    //expect(dispatchMappings.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);

    // Form fields are cleared and reset to default
    expect(dispatchMappings.accountSIDFormField.getAttribute('value')).toBe('');
    expect(dispatchMappings.authTokenFormField.getAttribute('value')).toBe('');
    expect(dispatchMappings.webRTCFormSwitch.isSelected()).toBeFalsy;
  });

  it('should display dispatchMapping details when selected from table', function() {
    // Select first dispatchMapping from table
    shared.firstTableRow.click();

    // Verify dispatchMapping details in table matches populated field
    expect(dispatchMappings.typeHeader.getText()).toContain(shared.firstTableRow.element(by.css(dispatchMappings.typeColumn)).getText());
    expect(shared.firstTableRow.element(by.css(dispatchMappings.accountColumn)).getText()).toBe(dispatchMappings.accountSIDFormField.getAttribute('value'));
    shared.firstTableRow.element(by.css(dispatchMappings.statusColumn)).getText().then(function(dispatchMappingStatus) {
      if (dispatchMappingStatus == 'Enabled') {
        expect(dispatchMappings.statusSwitch.isSelected()).toBeTruthy();
      } else if (dispatchMappingStatus == 'Disabled') {
        expect(dispatchMappings.statusSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    shared.firstTableRow.element(by.css(dispatchMappings.webRTCColumn)).getText().then(function(dispatchMappingWebRTC) {
      if (dispatchMappingWebRTC == 'Enabled') {
        expect(dispatchMappings.webRTCFormSwitch.isSelected()).toBeTruthy();
      } else if (dispatchMappingWebRTC == 'Disabled') {
        expect(dispatchMappings.webRTCFormSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });

    // TODO Once dispatchMappings can be added
    // Change selected queue and ensure details are updated
    /*
    shared.secondTableRow.click();
    expect(dispatchMappings.typeHeader.getText()).toContain(shared.secondTableRow.element(by.css(dispatchMappings.typeColumn)).getText());
    expect(shared.secondTableRow.element(by.css(dispatchMappings.accountColumn)).getText()).toBe(dispatchMappings.accountSIDFormField.getAttribute('value'));
    shared.secondTableRow.element(by.css(dispatchMappings.statusColumn)).getText().then(function(dispatchMappingStatus) {
      if (dispatchMappingStatus == 'Enabled') {
        expect(dispatchMappings.statusSwitch.isSelected()).toBeTruthy();
      } else if (dispatchMappingStatus == 'Disabled') {
        expect(dispatchMappings.statusSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    shared.secondTableRow.element(by.css(dispatchMappings.webRTCColumn)).getText().then(function(dispatchMappingWebRTC) {
      if (dispatchMappingWebRTC == 'Enabled') {
        expect(dispatchMappings.webRTCFormSwitch.isSelected()).toBeTruthy();
      } else if (dispatchMappingWebRTC == 'Disabled') {
        expect(dispatchMappings.webRTCFormSwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
    */
  });

  it('should include valid DispatchMapping fields when editing an existing DispatchMapping', function() {
    expect(dispatchMappings.typeHeader.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.accountSIDFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.authTokenFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.webRTCFormSwitch.isDisplayed()).toBeTruthy();
  });

  it('should reset DispatchMapping fields after editing and selecting Cancel', function() {
    var originalAccountSID = dispatchMappings.accountSIDFormField.getAttribute('value');
    var originalAuthToken = dispatchMappings.authTokenFormField.getAttribute('value');
    var originalWebRTC = dispatchMappings.webRTCFormSwitch.isSelected();

    // Edit fields
    dispatchMappings.accountSIDFormField.sendKeys('DispatchMapping Account SID');
    dispatchMappings.authTokenFormField.sendKeys('DispatchMapping Token');
    dispatchMappings.webRTCFormSwitch.click();
    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // TODO
    //expect(dispatchMappings.requiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);

    // Fields reset to original values
    expect(dispatchMappings.accountSIDFormField.getAttribute('value')).toBe(originalAccountSID);
    expect(dispatchMappings.authTokenFormField.getAttribute('value')).toBe(originalAuthToken);
    expect(dispatchMappings.webRTCFormSwitch.isSelected()).toBe(originalWebRTC);
  });

  xit('should allow the DispatchMapping fields to be updated', function() {
    // TODO Once dispatchMappings is fixed
    // Edit fields
    dispatchMappings.accountSIDFormField.sendKeys('Edit');
    dispatchMappings.authTokenFormField.sendKeys('Edit');
    dispatchMappings.webRTCFormSwitch.click();

    var editAccountSID = dispatchMappings.accountSIDFormField.getAttribute('value');
    var editAuthToken = dispatchMappings.authTokenFormField.getAttribute('value');
    var editWebRTC = dispatchMappings.webRTCFormSwitch.isSelected();
    shared.submitFormBtn.click();

    expect(dispatchMappings.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);

    // Changes persist
    browser.refresh();
    expect(dispatchMappings.accountSIDFormField.getAttribute('value')).toBe(editAccountSID);
    expect(dispatchMappings.authTokenFormField.getAttribute('value')).toBe(editAuthToken);
    expect(dispatchMappings.webRTCFormSwitch.isSelected()).toBe(editWebRTC);
  });

  xit('should require Account SID field when editing a DispatchMapping', function() {
    // Edit fields
    dispatchMappings.accountSIDFormField.clear();
    dispatchMappings.authTokenFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(dispatchMappings.requiredError.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredError.get(0).getText()).toBe('Field "Account SID" is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should require Auth Token field when editing a DispatchMapping', function() {
    // Edit fields
    dispatchMappings.authTokenFormField.clear();
    dispatchMappings.accountSIDFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(dispatchMappings.requiredError.get(1).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredError.get(1).getText()).toBe('Field "Auth Token" is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});
