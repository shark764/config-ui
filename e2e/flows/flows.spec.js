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
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.flowsPageUrl);
    flowCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include flow management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    //Right panel is hidden by default
    expect(shared.detailsForm.isDisplayed()).toBeFalsy();
  });


  it('should display flow details when selected from table', function() {
    // Select first flow from table
    shared.firstTableRow.click();

    // Verify flow name in table matches populated field
    expect(shared.firstTableRow.getText()).toContain(flows.nameFormField.getAttribute('value'));

    // Change selected flow and ensure details are updated
    shared.tableElements.count().then(function(numFlows) {
      if (numFlows > 1) {
        flows.secondTableRow.click();
        expect(shared.secondTableRow.getText()).toContain(flows.nameFormField.getAttribute('value'));
      }
    });
  });

  it('should allow the Flow fields to be updated', function() {
    shared.firstTableRow.click();
    
    flows.versionsTableElements.count().then(function(curFlowVersionCount) {
      randomFlow = Math.floor((Math.random() * 1000) + 1);

      // Edit fields
      flows.nameFormField.sendKeys('Edit');
      flows.descriptionFormField.sendKeys('Edit');
      var versionSelected = randomFlow % curFlowVersionCount;
      flows.activeVersionDropdown.all(by.css('option')).get(versionSelected + 1).click();
      flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

      var editedName = flows.nameFormField.getAttribute('value');
      var editedDescription = flows.descriptionFormField.getAttribute('value');
      var editedActiveVersion = flows.activeVersionDropdown.getAttribute('value');
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Changes persist
        browser.refresh();
        shared.firstTableRow.click();
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
    shared.firstTableRow.click();

    flows.versionsTableElements.count().then(function(curFlowVersionCount) {
      randomFlow = Math.floor((Math.random() * 1000) + 1);

      var originalName = flows.nameFormField.getAttribute('value');
      var originalDescription = flows.descriptionFormField.getAttribute('value');
      var originalActiveVersion = flows.activeVersionDropdown.getAttribute('value');
      var originalType = flows.typeFormDropdown.getAttribute('value');

      // Edit fields
      flows.nameFormField.sendKeys('Edit');
      flows.descriptionFormField.sendKeys('Edit');
      var versionSelected = randomFlow % curFlowVersionCount;
      flows.activeVersionDropdown.all(by.css('option')).get(versionSelected + 1).click();
      flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

      shared.cancelFormBtn.click();

      // Warning message is displayed
      var alertDialog = browser.switchTo().alert();
      expect(alertDialog.accept).toBeDefined();
      expect(alertDialog.dismiss).toBeDefined();
      alertDialog.accept();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(flows.nameFormField.getAttribute('value')).toBe(originalName);
      expect(flows.descriptionFormField.getAttribute('value')).toBe(originalDescription);
      expect(flows.activeVersionDropdown.getAttribute('value')).toBe(originalActiveVersion);
      expect(flows.typeFormDropdown.getAttribute('value')).toBe(originalType);
    });
  });

  it('should display all flow versions in Active Version dropdown', function() {
    shared.firstTableRow.click();
    flows.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
      for (var i = 1; i < dropdownVersions.length; ++i) {
        expect(flows.versionsTableElements.get(i - 1).getText()).toContain(flows.activeVersionDropdown.all(by.css('option')).get(i).getText());
      };
    });
  });

  it('should display button to new flow version and correct fields', function() {
    shared.firstTableRow.click();

    // Create Flow version details not displayed be default
    expect(flows.showCreateNewVersionBtn.isDisplayed()).toBeTruthy();
    expect(flows.versionNameFormField.isDisplayed()).toBeFalsy();
    expect(flows.versionDescriptionFormField.isDisplayed()).toBeFalsy();
    expect(flows.cancelVersionFormBtn.isDisplayed()).toBeFalsy();
    expect(flows.createVersionFormBtn.isDisplayed()).toBeFalsy();

    flows.showCreateNewVersionBtn.click();
    expect(flows.showCreateNewVersionBtn.isDisplayed()).toBeFalsy();
    expect(flows.versionNameFormField.isDisplayed()).toBeTruthy();
    expect(flows.versionDescriptionFormField.isDisplayed()).toBeTruthy();
    expect(flows.cancelVersionFormBtn.isDisplayed()).toBeTruthy();
    expect(flows.createVersionFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should hide flow version fields on cancel', function() {
    shared.firstTableRow.click();
    flows.showCreateNewVersionBtn.click();
    expect(flows.showCreateNewVersionBtn.isDisplayed()).toBeFalsy();
    expect(flows.versionNameFormField.isDisplayed()).toBeTruthy();
    expect(flows.versionDescriptionFormField.isDisplayed()).toBeTruthy();
    expect(flows.cancelVersionFormBtn.isDisplayed()).toBeTruthy();
    expect(flows.createVersionFormBtn.isDisplayed()).toBeTruthy();

    // Create Flow version details no longer displayed after selecting Cancel
    flows.cancelVersionFormBtn.click();
    expect(flows.showCreateNewVersionBtn.isDisplayed()).toBeTruthy();
    expect(flows.versionNameFormField.isDisplayed()).toBeFalsy();
    expect(flows.versionDescriptionFormField.isDisplayed()).toBeFalsy();
    expect(flows.cancelVersionFormBtn.isDisplayed()).toBeFalsy();
    expect(flows.createVersionFormBtn.isDisplayed()).toBeFalsy();
  });

  it('should add new flow version', function() {
    flowVersionCount = flows.versionsTableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    flows.firstTableRow.click();
    flows.showCreateNewVersionBtn.click();

    flows.versionNameFormField.sendKeys('Flow Version ' + randomFlow);
    flows.versionDescriptionFormField.sendKeys('Description for flow version ' + randomFlow);

    flows.createVersionFormBtn.click().then(function() {
      expect(flows.versionNameFormField.getAttribute('value')).toBe('');
      expect(flows.versionDescriptionFormField.getAttribute('value')).toBe('');
      expect(flows.versionsTableElements.count()).toBeGreaterThan(flowVersionCount);
      flows.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
        for (var i = 1; i < dropdownVersions.length; ++i) {
          expect(flows.versionsTableElements.get(i - 1).getText()).toContain(flows.activeVersionDropdown.all(by.css('option')).get(i).getText());
        };
      });
    });
  });

  it('should require name when adding a new flow version', function() {
    flows.firstTableRow.click();
    flowVersionCount = flows.versionsTableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    flows.showCreateNewVersionBtn.click();

    flows.versionNameFormField.click();
    flows.versionDescriptionFormField.sendKeys('Description for flow version ' + randomFlow);
    expect(flows.createVersionFormBtn.getAttribute('disabled')).toBeTruthy();

    flows.createVersionFormBtn.click();
    expect(flows.requiredErrors.get(3).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(3).getText()).toBe('Field \"Name\" is required.');

    expect(flows.versionsTableElements.count()).toBe(flowVersionCount);
  });

  it('should not require description when adding a new flow version', function() {
    flowVersionCount = flows.versionsTableElements.count();
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    flows.firstTableRow.click();
    flows.showCreateNewVersionBtn.click();

    flows.versionDescriptionFormField.click();
    flows.versionNameFormField.sendKeys('Flow Version ' + randomFlow);

    flows.createVersionFormBtn.click().then(function() {
      expect(flows.versionNameFormField.getAttribute('value')).toBe('');
      expect(flows.versionsTableElements.count()).toBeGreaterThan(flowVersionCount);
    });
  });

  it('should not accept spaces only as valid field input when creating flow version', function() {
    flows.firstTableRow.click();
    flowVersionCount = flows.versionsTableElements.count();
    flows.showCreateNewVersionBtn.click();

    flows.versionNameFormField.sendKeys(' ');
    flows.versionDescriptionFormField.sendKeys(' ');

    // Submit button is still disabled
    expect(flows.createVersionFormBtn.getAttribute('disabled')).toBeTruthy();
    flows.createVersionFormBtn.click();

    expect(flows.requiredErrors.get(3).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(3).getText()).toBe('Field \"Name\" is required.');

    expect(flows.versionsTableElements.count()).toBe(flowVersionCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });
});
