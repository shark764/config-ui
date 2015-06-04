'use strict';

describe('The create new tenants view', function() {
  var loginPage = require('./login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('./shared.po.js'),
    tenantCount,
    randomTenant;

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

  it('should include supported tenant fields only', function() {
    expect(tenants.nameFormField.isDisplayed()).toBeTruthy();
    expect(tenants.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(tenants.regionFormDropDown.isDisplayed()).toBeTruthy();
    expect(tenants.adminFormDropDown.isDisplayed()).toBeTruthy();

    // The Status and Parent fields are not to be displayed for the initial Beta release
    expect(tenants.statusFormToggle.isDisplayed()).toBeFalsy();
    expect(tenants.parentFormDropDown.isDisplayed()).toBeFalsy();
  });

  it('should successfully create a new tenant and add to the tenants lists', function() {
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
      for (var i = 1; i <= rows.length; ++i) {
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
      expect(tenants.tenantElements.count()).toBeGreaterThan(tenantCount);

      // TODO Verify new tenant is added to navbar and parent tenant dropdowns
    });
  });

  it('should require field inputs when creating a new tenant', function() {
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should require name when creating a new tenant', function() {
    randomTenant = Math.floor((Math.random() * 100) + 1);

    // Complete tenant form and submit without tenant name
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.regionFormDropDown.all(by.css('option')).get(1).click();
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should require description when creating a new tenant', function() {
    randomTenant = Math.floor((Math.random() * 100) + 1);

    // Complete tenant form and submit without tenant description
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.regionFormDropDown.all(by.css('option')).get(1).click();
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should require region when creating a new tenant', function() {
    randomTenant = Math.floor((Math.random() * 100) + 1);

    // Complete tenant form and submit without tenant region
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should allow admin to be added when creating a new tenant', function() {
    // TODO ensure there is an enabled admin user available
    if (tenantCount > 0) {
      // Add randomness to tenant details
      var randomTenant = Math.floor((Math.random() * 100) + 1);

      tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
      tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
      tenants.regionFormDropDown.all(by.css('option')).get(1).click();
      tenants.adminFormDropDown.all(by.css('option')).get(1).click();
      tenants.createTenantBtn.click();

      // Confirm tenant is added
      tenantCount++;
      expect(tenants.tenantElements.count()).toBe(tenantCount);
    }
  });

  it('should validate field input when creating a new tenant', function() {
    // TODO
    tenants.createTenantBtn.click();

    expect(tenants.tenantElements.count()).toBe(tenantCount);
  });

  it('should not accept spaces only as valid field input when creating a new tenant', function() {
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

});
