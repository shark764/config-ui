'use strict';

describe('The flows view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    flows = require('./flows.po.js'),
    params = browser.params,
    flowCount,
    randomFlow,
    flowVersionCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.flowsPageUrl);
    flowCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include flow management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(flows.nameFormField.isDisplayed()).toBeTruthy();
    expect(flows.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(flows.typeFormDropdown.isDisplayed()).toBeTruthy();
    expect(flows.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
  });


  it('should display flow details when selected from table', function() {
    // Select first flow from table
    flows.firstTableRow.click();

    // Verify flow name in table matches populated field
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2) > span:nth-child(1)')).getText()).toContain(flows.nameFormField.getAttribute('value'));

    // Change selected flow and ensure details are updated
    shared.tableElements.count().then(function(numFlows) {
      if (numFlows > 1) {
        flows.secondTableRow.click();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2) > span:nth-child(1)')).getText()).toContain(flows.nameFormField.getAttribute('value'));
      }
    });
  });

  it('should allow the Flow fields to be updated', function() {
    flowVersionCount = flows.versionsTableElements.count().then(function(curFlowVersionCount) {
      randomFlow = Math.floor((Math.random() * 1000) + 1);
      flows.firstTableRow.click();

      // Edit fields
      flows.nameFormField.sendKeys('Edit');
      flows.descriptionFormField.sendKeys('Edit');
      var versionSelected = randomFlow % curFlowVersionCount;
      flows.activeVersionDropdown.all(by.css('option')).get(versionSelected).click();

      var editedName = flows.nameFormField.getAttribute('value');
      var editedDescription = flows.descriptionFormField.getAttribute('value');
      var editedActiveVersion = flows.activeVersionDropdown.getAttribute('value');
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        expect(flows.nameFormField.getAttribute('value')).toBe(editedName);
        expect(flows.descriptionFormField.getAttribute('value')).toBe(editedDescription);
        expect(flows.activeVersionDropdown.getAttribute('value')).toBe(editedActiveVersion);
      });
    });
  });

  it('should require name field when editing a Flow', function() {
    flows.firstTableRow.click();
    flows.nameFormField.clear();
    flows.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Please enter a name');
  });

  it('should not require description field when editing a Flow', function() {
    flows.firstTableRow.click();
    flows.descriptionFormField.clear();
    flows.nameFormField.click();

    shared.submitFormBtn.click().then(function() {
      expect(shared.tableElements.count()).toBe(flowCount);
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should reset fields after editing and selecting Cancel', function() {
    flowVersionCount = flows.versionsTableElements.count().then(function(curFlowVersionCount) {
      randomFlow = Math.floor((Math.random() * 1000) + 1);
      flows.firstTableRow.click();

      var originalName = flows.nameFormField.getAttribute('value');
      var originalDescription = flows.descriptionFormField.getAttribute('value');
      var originalActiveVersion = flows.activeVersionDropdown.getAttribute('value');
      var originalType = flows.typeFormDropdown.getAttribute('value');

      // Edit fields
      flows.nameFormField.sendKeys('Edit');
      flows.descriptionFormField.sendKeys('Edit');
      var versionSelected = randomFlow % curFlowVersionCount;
      flows.activeVersionDropdown.all(by.css('option')).get(versionSelected).click();

      shared.cancelFormBtn.click();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(flows.nameFormField.getAttribute('value')).toBe(originalName);
      expect(flows.descriptionFormField.getAttribute('value')).toBe(originalDescription);
      expect(flows.activeVersionDropdown.getAttribute('value')).toBe(originalActiveVersion);
      expect(flows.typeFormDropdown.getAttribute('value')).toBe(originalType);
    });
  });

  it('should display all flow versions in Active Version dropdown', function() {
    flows.firstTableRow.click();
    expect(flows.versionsTableElements.count()).toBe(flows.activeVersionDropdown.all(by.css('option')).count());
  });

  it('should add new flow version', function() {
    flowVersionCount = flows.versionsTableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    flows.firstTableRow.click();

    flows.versionNameFormField.sendKeys('Flow Version ' + randomFlow);
    flows.versionDescriptionFormField.sendKeys('Description for flow version ' + randomFlow);

    flows.createVersionBtn.click().then(function() {
      expect(flows.versionNameFormField.getAttribute('value')).toBe('');
      expect(flows.versionDescriptionFormField.getAttribute('value')).toBe('');
      expect(flows.versionsTableElements.count()).toBeGreaterThan(flowVersionCount);
      expect(flows.versionsTableElements.count()).toBe(flows.activeVersionDropdown.all(by.css('option')).count());
    });
  });

  it('should require name when adding a new flow version', function() {
    flowVersionCount = flows.versionsTableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    flows.firstTableRow.click();

    flows.versionNameFormField.click();
    flows.versionDescriptionFormField.sendKeys('Description for flow version ' + randomFlow);
    expect(flows.createVersionBtn.getAttribute('disabled')).toBeTruthy();

    flows.createVersionBtn.click();
    expect(flows.requiredErrors.get(3).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(3).getText()).toBe('Field \"Name\" is required.');

    expect(flows.versionsTableElements.count()).toBe(flowVersionCount);
    expect(flows.versionsTableElements.count()).toBe(flows.activeVersionDropdown.all(by.css('option')).count());
  });

  it('should not require description when adding a new flow version', function() {
    flowVersionCount = flows.versionsTableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    flows.firstTableRow.click();

    flows.versionDescriptionFormField.click();
    flows.versionNameFormField.sendKeys('Flow Version ' + randomFlow);

    flows.createVersionBtn.click().then(function() {
      expect(flows.versionNameFormField.getAttribute('value')).toBe('');
      expect(flows.versionsTableElements.count()).toBeGreaterThan(flowVersionCount);
      expect(flows.versionsTableElements.count()).toBe(flows.activeVersionDropdown.all(by.css('option')).count());
    });
  });

  it('should not accept spaces only as valid field input when creating flow version', function() {
    flowVersionCount = flows.versionsTableElements.count();
    flows.firstTableRow.click();

    flows.versionNameFormField.sendKeys(' ');
    flows.versionDescriptionFormField.sendKeys(' ');

    // Submit button is still disabled
    expect(flows.createVersionBtn.getAttribute('disabled')).toBeTruthy();
    flows.createVersionBtn.click();

    expect(flows.requiredErrors.get(3).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(3).getText()).toBe('Field \"Name\" is required.');

    expect(flows.versionsTableElements.count()).toBe(flowVersionCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});
