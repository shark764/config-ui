'use strict';

describe('The dispatchMappings view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    dispatchMappings = require('./dispatchMappings.po.js'),
    flows = require('./flows.po.js'),
    params = browser.params,
    dispatchMappingCount;

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


  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(1);

    // Enable Dispatch Mappings
    expect(bulkActions.selectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableDropdown.isDisplayed()).toBeTruthy();
  });

  it('should allow all selected dispatchMapping\'s status to be Disabled', function() {
    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.disableDropdownOption.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // All dispatchMappings are set to disabled
      // Leave Disabled selected from Status drop down
      bulkActions.statusColumnDropDownLabel.click();
      dispatchMappings.statuses.get(1).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(dispatchMappingCount);
      });

      // Select Enabled from Status drop down
      dispatchMappings.statuses.get(0).click();
      dispatchMappings.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(0);
      });
    });
  });

  it('should allow all selected dispatchMapping\'s status to be Enabled', function() {
    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableDropdownOption.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // All dispatchMappings are set to enabled
      // Leave Disabled selected from Status drop down
      bulkActions.statusColumnDropDownLabel.click();
      dispatchMappings.statuses.get(1).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(0);
      });

      // Select Enabled from Status drop down
      dispatchMappings.statuses.get(0).click();
      dispatchMappings.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(dispatchMappingCount);
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

  it('should only affect selected dispatchMappings', function() {
    shared.tableElements.then(function(originalDispatchMappings) {
      // Select odd dispatchMappings and leave even dispatchMappings unselected
      for (var i = 0; i < originalDispatchMappings.length; i++) {
        if (i % 2 > 0) {
          bulkActions.selectItemTableCells.get(i).click();
        }
      }
      shared.actionsBtn.click();
      bulkActions.selectAllTableHeader.click();

      // Disable selected Dispatch Mappings
      bulkActions.selectEnable.click();
      bulkActions.disableDropdownOption.click();

      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Only selected dispatchMappings are updated
        for (var i = 0; i < originalDispatchMappings.length; i++) {
          if (i % 2 > 0) {
            // Dispatch Mapping was updated to Disabled
            expect(shared.tableElements.get(i).getText()).toContain('Disabled');
          } else {
            // Dispatch Mapping status remains unchanged
            expect(shared.tableElements.get(i).getText()).toBe(originalDispatchMappings[i].getText());
          }
        }
      });
    });
  });

});
