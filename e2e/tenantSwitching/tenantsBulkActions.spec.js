'use strict';

describe('The tenants view bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    params = browser.params,
    tenantCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    // Ensure tenant exists that can be edited
    browser.get(shared.tenantsPageUrl);
    shared.createBtn.click();
    var randomTenant = Math.floor((Math.random() * 1000) + 1);
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.tenantsPageUrl);
    tenantCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });


  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(1);

    // Enable Tenants
    expect(bulkActions.selectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableToggle.isDisplayed()).toBeTruthy();
  });

  xit('should allow all selected tenant\'s status to be Disabled', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected
    tenantCount = shared.tableElements.count();

    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Form reset
      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

      // All tenants are set to disabled
      // Select Disabled from Status drop down
      bulkActions.statusColumnDropDown.click();
      bulkActions.statuses.get(0).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(tenantCount);
      });

      // Select Enabled from Status drop down
      bulkActions.statuses.get(0).click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(0);
      });
    });
  });

  xit('should allow all selected tenant\'s status to be Enabled', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected
    tenantCount = shared.tableElements.count();

    // Update All bulk actions
    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableToggleClick.click();

    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeFalsy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
    bulkActions.confirmOK.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Form reset
      expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

      // All tenants are set to enabled
      // Select Disabled from Status drop down
      bulkActions.statusColumnDropDown.click();
      bulkActions.statuses.get(0).click();
      shared.tableElements.count().then(function(disabledTotal) {
        expect(disabledTotal).toBe(0);
      });

      // Select Enabled from Status drop down
      bulkActions.statuses.get(0).click();
      bulkActions.statuses.get(1).click();
      shared.tableElements.count().then(function(enabledTotal) {
        expect(enabledTotal).toBe(tenantCount);
      });
    });
  });

  it('should ignore disabled fields on update', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected
    tenantCount = shared.tableElements.count();

    shared.actionsBtn.click();
    bulkActions.selectAllTableHeader.click();

    bulkActions.selectEnable.click();
    bulkActions.enableToggle.click();

    // Disable Enable toggle
    bulkActions.selectEnable.click();
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

    // No bulk actions to perform
    expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    bulkActions.submitFormBtn.click();

    expect(bulkActions.confirmModal.isPresent()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  xit('should only affect selected tenants', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected

    shared.tableElements.then(function(originalTenants) {
      // Select odd tenants and leave even tenants unselected
      for (var i = 0; i < originalTenants.length; i++) {
        if (i % 2 > 0) {
          bulkActions.selectItemTableCells.get(i).click();
        }
      }
      shared.actionsBtn.click();
      bulkActions.selectAllTableHeader.click();

      // Disable selected Tenants
      bulkActions.selectEnable.click();

      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess();

        // Form reset
        expect(bulkActions.submitFormBtn.getAttribute('disabled')).toBeTruthy();
        expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

        // Only selected tenants are updated
        shared.tableElements.then(function(updatedTenants) {
          for (var i = 0; i < originalTenants.length; i++) {
            if (i % 2 > 0) {
              // Tenant was updated to Disabled
              expect(shared.tableElements.get(i).getText()).toContain('Disabled');
            } else {
              // Tenant status remains unchanged
              expect(shared.tableElements.get(i).getText()).toBe(updatedTenants[i].getText());
            }
          }
        });
      });
    });
  });

});
