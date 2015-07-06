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
    browser.get(shared.flowsPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include supported flow fields only', function() {
    shared.createBtn.click();
    expect(flows.nameFormField.isDisplayed()).toBeTruthy();
    expect(flows.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(flows.typeFormDropdown.isDisplayed()).toBeTruthy();
  });

  it('should add new flow to table', function() {
    var flowAdded = false;
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    shared.submitFormBtn.click();

    // Confirm flow is displayed in flow list with correct details
    shared.tableElements.then(function(flowsList) {
      for (var i = 1; i <= flowsList.length; ++i) {
        // Check if flow name in table matches newly added flow
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > span:nth-child(1)')).getText().then(function(value) {
          if (value == 'Flow ' + randomFlow) {
            flowAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new flow was found in the table
      expect(flows.requiredErrors.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(flowAdded).toBeTruthy();
    });
  });

  it('should create a default version', function() {
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    shared.submitFormBtn.click().then(function() {
      expect(flows.requiredErrors.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      expect(flows.activeVersionDropdown.getAttribute('value')).toBe('0');
      expect(flows.versionsTableElements.count()).toBe(1);
      expect(flows.versionsTableElements.get(0).getText()).toContain('v1');
    });
  });

  it('should require field inputs', function() {
    flowCount = shared.tableElements.count();
    shared.createBtn.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require name', function() {
    flowCount = shared.tableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Complete flow form and submit without flow name
    flows.nameFormField.click();
    flows.descriptionFormField.sendKeys('This is the flow description for flow ' + randomFlow);
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description', function() {
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

  it('should require type', function() {
    flowCount = shared.tableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Complete flow form and submit without flow type
    flows.typeFormDropdown.click();
    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.descriptionFormField.sendKeys('This is the flow description for flow ' + randomFlow);

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(flows.requiredErrors.get(1).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(1).getText()).toBe('Type is required');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not accept spaces only as valid field input', function() {
    flowCount = shared.tableElements.count();
    shared.createBtn.click();
    flows.nameFormField.sendKeys(' ');
    flows.descriptionFormField.sendKeys(' ');
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Please enter a name');
    expect(shared.tableElements.count()).toBe(flowCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should clear fields on Cancel', function() {
    flowCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    flows.nameFormField.sendKeys('Flow Name');
    flows.descriptionFormField.sendKeys('Flow Description');
    flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    shared.cancelFormBtn.click();

    // New skill is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(flowCount);

    // Form fields are cleared and reset to default
    expect(flows.nameFormField.getAttribute('value')).toBe('');
    expect(flows.descriptionFormField.getAttribute('value')).toBe('');
    expect(flows.typeFormDropdown.getAttribute('value')).toBe('');
  });
});