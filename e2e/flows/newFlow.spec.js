'use strict';

describe('The create new flows view', function() {
  var loginPage = require('../login/login.po.js'),
    flows = require('./flows.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params,
    flowCount,
    randomFlow;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.flowsPageUrl);
    flowCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should display a modal with new flow fields', function() {
    shared.createBtn.click();
    expect(flows.createModal.isDisplayed()).toBeTruthy();
    expect(flows.modalHeader.getText()).toBe('New Flow');

    // Create modal contains new flow fields with default values
    expect(flows.modalNameField.isDisplayed()).toBeTruthy();
    expect(flows.modalTypeDropdown.isDisplayed()).toBeTruthy();
    expect(flows.modalNameField.getAttribute('value')).toBe('Untitled Flow');
    expect(flows.modalTypeDropdown.$('option:checked').getText()).toBe('Select a Type...');

    expect(flows.submitModalBtn.isDisplayed()).toBeTruthy();
    expect(flows.submitModalBtn.isEnabled()).toBeFalsy();
    expect(flows.cancelModalBtn.isDisplayed()).toBeTruthy();
  });

  it('should add new flow to table', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalNameField.clear();
    flows.modalNameField.sendKeys('Flow ' + randomFlow);
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    flows.modalTypeDropdown.$('option:checked').getText().then(function(flowType) {
      flow.confirmModal.click().then(function() {
        shared.waitForSuccess();
        expect(flows.createModal.isPresent()).toBeFalsy();

        // Confirm flow is displayed in flow list with correct details
        shared.searchField.sendKeys('Flow ' + randomFlow);
        shared.firstTableRow.click();
        expect(flows.nameFormField.getAttribute('value')).toBe('Flow ' + randomFlow);
        expect(flows.typeFormDropdown.$('option:checked').getText()).toBe(flowType);
      });
    });
  });

  it('should not add a new flow when modal cancel button is selected', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalNameField.clear();
    flows.modalNameField.sendKeys('Flow ' + randomFlow);
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    flow.cancelModalBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(flows.createModal.isPresent()).toBeFalsy();
      expect(shared.tableElements.count()).toBe(flowCount);
    });
  });

  it('should require name', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalNameField.clear();
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    expect(flows.submitModalBtn.isEnabled()).toBeFalsy();
    flows.submitModalBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(flows.createModal.isDisplayed()).toBeTruthy();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(flows.modalErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.modalErrors.get(0).getText()).toBe('Please enter a draft name');
  });

  xit('should not require description', function() {
    flowCount = shared.tableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Complete flow form and submit without flow description
    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.descriptionFormField.click();
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    shared.submitFormBtn.click().then(function() {
      expect(shared.tableElements.count()).toBeGreaterThan(flowCount);
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  xit('should require type', function() {
    flowCount = shared.tableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Complete flow form and submit without flow type
    flows.typeFormDropdown.click();
    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.descriptionFormField.sendKeys('This is the flow description for flow ' + randomFlow);

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Type is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should not accept spaces only as valid field input', function() {
    flowCount = shared.tableElements.count();
    shared.createBtn.click();
    flows.nameFormField.sendKeys(' ');
    flows.descriptionFormField.sendKeys(' ');
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Please enter a name');
    expect(shared.tableElements.count()).toBe(flowCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should clear fields on Cancel', function() {
    flowCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    flows.nameFormField.sendKeys('Flow Name');
    flows.descriptionFormField.sendKeys('Flow Description');
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.dismissChanges()

    // New flow is not created
    expect(shared.tableElements.count()).toBe(flowCount);

    //Side panel is closed
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });
});
