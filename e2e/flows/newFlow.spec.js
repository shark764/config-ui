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
    flows.modalTypeDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    flows.modalTypeDropdown.$('option:checked').getText().then(function(flowType) {
      flows.submitModalBtn.click().then(function() {
        expect(flows.createModal.isPresent()).toBeFalsy();

        // Redirects to flow designer
        flows.waitForFlowDesignerRedirect();
        expect(browser.getCurrentUrl()).toContain('/flows/editor');

        // Confirm flow is displayed in flow list with correct details
        browser.get(shared.flowsPageUrl);
        shared.searchField.sendKeys('Flow ' + randomFlow);
        shared.firstTableRow.click();
        expect(flows.nameFormField.getAttribute('value')).toBe('Flow ' + randomFlow);
        expect(flows.typeFormDropdown.$('option:checked').getText()).toBe(flowType);

        expect(flows.draftTableElements.count()).toBe(1);
        expect(flows.draftTableElements.get(0).getText()).toContain('Initial Draft');
        expect(flows.versionsTable.isDisplayed()).toBeFalsy();
      });
    });
  });

  it('should not add a new flow when modal cancel button is selected', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalNameField.clear();
    flows.modalNameField.sendKeys('Flow ' + randomFlow);
    flows.modalTypeDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    flows.cancelModalBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(flows.createModal.isPresent()).toBeFalsy();
      expect(shared.tableElements.count()).toBe(flowCount);
    });
  });

  it('should require name', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalNameField.clear();
    flows.modalTypeDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    expect(flows.submitModalBtn.isEnabled()).toBeFalsy();
    flows.submitModalBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(flows.createModal.isDisplayed()).toBeTruthy();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(flows.modalErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.modalErrors.get(0).getText()).toBe('Please enter a draft name');
  });

  it('should require type', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalTypeDropdown.click();
    flows.modalNameField.clear();
    flows.modalNameField.sendKeys('Flow ' + randomFlow);

    expect(flows.submitModalBtn.isEnabled()).toBeFalsy();
    flows.submitModalBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(flows.createModal.isDisplayed()).toBeTruthy();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(flows.modalErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.modalErrors.get(0).getText()).toBe('Type is required');
  });

  it('should not accept spaces only as valid field input', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalNameField.clear();
    flows.modalNameField.sendKeys('  ');
    flows.modalTypeDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    expect(flows.submitModalBtn.isEnabled()).toBeFalsy();
    flows.submitModalBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(flows.createModal.isDisplayed()).toBeTruthy();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(flows.modalErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.modalErrors.get(0).getText()).toBe('Please enter a draft name');
  });
});
