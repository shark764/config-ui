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

    // Region is not displayed when adding a new user, defaults to current region
    expect(tenants.region.isPresent()).toBeFalsy();
  });

  it('should successfully create a new tenant and add to the tenants lists', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);
    var tenantAdded = false;

    // Complete tenant form and submit
    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.sendKeys('This is the tenant description for tenant ' + randomTenant);
    shared.submitFormBtn.click();

    // Confirm tenant is displayed in tenant table with correct details
    shared.tableElements.then(function(rows) {
      for (var i = 1; i <= rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > span:nth-child(1)')).getText().then(function(value) {
          if (value == 'Tenant ' + randomTenant) {
            tenantAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new tenant was found in the table
      expect(tenantAdded).toBeTruthy();
      expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(tenantCount);
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
    tenants.adminFormDropDown.all(by.css('option')).get(1).click();

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(tenants.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(tenantCount);
  });

  it('should not require a description or admin', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);

    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.descriptionFormField.click();
    tenants.adminFormDropDown.click();

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeFalsy();

    expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(tenantCount);
  });

  it('should allow admin to be added', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);

    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);
    tenants.adminFormDropDown.all(by.css('option')).get(1).click();

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeFalsy();

    expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(tenantCount);
  });

  it('should not require an admin', function() {
    shared.createBtn.click();
    randomTenant = Math.floor((Math.random() * 1000) + 1);

    tenants.nameFormField.sendKeys('Tenant ' + randomTenant);

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeFalsy();

    expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(tenantCount);

    expect(tenants.adminFormDropDown.getAttribute('value')).toBe("");
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
});
