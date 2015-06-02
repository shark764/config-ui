'use strict';

describe('The tenants view', function() {
  var loginPage = require('./login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('./shared.po.js'),
    tenantCount,
    randomTenant;

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
    // TODO Add all components displayed on initial page load
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

      // Verify tenant status in table matches populated field
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(4)')).getText()).toContain(nameFormField).getAttribute('value');

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

  it('should change Create button to Update when editing tenant', function() {
    expect(tenants.createTenantBtn.getAttribute('value')).toBe('Create');
    if (tenantCount > 0) {
      // Select first tenant from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();
      expect(tenants.createTenantBtn.getAttribute('value')).toBe('Update');
    }
  });

  it('should list enabled existing tenants in the Parent Tenant dropdown', function() {
    // TODO ensure disabled tenants are not listed
    expect(tenants.tenantsNavDropdown.all(by.repeater('tenant in tenants')).count()).toBe(tenantCount);
    for (var i = 1; i <= tenantCount; ++i) {
      expect(tenants.tenantsNavDropdown.all(by.css('option')).get(i).getText()).toBe(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText());
    }
  });

  it('should list enabled existing tenants in the navbar Tenant dropdown', function() {
    // TODO ensure disabled tenants are not listed
    expect(shared.parentFormDropDown.all(by.repeater('tenant in tenants')).count()).toBe(tenantCount);
    for (var i = 1; i <= tenantCount; ++i) {
      expect(tenants.parentFormDropDown.all(by.css('option')).get(i).getText()).toBe(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText());
    }
  });

  it('should successfully create a new enabled tenant and add to the tenants lists', function() {
    // Add randomness to tenant details
    randomTenant = Math.floor((Math.random() * 100) + 1);
    var tenantAdded = false;

    // Complete tenant form and submit
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.statusFormToggle.click();
    tenants.regionFormDropDown.all(by.css('option')).get(1).click();
    tenants.createTenantBtn.click();

    // Confirm tenant is displayed in tenant table with correct details
    tenants.tenantElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        // Check if user name in table matches newly added user
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText().then(function(value) {
          if (value == 'Tenant ' + randomTenant) {
            tenantAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new user was found in the user table
      expect(tenantAdded).toBeTruthy();
      tenantCount++;
      expect(tenants.tenantElements.count()).toBe(tenantCount);

      // TODO Verify new tenant is added to navbar and parent tenant dropdowns
    });
  });

  it('should successfully create a new disabled tenant and add to the tenants table only', function() {
    // Add randomness to tenant details
    randomTenant = Math.floor((Math.random() * 100) + 1);
    var tenantAdded = false;

    // Complete tenant form and submit
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.regionFormDropDown.all(by.css('option')).get(1).click();
    tenants.createTenantBtn.click();

    // Confirm tenant is displayed in tenant table with correct details
    tenants.tenantElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        // Check if user name in table matches newly added user
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText().then(function(value) {
          if (value == 'Tenant ' + randomTenant) {
            tenantAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new user was found in the user table
      expect(tenantAdded).toBeTruthy();
      tenantCount++;
      expect(tenants.tenantElements.count()).toBe(tenantCount);
      // TODO Verify new tenant is added to navbar and parent tenant dropdowns
    });
  });

  it('should require all fields when creating a new tenant', function() {
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should require name when creating a new tenant', function() {
    // Complete tenant form and submit without tenant name
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.statusFormToggle.click();
    tenants.regionFormDropDown.all(by.css('option')).get(1).click();
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should require description when creating a new tenant', function() {
    randomTenant = Math.floor((Math.random() * 100) + 1);

    // Complete tenant form and submit without tenant description
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.statusFormToggle.click();
    tenants.regionFormDropDown.all(by.css('option')).get(1).click();
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should require region when creating a new tenant', function() {
    randomTenant = Math.floor((Math.random() * 100) + 1);

    // Complete tenant form and submit without tenant region
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.statusFormToggle.click();
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should not require status change when creating a new tenant', function() {
    // Add randomness to tenant details
    var randomTenant = Math.floor((Math.random() * 100) + 1);

    // Complete tenant form and submit without changing tenant status
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.regionFormDropDown.all(by.css('option')).get(1).click();
    tenants.createTenantBtn.click();

    // Confirm tenant is added without changing status
    tenantCount++;
    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  xit('should validate field input when creating a new tenant', function() {
    // TODO
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  xit('should not accept spaces only as valid field input when creating a new tenant', function() {
    // TODO
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should require unique tenant name when creating a new tenant', function() {
    if (tenantCount > 0) {
      // Attempt to create a new Tenant with the name of an existing Tenant
      tenants.tenantElements.then(function(existingTenants) {
        tenants.nameFormField.sendKeys(existingTenants[0].name);
        tenants.descriptionFormField.sendKeys('This is the tenant description for tenant');
        tenants.statusFormToggle.click();
        tenants.regionFormDropDown.all(by.css('option')).get(1).click();
        tenants.createTenantBtn.click();

        // Verify tenant is not created
        expect(tenants.tenantElements.count()).toBe(tenantCount);
        // TODO Error message displayed
      });
    }
  });


  xit('should allow the tenant fields to be updated', function() {
    // TODO Edit tenant, current tenant not listed in tenant parent list
  });

  xit('should require all tenant fields when editing', function() {
    // TODO Edit tenant, clear all fields, unable to save changes
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

  xit('should prevent the tenant parent from being set to itself while editing', function() {
    // TODO Edit tenant, current tenant not listed in tenant parent list
  });

  xit('should add enabled tenant to parent dropdown and navbar tenant dropdown', function() {
    // TODO Enable existing user
    // TODO Ensure enabled tenant is added to dropdowns
  });

  xit('should remove disabled tenant from parent dropdown and from navbar tenant dropdown', function() {
    // TODO Disable existing user
    // TODO Ensure disabled tenants are removed from dropdowns
  });

});
