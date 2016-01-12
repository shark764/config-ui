'use strict';

describe('The dispatch mappings view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    dispatchMappings = require('./dispatchMappings.po.js'),
    flows = require('./flows.po.js'),
    params = browser.params,
    dispatchMappingCount,
    newDispatchMappingName,
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

  it('should require flow', function() {
    dispatchMappings.flowDropdown.all(by.css('option')).count().then(function(flowCount) {
      if (flowCount == 1) {
        // No flows; unable to create Dispatch Mapping
        randomDispatchMapping = Math.floor((Math.random() * 1000) + 1);
        newDispatchMappingName = 'DispatchMapping ' + randomDispatchMapping;
        shared.createBtn.click();

        // Edit fields
        dispatchMappings.nameFormField.sendKeys(newDispatchMappingName);
        dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping ' + randomDispatchMapping);
        // Select Customer Mapping
        dispatchMappings.mappingOptions.get(1).click();
        dispatchMappings.phoneFormField.sendKeys('15062345678');
        expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

        // Add flow as a prereq
        shared.cancelFormBtn.click();
        shared.waitForAlert();
        var alertDialog = browser.switchTo().alert();
        expect(alertDialog.accept).toBeDefined();
        expect(alertDialog.dismiss).toBeDefined();
        alertDialog.accept();
        browser.get(shared.flowsPageUrl);

        shared.createBtn.click();

        flows.modalNameField.clear();
        flows.modalNameField.sendKeys('Flow ' + randomDispatchMapping);
        flows.modalTypeDropdown.all(by.css('option')).get(1).click();
        flows.submitModalBtn.click().then(function() {
          expect(flows.createModal.isPresent()).toBeFalsy();

          // Redirects to flow designer
          flows.waitForFlowDesignerRedirect();
          expect(browser.getCurrentUrl()).toContain('/flows/editor');
        });
      };
    });
  });

  it('should successfully create new Dispatch Mapping with Customer Mapping', function() {
    randomDispatchMapping = Math.floor((Math.random() * 1000) + 1);
    newDispatchMappingName = 'DispatchMapping ' + randomDispatchMapping;
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.nameFormField.sendKeys(newDispatchMappingName);
    dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping ' + randomDispatchMapping);
    // Select Customer Mapping
    dispatchMappings.mappingOptions.get(1).click();
    dispatchMappings.phoneFormField.sendKeys('15062345678');
    dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.tableElements.count()).toBeGreaterThan(dispatchMappingCount);

      shared.searchField.sendKeys(newDispatchMappingName);
      expect(shared.tableElements.count()).toBeGreaterThan(0);
      expect(shared.firstTableRow.getText()).toContain(newDispatchMappingName);

      // Confirm correct Mapping type is selected after saving
      expect(dispatchMappings.mappingOptions.get(1).isSelected()).toBeTruthy();
      expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Customer');
    });
  });

  it('should successfully create new Dispatch Mapping with Contact Point Mapping', function() {
    randomDispatchMapping = Math.floor((Math.random() * 1000) + 1);
    newDispatchMappingName = 'DispatchMapping ' + randomDispatchMapping;
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.nameFormField.sendKeys(newDispatchMappingName);
    dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping ' + randomDispatchMapping);
    // Select Contact Point Mapping
    dispatchMappings.mappingOptions.get(2).click();
    dispatchMappings.phoneFormField.sendKeys('15062345678');
    dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.tableElements.count()).toBeGreaterThan(dispatchMappingCount);

      shared.searchField.sendKeys(newDispatchMappingName);
      expect(shared.tableElements.count()).toBeGreaterThan(0);
      expect(shared.firstTableRow.getText()).toContain(newDispatchMappingName);

      // Confirm correct Mapping type is selected after saving
      expect(dispatchMappings.mappingOptions.get(2).isSelected()).toBeTruthy();
      expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Contact Point');
    });
  });

  it('should successfully create new Dispatch Mapping with Integration Mapping', function() {
    randomDispatchMapping = Math.floor((Math.random() * 1000) + 1);
    newDispatchMappingName = 'DispatchMapping ' + randomDispatchMapping;
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.nameFormField.sendKeys(newDispatchMappingName);
    dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping ' + randomDispatchMapping);
    // Select Integration Mapping
    dispatchMappings.mappingOptions.get(3).click();
    dispatchMappings.integrationFormDropdown.all(by.css('option')).get(1).click();
    dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.tableElements.count()).toBeGreaterThan(dispatchMappingCount);

      shared.searchField.sendKeys(newDispatchMappingName);
      expect(shared.tableElements.count()).toBeGreaterThan(0);
      expect(shared.firstTableRow.getText()).toContain(newDispatchMappingName);

      // Confirm correct Mapping type is selected after saving
      expect(dispatchMappings.mappingOptions.get(3).isSelected()).toBeTruthy();
      expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Integration');
    });
  });

  it('should successfully create new Dispatch Mapping with Direction Mapping', function() {
    randomDispatchMapping = Math.floor((Math.random() * 1000) + 1);
    newDispatchMappingName = 'DispatchMapping ' + randomDispatchMapping;
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.nameFormField.sendKeys(newDispatchMappingName);
    dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping ' + randomDispatchMapping);
    // Select Direction Mapping
    dispatchMappings.mappingOptions.get(4).click();
    dispatchMappings.directionFormDropdown.all(by.css('option')).get(1).click();
    dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.tableElements.count()).toBeGreaterThan(dispatchMappingCount);

      shared.searchField.sendKeys(newDispatchMappingName);
      expect(shared.tableElements.count()).toBeGreaterThan(0);
      expect(shared.firstTableRow.getText()).toContain(newDispatchMappingName);

      // Confirm correct Mapping type is selected after saving
      expect(dispatchMappings.mappingOptions.get(4).isSelected()).toBeTruthy();
      expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Direction');
    });
  });

  it('should include dispatch mapping page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsPanel.isDisplayed()).toBeFalsy(); //Right panel is hidden
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Dispatch Mapping Management');
  });

  it('should include valid fields when creating a new Dispatch Mapping', function() {
    shared.createBtn.click();
    expect(dispatchMappings.creatingDispatchMappingHeader.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.nameFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.interactionTypeDropdown.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.mappingDropdown.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.flowDropdown.isDisplayed()).toBeTruthy();

    // Should have Integration type selected by default
    expect(dispatchMappings.interactionTypeDropdown.element(by.css('option:checked')).getAttribute('label')).toBe('Voice');

    // Remaining dropdowns should have no value by default
    expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toContain('Select Mapping...');
    expect(dispatchMappings.mappingOptions.get(0).isSelected()).toBeTruthy();
    expect(dispatchMappings.flowDropdown.$('option:checked').getText()).toContain('Select Flow...');
    expect(dispatchMappings.flowDropdown.all(by.css('option')).get(0).isSelected()).toBeTruthy();

    // Changes value field based on Mapping type selected
    expect(dispatchMappings.phoneFormField.isDisplayed()).toBeFalsy();
    expect(dispatchMappings.integrationFormDropdown.isDisplayed()).toBeFalsy();
    expect(dispatchMappings.directionFormDropdown.isDisplayed()).toBeFalsy();

    // Customer Mapping Shows Phone field; remaining conditional fields are not displayed
    dispatchMappings.mappingOptions.get(1).click();
    expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Customer');
    expect(dispatchMappings.phoneFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.integrationFormDropdown.isDisplayed()).toBeFalsy();
    expect(dispatchMappings.directionFormDropdown.isDisplayed()).toBeFalsy();

    // Contact Point Mapping Shows Phone field; remaining conditional fields are not displayed
    dispatchMappings.mappingOptions.get(2).click();
    expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Contact Point');
    expect(dispatchMappings.phoneFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.integrationFormDropdown.isDisplayed()).toBeFalsy();
    expect(dispatchMappings.directionFormDropdown.isDisplayed()).toBeFalsy();

    // Integration Mapping Shows Phone field; remaining conditional fields are not displayed
    dispatchMappings.mappingOptions.get(3).click();
    expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Integration');
    expect(dispatchMappings.phoneFormField.isDisplayed()).toBeFalsy();
    expect(dispatchMappings.integrationFormDropdown.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.directionFormDropdown.isDisplayed()).toBeFalsy();

    // Direction Shows Phone field; remaining conditional fields are not displayed
    dispatchMappings.mappingOptions.get(4).click();
    expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Direction');
    expect(dispatchMappings.phoneFormField.isDisplayed()).toBeFalsy();
    expect(dispatchMappings.integrationFormDropdown.isDisplayed()).toBeFalsy();
    expect(dispatchMappings.directionFormDropdown.isDisplayed()).toBeTruthy();
  });

  it('should require field input when creating a new Dispatch Mapping', function() {
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New DispatchMapping is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);
  });

  it('should require Name when creating a new Dispatch Mapping', function() {
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping');
    dispatchMappings.mappingOptions.get(4).click();
    dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // New DispatchMapping is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);

    // Touch Name input field
    dispatchMappings.nameFormField.click();
    dispatchMappings.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');

    // New DispatchMapping is not saved
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);
  });

  it('should clear fields on Cancel', function() {
    shared.createBtn.click();

    // Edit fields
    dispatchMappings.nameFormField.sendKeys('Dispatch Mapping Cancel');
    dispatchMappings.descriptionFormField.sendKeys('Description Cancel');
    dispatchMappings.mappingOptions.get(1).click();
    dispatchMappings.phoneFormField.sendKeys('15062345678');
    dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();

    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    shared.dismissChanges();

    // New dispatch mapping is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(dispatchMappingCount);

    // Form fields are cleared and reset to defaults
    expect(dispatchMappings.nameFormField.getAttribute('value')).toBe('');
    expect(dispatchMappings.descriptionFormField.getAttribute('value')).toBe('');
    expect(dispatchMappings.mappingDropdown.getAttribute('value')).toBe('');
    expect(dispatchMappings.phoneFormField.isDisplayed()).toBeFalsy();
  });

  it('should display dispatch mapping details when selected from table', function() {
    shared.firstTableRow.click();

    // Verify dispatch mapping details in table matches populated field
    expect(shared.firstTableRow.element(by.css(dispatchMappings.nameColumn)).getText()).toBe(dispatchMappings.nameHeader.getText());
    dispatchMappings.mappingDropdown.$('option:checked').getText().then(function(value) {
      if (value == 'Contact Point') {
        expect(shared.firstTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe('contact-point');
      } else if (value == 'Integration') {
        expect(shared.firstTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe('source');
      } else {
        expect(shared.firstTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe(value.toLowerCase());
      }
    });
    dispatchMappings.interactionTypeDropdown.$('option:checked').getText().then(function(value) {
      expect(shared.firstTableRow.element(by.css(dispatchMappings.channelTypeColumn)).getText()).toBe(value.toLowerCase());
    });

    shared.firstTableRow.element(by.css(dispatchMappings.statusColumn)).getText().then(function(dispatchMappingStatus) {
      if (dispatchMappingStatus == 'Enabled') {
        expect(dispatchMappings.statusSwitchInput.isSelected()).toBeTruthy();
      } else if (dispatchMappingStatus == 'Disabled') {
        expect(dispatchMappings.statusSwitchInput.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });

    // Change selected queue and ensure details are updated
    shared.secondTableRow.click().then(function() {
      // Verify dispatch mapping details in table matches populated field
      expect(shared.secondTableRow.element(by.css(dispatchMappings.nameColumn)).getText()).toBe(dispatchMappings.nameHeader.getText());
      dispatchMappings.mappingDropdown.$('option:checked').getText().then(function(value) {
        if (value == 'Contact Point') {
          expect(shared.secondTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe('contact-point');
        } else if (value == 'Integration') {
          expect(shared.secondTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe('source');
        } else {
          expect(shared.secondTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe(value.toLowerCase());
        }
      });
      dispatchMappings.interactionTypeDropdown.$('option:checked').getText().then(function(value) {
        expect(shared.secondTableRow.element(by.css(dispatchMappings.channelTypeColumn)).getText()).toBe(value.toLowerCase());
      });

      shared.secondTableRow.element(by.css(dispatchMappings.statusColumn)).getText().then(function(dispatchMappingStatus) {
        if (dispatchMappingStatus == 'Enabled') {
          expect(dispatchMappings.statusSwitchInput.isSelected()).toBeTruthy();
        } else if (dispatchMappingStatus == 'Disabled') {
          expect(dispatchMappings.statusSwitchInput.isSelected()).toBeFalsy();
        } else {
          // fail test
          expect(true).toBeFalsy();
        };
      });
    });
  });

  it('should include valid Dispatch Mapping fields when editing an existing Dispatch Mapping', function() {
    shared.firstTableRow.click();

    expect(dispatchMappings.nameHeader.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.nameFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.interactionTypeDropdown.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.mappingDropdown.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.flowDropdown.isDisplayed()).toBeTruthy();
    expect(dispatchMappings.statusSwitch.isDisplayed()).toBeTruthy();

    dispatchMappings.mappingDropdown.$('option:checked').getAttribute('value').then(function(mapping) {
      if (mapping == 0) { // Customer
        expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Customer');
        expect(dispatchMappings.phoneFormField.isDisplayed()).toBeTruthy();
        expect(dispatchMappings.integrationFormDropdown.isPresent()).toBeFalsy();
        expect(dispatchMappings.directionFormDropdown.isPresent()).toBeFalsy();
      } else if (mapping == 1) { // Contact Point
        expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Contact Point');
        expect(dispatchMappings.phoneFormField.isDisplayed()).toBeTruthy();
        expect(dispatchMappings.integrationFormDropdown.isPresent()).toBeFalsy();
        expect(dispatchMappings.directionFormDropdown.isPresent()).toBeFalsy();
      } else if (mapping == 2) { // Integration
        expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Integration');
        expect(dispatchMappings.phoneFormField.isDisplayed()).toBeFalsy();
        expect(dispatchMappings.integrationFormDropdown.isDisplayed()).toBeTruthy();
        expect(dispatchMappings.directionFormDropdown.isDisplayed()).toBeFalsy();
      } else if (mapping == 3) { // Direction
        expect(dispatchMappings.mappingDropdown.$('option:checked').getText()).toBe('Direction');
        expect(dispatchMappings.phoneFormField.isPresent()).toBeFalsy();
        expect(dispatchMappings.integrationFormDropdown.isPresent()).toBeFalsy();
        expect(dispatchMappings.directionFormDropdown.isDisplayed()).toBeTruthy();
      } else {
        // Test failed
        expect(false).toBeTruthy();
      }
    })
  });

  it('should reset Dispatch Mapping fields after editing and selecting Cancel', function() {
    shared.firstTableRow.click();
    randomDispatchMapping = Math.floor((Math.random() * 1000) + 1);
    var originalName = dispatchMappings.nameFormField.getAttribute('value');
    var originalMapping = dispatchMappings.mappingDropdown.$('option:checked').getAttribute('value');
    var originalFlow = dispatchMappings.flowDropdown.$('option:checked').getAttribute('value');

    // Edit fields
    dispatchMappings.nameFormField.sendKeys('Edit');
    dispatchMappings.mappingOptions.get(0).click();
    dispatchMappings.mappingOptions.get((randomDispatchMapping % 3) + 1).click();
    dispatchMappings.mappingOptions.get(randomDispatchMapping % 4).click();
    dispatchMappings.flowDropdown.all(by.css('option')).count().then(function(flowCount) {
      dispatchMappings.flowDropdown.all(by.css('option')).get(randomDispatchMapping % flowCount).click();

      shared.cancelFormBtn.click();

      // Warning message is displayed
      shared.waitForAlert();
      shared.dismissChanges();

      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(shared.tableElements.count()).toBe(dispatchMappingCount);

      // Fields reset to original values
      expect(dispatchMappings.nameFormField.getAttribute('value')).toBe(originalName);
      expect(dispatchMappings.mappingDropdown.$('option:checked').getAttribute('value')).toBe(originalMapping);
      expect(dispatchMappings.flowDropdown.$('option:checked').getAttribute('value')).toBe(originalFlow);
    });
  });

  it('should format Phone field when creating a Dispatch Mapping', function() {
    shared.createBtn.click();

    dispatchMappings.mappingOptions.get(1).click();

    dispatchMappings.phoneFormField.sendKeys('15062345678\t');

    // Phone input is reformatted
    expect(dispatchMappings.phoneFormField.getAttribute('value')).toBe('+1 506-234-5678');
  });

  it('should require Phone field when creating a Dispatch Mapping', function() {
    shared.createBtn.click();

    dispatchMappings.mappingOptions.get(1).click();
    dispatchMappings.phoneFormField.click('');
    dispatchMappings.nameFormField.sendKeys('Name');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredErrors.get(0).getText()).toBe('Phone number is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require Valid Phone field when creating a Dispatch Mapping', function() {
    shared.createBtn.click();

    dispatchMappings.mappingOptions.get(1).click();
    dispatchMappings.phoneFormField.sendKeys('not a valid phone number\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredErrors.get(0).getText()).toBe('Phone number should be in E.164 format.');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require name field when editing a Dispatch Mapping', function() {
    shared.firstTableRow.click();

    // Edit fields
    dispatchMappings.nameFormField.clear();
    dispatchMappings.nameFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredErrors.get(0).getText()).toBe('Field "Name" is required.');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should allow name field to be edited', function() {
    shared.firstTableRow.click();
    expect(dispatchMappings.nameFormField.isEnabled()).toBeTruthy();

    // Edit fields
    dispatchMappings.nameFormField.sendKeys('Edit');
    var newDispatchMappingName = dispatchMappings.nameFormField.getAttribute('value');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(dispatchMappings.nameHeader.getText()).toBe(newDispatchMappingName);
    });
  });

  it('should require Phone field when editing a Dispatch Mapping', function() {
    // Filter table results so only dispatch Mappings with a phone number are visible
    dispatchMappings.interactionFieldDropDownLabel.click();
    dispatchMappings.interactionFields.get(2).click();
    dispatchMappings.interactionFields.get(3).click();
    dispatchMappings.interactionFieldDropDownLabel.click();

    shared.firstTableRow.click();

    // Edit fields
    dispatchMappings.phoneFormField.clear();
    dispatchMappings.phoneFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredErrors.get(0).getText()).toBe('Phone number is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require Valid Phone field when editing a Dispatch Mapping', function() {
    // Filter table results so only dispatch Mappings with a phone number are visible
    dispatchMappings.interactionFieldDropDownLabel.click();
    dispatchMappings.interactionFields.get(2).click();
    dispatchMappings.interactionFields.get(3).click();

    shared.firstTableRow.click();

    // Edit fields
    dispatchMappings.phoneFormField.clear();
    dispatchMappings.phoneFormField.sendKeys('not a valid phone number\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(dispatchMappings.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(dispatchMappings.requiredErrors.get(0).getText()).toBe('Phone number should be in E.164 format.');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should format Phone field when editing a Dispatch Mapping', function() {
    // Filter table results so only dispatch Mappings with a phone number are visible
    dispatchMappings.interactionFieldDropDownLabel.click();
    dispatchMappings.interactionFields.get(2).click();
    dispatchMappings.interactionFields.get(3).click();

    shared.firstTableRow.click();

    //Edit fields
    dispatchMappings.phoneFormField.clear();
    dispatchMappings.phoneFormField.sendKeys('15062345678\t');

    // Error messages are not displayed
    expect(dispatchMappings.requiredErrors.count()).toEqual(0);

    // Phone input is reformatted
    expect(dispatchMappings.phoneFormField.getAttribute('value')).toBe('+1 506-234-5678');
  });

  it('should accept Euro phone number input in Phone field when editing a Dispatch Mapping', function() {
    // Filter table results so only dispatch Mappings with a phone number are visible
    dispatchMappings.interactionFieldDropDownLabel.click();
    dispatchMappings.interactionFields.get(2).click();
    dispatchMappings.interactionFields.get(3).click();

    shared.firstTableRow.click();

    //Edit fields
    dispatchMappings.phoneFormField.clear();
    dispatchMappings.phoneFormField.sendKeys('442071828750\t');

    // Error messages are not displayed
    expect(dispatchMappings.requiredErrors.count()).toEqual(0);

    // Phone input is reformatted
    expect(dispatchMappings.phoneFormField.getAttribute('value')).toBe('+44 20 7182 8750');
  });
});
