'use strict';

describe('The flows view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    flows = require('./flows.po.js'),
    params = browser.params,
    flowCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
    var randomFlow = Math.floor((Math.random() * 1000) + 1);

    // Create new flow
    browser.get(shared.flowsPageUrl);
    shared.createBtn.click();
    flows.modalNameField.sendKeys('Flow ' + randomFlow);
    flows.modalTypeDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
    flows.submitModalBtn.click().then(function() {
      flows.waitForFlowDesignerRedirect();
      expect(browser.getCurrentUrl()).toContain('/flows/editor');

      browser.get(shared.flowsPageUrl);
    });
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


  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(1);

    // Enable Flows
    expect(bulkActions.selectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableDropdown.isDisplayed()).toBeTruthy();
  });

  it('should allow all selected flow\'s status to be Disabled', function() {
    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.disableDropdownOption.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      //expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // All flows are set to disabled
      // Leave Disabled selected from Status drop down
      bulkActions.statusColumnDropDownLabel.click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(flowCount);
      });

      // Select Enabled from Status drop down
      bulkActions.statuses.get(0).click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(0);
      });
    });
  });

  it('should allow all selected flow\'s status to be Enabled', function() {
    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableDropdownOption.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      shared.waitForSuccess();

      // All flows are set to enabled
      // Leave Disabled selected from Status drop down
      bulkActions.statusColumnDropDownLabel.click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(0);
      });

      // Select Enabled from Status drop down
      bulkActions.statuses.get(0).click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(flowCount);
      });
    });
  });

  it('should ignore disabled fields on update', function() {
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableDropdownOption.click();

    // Disable Enable toggle
    bulkActions.selectEnable.click();
    expect(bulkActions.enableDropdown.getAttribute('disabled')).toBeTruthy();

    // No bulk actions to perform
    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isPresent()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should only affect selected flows', function() {
    shared.tableElements.then(function(originalFlows) {
      // Select odd flows and leave even flows unselected
      for (var i = 0; i < originalFlows.length; i++) {
        if (i % 2 > 0 && i < 10) {
          bulkActions.selectItemTableCells.get(i).click();
        }
      }
      shared.actionsBtn.click();
      bulkActions.selectAllTableHeader.click();

      // Disable selected Flows
      bulkActions.selectEnable.click();
      bulkActions.disableDropdownOption.click();

      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        //expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Only selected flows are updated
        for (var i = 0; i < originalFlows.length; i++) {
          if (i % 2 > 0 && i < 10) {
            // Flow was updated to Disabled
            expect(shared.tableElements.get(i).getText()).toContain('Disabled');
          } else {
            // Flow status remains unchanged
            expect(shared.tableElements.get(i).getText()).toBe(originalFlows[i].getText());
          }
        }
      });
    });
  });

});
