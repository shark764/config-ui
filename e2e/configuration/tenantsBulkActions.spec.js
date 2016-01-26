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

  // TODO TITAN2-7078
  it('should allow updates to supported bulk action fields', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionDivs.count()).toBe(1);

    // Enable Tenants
    expect(bulkActions.selectEnable.isDisplayed()).toBeTruthy();
    expect(bulkActions.enableDropdown.isDisplayed()).toBeTruthy();
  });

  it('should ignore disabled fields on update', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected
    tenantCount = shared.tableElements.count();

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

  it('should only affect selected tenants when disabling', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected

    shared.tableElements.then(function(originalTenants) {
      // Select odd tenants and leave even tenants unselected
      for (var i = 0; i < originalTenants.length && i < 10; i++) {
        if (i % 2 > 0) {
          bulkActions.selectItemTableCells.get(i).click();
        }
      }
      shared.actionsBtn.click();

      // Disable selected Tenants
      bulkActions.selectEnable.click();
      bulkActions.disableDropdownOption.click();

      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess();

        // Only selected tenants are updated
        shared.tableElements.then(function(updatedTenants) {
          for (var i = 0; i < originalTenants.length && i < 10; i++) {
            if (i % 2 > 0) {
              // Tenant was updated to Disabled
              expect(shared.tableElements.get(i).getText()).toContain('Disabled');
            } else {
              // Tenant status remains unchanged
              expect(shared.tableElements.get(i).getText()).toBe(originalTenants[i].getText());
            }
          }
        });
      });
    });
  });

  it('should only affect selected tenants when enabling', function() {
    shared.searchField.sendKeys('Tenant'); // Ensure Platform tenant is not selected

    shared.tableElements.then(function(originalTenants) {
      // Select odd tenants and leave even tenants unselected
      for (var i = 0; i < originalTenants.length && i < 10; i++) {
        if (i % 2 > 0) {
          bulkActions.selectItemTableCells.get(i).click();
        }
      }
      shared.actionsBtn.click();

      // Enable selected Tenants
      bulkActions.selectEnable.click();
      bulkActions.enableDropdownOption.click();

      bulkActions.submitFormBtn.click();

      expect(bulkActions.confirmModal.isDisplayed()).toBeTruthy();
      bulkActions.confirmOK.click().then(function() {
        shared.waitForSuccess();

        // Only selected tenants are updated
        shared.tableElements.then(function(updatedTenants) {
          for (var i = 0; i < originalTenants.length && i < 10; i++) {
            if (i % 2 > 0) {
              // Tenant was updated to Disabled
              expect(shared.tableElements.get(i).getText()).toContain('Enabled');
            } else {
              // Tenant status remains unchanged
              expect(shared.tableElements.get(i).getText()).toBe(originalTenants[i].getText());
            }
          }
        });
      });
    });
  });

});
