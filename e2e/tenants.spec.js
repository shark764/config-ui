'use strict';

describe('The tenants view', function() {
  var loginPage = require('./login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('./shared.po.js'),
    tenantCount;

  beforeEach(function() {
    // Login
    browser.get(shared.loginPageUrl);
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);

    browser.get(shared.tenantsPageUrl);
    tenantCount = tenants.tenantElements.count();
  });

  it('should include list of tenants, create tenant section and standard page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavButton.getText()).toBe('Tenants');

    expect(tenants.tenantsTable.isDisplayed()).toBeTruthy();
    expect(tenants.tenantForm.isDisplayed()).toBeTruthy();
    expect(tenants.createTenantBtn.isDisplayed()).toBeTruthy();
  });

  xit('should tenant table based on search', function() {
    // TODO
  });

  it('should display tenant details when selected from table', function() {
    if (tenantCount > 0) {
      // Select first tenant from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();

      // Verify tenant name in table matches populated field
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(nameFormField).getAttribute('value');

      // Verify tenant admin in table matches populated field
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(3)')).getText()).toContain(adminFormDropDown).getAttribute('value');

      if (tenantCount > 1) {
        // Change selected tenant and ensure details are updated
        element(by.css("tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)")).click();

        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(nameFormField).getAttribute('value');
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(4)')).getText()).toContain(nameFormField).getAttribute('value');
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(3)')).getText()).toContain(adminFormDropDown).getAttribute('value');
      }
    }
  });

  xit('should list existing tenants in the navbar Tenant dropdown', function() {
    // TODO
    expect(shared.tenantsNavDropdown.all(by.repeater('tenant in tenants')).count()).toBe(tenantCount);
    for (var i = 1; i <= tenantCount; ++i) {
      expect(shared.tenantsNavDropdown.all(by.css('option')).get(i).getText()).toBe(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText());
    }
  });

  it('should change Create button to Update when editing tenant', function() {
    expect(tenants.createTenantBtn.getAttribute('value')).toBe('Create');
    if (tenantCount > 0) {
      // Select first tenant from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();
      expect(tenants.createTenantBtn.getAttribute('value')).toBe('Update');
    }
  });

  it('should allow the tenant name, region, and admin fields to be updated', function() {
    if (tenantCount > 0) {
      // Select first tenant from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();

      // Edit fields
      tenants.nameFormField.sendKeys('Edit');
      tenants.adminFormDropDown.all(by.css('option')).get(1).click();
      tenants.createTenantBtn.click();

      // TODO Verify no errors
    }
  });

  it('should require all tenant fields when editing', function() {
    if (tenantCount > 0) {
      // Select first tenant from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();

      // Clear all editable tenant fields
      tenants.nameFormField.clear();
      tenants.createTenantBtn.click();

      // TODO Verify error messages
    }
  });

  it('should not be able to edit Description or Region fields when editing', function() {
    if (tenantCount > 0) {
      // Select first tenant from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();

      // Review Description field
      expect(tenants.descriptionFormField.getAttribute('disabled')).toBe('true');
      tenants.descriptionFormField.clear();
      expect(tenants.descriptionFormField.getText()).toBeTruthy;

      // Review Region dropdown
      expect(tenants.regionFormDropDown.getAttribute('disabled')).toBe('true');
      expect(tenants.regionFormDropDown.all(by.css('option')).count()).toBe(0);
    }
  });

  xit('should validate tenant fields when editing', function() {
    // TODO Edit tenant, ensure field inputs are validated
  });

  xit('should not allow duplicate tenant names when editing', function() {
    // TODO Edit tenant, change tenant name to another existing tenants name, unable to save
  });

  xit('should ensure updates to tenants are persistant on page reload', function() {
    // TODO Edit tenant, reload page, ensure changes are persistant
  });

});
