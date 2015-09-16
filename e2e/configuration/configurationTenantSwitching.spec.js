'use strict';

describe('When switching tenants', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('../shared.po.js'),
    integrations = require('./integrations.po.js'),
    params = browser.params,
    elementCount,
    defaultTenantName,
    defaultTenantDropdownItem,
    defaultTenantElementList = [],
    newTenantName;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.tenantsPageUrl);
    shared.tenantsNavDropdown.getText().then(function(selectTenantNav) {
      defaultTenantName = selectTenantNav;
    });

    // Create new Tenant that all tests will use; admin defaults to current user
    newTenantName = tenants.createTenant();
    tenants.selectTenant(newTenantName);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('the selected tenant should be shown as the current tenant in the navigation Tenant Dropdown', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavDropdown.isDisplayed()).toBeTruthy();

    shared.tenantsNavDropdown.click();
    shared.tenantsNavDropdownContents.count().then(function(tenantCount) {
      for (var i = 0; i < tenantCount.length; i++) {
        // Select each tenant in turn and verify that the tenant dropdown shows the tenant as selected
        shared.tenantsNavDropdownContents.get(i).click();

        // Dropdown closes, so get selected tenant name from corresponding row in tenant table
        expect(shared.tableElements.get(i).getText()).toBe(shared.tenantsNavDropdown.getText());
        shared.tenantsNavDropdown.click();
      }
    });
  });

  describe('Integration Management page', function() {
    beforeAll(function() {
      browser.get(shared.integrationsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Integrations for the current tenant', function() {
      // TODO Determine which Integrations should be added by default
      expect(elementCount).toBe(1);

      expect(shared.tableRows.get(0).getText()).toBe('twilio Disabled');
    });

    it('should edit details for an Integration in one and not the previous', function() {
      shared.searchField.sendKeys('twilio');
      shared.firstTableRow.click();

      // Edit twilio integration for the new tenant
      integrations.accountSIDFormField.sendKeys('NewTenantSID');
      integrations.authTokenFormField.sendKeys('NewTenantAuthToken');
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify changes are not made to twilio integration in default tenant
        tenants.selectTenant(defaultTenantName);
        shared.searchField.sendKeys('twilio');
        shared.firstTableRow.click();

        expect(integrations.accountSIDFormField.getAttribute('value')).not.toContain('NewTenantSID');
        expect(integrations.authTokenFormField.getAttribute('value')).not.toContain('NewTenantAuthToken');
      });
    });
  });
});
