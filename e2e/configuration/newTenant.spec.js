'use strict';

describe('The create new tenants view', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params,
    tenantCount,
    randomTenant;

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

  it('should include supported tenant fields only', function() {
    shared.createBtn.click();
    expect(tenants.nameFormField.isDisplayed()).toBeTruthy();
    expect(tenants.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(tenants.adminFormDropDown.isDisplayed()).toBeTruthy();

    // Defaults admin to current user
    expect(tenants.adminFormDropDown.$('option:checked').getText()).toBe(params.login.firstName + ' ' + params.login.lastName);

    // Region is not displayed when adding a new tenant, defaults to current region
    expect(tenants.region.isDisplayed()).toBeFalsy();

    // Parent tenant shown as current tenant
    shared.tenantsNavDropdown.getText().then(function(currentTenantName) {
      expect(currentTenantName).toBe(tenants.parentName.getText());
      shared.searchField.sendKeys(currentTenantName);
      tenants.parentUUID.getText().then(function(parentUUID) {
        shared.firstTableRow.click();
        expect(parentUUID).toBe(tenants.tenantUUID.getText());
      });
    });
  });

  // TODO TITAN2-7078
  xit('should successfully create a new tenant and add to the tenants table and dropdown', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);
    var tenantAdded = false;

    // Complete tenant form and submit
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm tenant is displayed in tenant table with correct details
      shared.searchField.sendKeys('Tenant ' + randomTenant);
      expect(shared.tableElements.count()).toBeGreaterThan(0);
      shared.firstTableRow.click();
      expect(shared.firstTableRow.element(by.css(tenants.parentColumn)).getText()).toBe(tenants.parentName.getText());
      shared.searchField.clear();
    }).then(function() {
      // Confirm tenant added to tenant dropdown
      shared.tenantsNavDropdown.click();
      expect(shared.tenantsNavDropdownContents.count()).toBe(shared.tableElements.count());

      shared.tenantsNavDropdownContents.then(function(tenants) {
        for (var i = 0; i < tenants.length; ++i) {
          tenants[i].getText().then(function(value) {
            if (value == 'Tenant ' + randomTenant) {
              tenantAdded = true;
            }
          });
        }
      }).then(function() {
        // Verify new tenant was found in the tenant dropdown
        expect(tenantAdded).toBeTruthy();
      });
    });
  });

// TODO TITAN2-7078
  xit('should not add new tenant to the tenants nav dropdown when current user is not selected as admin', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);
    var tenantAdded = false;

    // Complete tenant form and submit
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);

    // Select a different admin
    tenants.adminFormDropDown.all(by.css('option')).then(function(users) {
      for (var i = 0; i < users.length; i++) {
        if (users[i] != (params.login.firstName + ' ' + params.login.lastName)) {
          users[i].click();
          i = users.length;
        }
      }
    }).then(function() {
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Confirm tenant is displayed in tenant table with correct details
        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
              if (value == 'Tenant ' + randomTenant) {
                tenantAdded = true;
              }
            });
          }
        }).then(function() {
          // Verify new tenant was found in the table
          expect(tenantAdded).toBeTruthy();
          expect(shared.tableElements.count()).toBeGreaterThan(tenantCount);
        }).then(function() {
          tenantAdded = false;

          // Confirm tenant is NOT added to tenant dropdown
          shared.tenantsNavDropdown.click();

          // Tenant nav count remains the previous tenant count
          expect(shared.tenantsNavDropdownContents.count()).toBe(tenantCount);

          shared.tenantsNavDropdownContents.then(function(tenants) {
            for (var i = 0; i < tenants.length; ++i) {
              tenants[i].getText().then(function(value) {
                if (value == 'Tenant ' + randomTenant) {
                  tenantAdded = true;
                }
              });
            }
          }).then(function() {
            // Verify new tenant was NOT found in the tenant dropdown
            expect(tenantAdded).toBeFalsy();
          });
        });
      });
    });
  });

  it('should require field inputs', function() {
    shared.createBtn.click();

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(tenantCount);
  });

  it('should require name', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);

    // Complete tenant form and submit without tenant name
    tenants.nameFormField.click();
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.adminFormDropDown.all(by.css('option')).get(0).click();

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(tenants.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(tenantCount);
  });

  it('should not require a description', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);

    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.click();
    tenants.adminFormDropDown.click(); // Defaults to current user

    shared.submitFormBtn.click();

    expect(shared.successMessage.isPresent()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(tenantCount);
  });

  it('should allow admin to be selected', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);

    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.adminFormDropDown.all(by.css('option')).get(0).click();

    shared.submitFormBtn.click();

    expect(shared.successMessage.isPresent()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(tenantCount);
  });

  it('should not accept spaces only as valid field input', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);

    // Complete tenant form and submit without tenant name
    tenants.nameFormField.sendKeys(' ');
    tenants.descriptionFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(tenants.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(tenantCount);
  });

  // TODO TITAN2-7078
  xit('should not change selected navbar tenant when new tenant is created', function() {
    shared.tenantsNavDropdown.click();
    shared.tenantsNavDropdownContents.get(1).getText().then(function(selectedTenantName) {
      shared.tenantsNavDropdownContents.get(1).click();
      shared.createBtn.click();
      randomTenant = Math.floor((Math.random() * 1000) + 1);

      tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
      tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        expect(shared.tenantsNavDropdown.getText()).toBe(selectedTenantName);
      });
    });
  });

  // TODO TITAN2-5426
  xit('should successfully create sub tenants', function() {
    var grandParentTenantName = tenants.createTenant();
    tenants.selectTenant(grandParentTenantName);
    shared.createBtn.click();
    expect(tenants.parentName.getText()).toBe(grandParentTenantName);

    var parentTenantName = tenants.createTenant();
    tenants.selectTenant(parentTenantName);
    shared.createBtn.click();
    expect(tenants.parentName.getText()).toBe(grandParentTenantName);

    var childTenantName = tenants.createTenant();
    tenants.selectTenant(childTenantName);

    // Ensure all parents are shown correctly
    shared.searchField.sendKeys(parentTenantName);
    shared.firstTableRow.click();
    expect(shared.firstTableRow.element(by.css(tenants.parentColumn)).getText()).toBe(grandParentTenantName);
    expect(tenants.parentName.getText()).toBe(grandParentTenantName);

    shared.searchField.clear();
    shared.searchField.sendKeys(childTenantName);
    shared.firstTableRow.click();
    expect(shared.firstTableRow.element(by.css(tenants.parentColumn)).getText()).toBe(parentTenantName);
    expect(tenants.parentName.getText()).toBe(parentTenantName);
  });

});
