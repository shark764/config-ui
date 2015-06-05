'use strict';

describe('The tenants view', function() {
  var loginPage = require('./login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('./shared.po.js'),
    tenantCount;

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.tenantsPageUrl);
    tenantCount = tenants.tenantElements.count();
  });

  afterAll(function(){
    shared.tearDown();
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

      expect(tenants.region.isDisplayed()).toBeTruthy();

      if (tenantCount > 1) {
        // Change selected tenant and ensure details are updated
        element(by.css("tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)")).click();

        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(nameFormField).getAttribute('value');
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(4)')).getText()).toContain(nameFormField).getAttribute('value');
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(3)')).getText()).toContain(adminFormDropDown).getAttribute('value');
        expect(tenants.region.isDisplayed()).toBeTruthy();
      }
    }
  });

  it('should list existing tenants in the navbar Tenant dropdown', function() {
    shared.tenantsNavDropdown.all(by.css('option')).get(1).click();
    expect(shared.tenantsNavDropdown.all(by.css('option')).count()).toBe(tenantCount);
    for (var i = 1; i <= tenantCount; ++i) {
      expect(shared.tenantsNavDropdown.all(by.css('option')).get(i).getText()).toBe(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText());
    }
  });

  it('should allow the tenant name and admin fields to be updated', function() {
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

      // Review Region label
      expect(tenants.region.getText()).toBeTruthy;
      expect(tenants.region.all(by.css('option')).count()).toBe(0);
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
