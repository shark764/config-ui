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
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
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
      if (curFlowVersionCount > 0) {
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
      }
    });
  });

  it('should require name field when editing a Flow', function() {
    flows.firstTableRow.click();
    flows.nameFormField.clear();
    flows.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(shared.tableElements.count()).toBe(flowCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Please enter a name');
  });

  it('should require unique name when editing a Flow', function() {
    shared.tableElements.count().then(function(flowCount) {
      if (flowCount > 1) {
        flows.firstTableRow.element(by.css(flows.nameColumn)).getText().then(function(existingFlowName) {
          flows.secondTableRow.click();

          flows.nameFormField.clear();
          flows.nameFormField.sendKeys(existingFlowName);

          shared.submitFormBtn.click().then(function() {
            expect(shared.successMessage.isPresent()).toBeFalsy();
            expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
            expect(flows.requiredErrors.get(0).getText()).toBe('resource with the same value already exists in the system');

            flows.nameFormField.sendKeys('update');
            expect(flows.requiredErrors.count()).toBe(0);
            expect(shared.submitFormBtn.isEnabled()).toBeTruthy();
          });
        });
      }
    });
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
      if (curFlowVersionCount > 0) {
        flows.activeVersionDropdown.all(by.css('option')).get(versionSelected + 1).click();
      }
      flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();

      shared.cancelFormBtn.click();

      // Warning message is displayed
      shared.waitForAlert();
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

    flows.versionsTableElements.then(function(versionTableRows) {
      for (var i = 0; i < versionTableRows.length; i++) {
        expect(flows.activeVersionDropdownOptions.get(i + 1).getText()).toContain(versionTableRows[i].element(by.css('td:nth-child(1)')).getText());
        expect(flows.activeVersionDropdownOptions.get(i + 1).getText()).toContain(versionTableRows[i].element(by.css('td:nth-child(2)')).getText());
      }
    });
  });

  it('should display button to add new flow version and correct fields', function() {
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
    flows.cancelVersionFormBtn.click().then(function() {
      expect(flows.showCreateNewVersionBtn.isDisplayed()).toBeTruthy();
      expect(flows.versionNameFormField.isDisplayed()).toBeFalsy();
      expect(flows.versionDescriptionFormField.isDisplayed()).toBeFalsy();
      expect(flows.cancelVersionFormBtn.isDisplayed()).toBeFalsy();
      expect(flows.createVersionFormBtn.isDisplayed()).toBeFalsy();
    });
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
      flows.versionsTableElements.then(function(versionTableRows) {
        for (var i = 0; i < versionTableRows.length; i++) {
          expect(flows.activeVersionDropdownOptions.get(i + 1).getText()).toContain(versionTableRows[i].element(by.css('td:nth-child(1)')).getText());
          expect(flows.activeVersionDropdownOptions.get(i + 1).getText()).toContain(versionTableRows[i].element(by.css('td:nth-child(2)')).getText());
        }
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

    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');

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

    expect(flows.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(flows.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');

    expect(flows.versionsTableElements.count()).toBe(flowVersionCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  // Tests for TITAN2-6697 - Active version only required when Flow has published versions
  it('should not require Active Version when flow has no versions', function() {
    var flowAdded = false;
    randomFlow = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    flows.modalNameField.clear();
    flows.modalNameField.sendKeys('Flow ' + randomFlow);
    flows.modalTypeDropdown.click();
    flows.customerTypeOption.click();
    flows.submitModalBtn.click().then(function() {
      flows.waitForFlowDesignerRedirect();
      browser.get(shared.flowsPageUrl);
      shared.searchField.sendKeys('Flow ' + randomFlow);
      shared.firstTableRow.click();

      // Active Version dropdown is disabled
      expect(flows.activeVersionDropdown.isEnabled()).toBeFalsy();
      expect(flows.versionsTableElements.count()).toBe(0);

      // TODO Fails due to TITAN2-7448
      // Edit newly created flow
      /*flows.nameFormField.sendKeys('Edit');
      shared.submitFormBtn.click().then(function() {
        shared.waitForSuccess();
      });*/
    });
  });

  // Tests for TITAN2-6697 - Active version only required when Flow has published versions
  it('should require Active Version when flow has versions', function() {
    // NOTE: Uses flow from previous test
    shared.searchField.sendKeys('Flow ' + randomFlow);
    shared.firstTableRow.click();

    // Active Version dropdown is disabled
    expect(flows.activeVersionDropdown.isEnabled()).toBeFalsy();
    expect(flows.versionsTableElements.count()).toBe(0);

    // Create Version
    flows.showCreateNewVersionBtn.click();
    flows.versionNameFormField.sendKeys('Version 1');
    flows.createVersionFormBtn.click().then(function() {
      shared.waitForSuccess();

      // Active Version field is enabled and required
      expect(flows.activeVersionDropdown.isEnabled()).toBeTruthy();
      expect(flows.versionsTableElements.count()).toBe(1);

      // Edit newly created flow
      flows.nameFormField.sendKeys('Edit');
      expect(shared.submitFormBtn.isEnabled()).toBeFalsy();

      // Select Active Version to save Flow
      flows.activeVersionDropdown.all(by.css('option')).get(1).click();
      shared.submitFormBtn.click().then(function() {
        shared.waitForSuccess();
      });
    });
  });
});
