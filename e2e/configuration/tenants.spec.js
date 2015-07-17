'use strict';

describe('The tenants view', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('../shared.po.js'),
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

  it('should include list of tenants, create tenant section and standard page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavButton.getText()).toBe('Configuration');

    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide side panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Tenant Management');
  });

  it('should display tenant details when selected from table', function() {
    tenants.firstTableRow.click();

    // Verify tenant name in table matches populated field
    expect(tenants.firstTableRow.element(by.css(tenants.nameColumn)).getText()).toContain(tenants.nameFormField.getAttribute('value'));
    expect(tenants.region.isDisplayed()).toBeTruthy();

    tenants.secondTableRow.isPresent().then(function(secondRowExists) {
      if (secondRowExists) {
        // Change selected tenant and ensure details are updated
        tenants.secondTableRow.click();

        expect(tenants.secondTableRow.element(by.css(tenants.nameColumn)).getText()).toContain(tenants.nameFormField.getAttribute('value'));
        expect(tenants.region.isDisplayed()).toBeTruthy();
      }
    });
  });

  it('should require name field when editing', function() {
    tenants.firstTableRow.click();

    tenants.nameFormField.clear();
    tenants.descriptionFormField.click();
    shared.submitFormBtn.click();

    expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(tenants.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description when editing', function() {
    tenants.firstTableRow.click();

    // Edit fields
    tenants.descriptionFormField.sendKeys('Edit');
    tenants.descriptionFormField.clear();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  xit('should not require admin when editing', function() {
    // TODO Fails from existing bug
    tenants.firstTableRow.click();

    // Edit fields
    tenants.adminFormDropDown.all(by.css('option')).get(0).click();
    tenants.descriptionFormField.click();

    expect(tenants.adminFormDropDown.getAttribute('value')).toBe('');
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should reset fields after editing and selecting Cancel', function() {
    tenants.firstTableRow.click();

    var originalName = tenants.nameFormField.getAttribute('value');
    var originalDescription = tenants.descriptionFormField.getAttribute('value');
    var originalAdmin = tenants.adminFormDropDown.getAttribute('value');

    // Edit fields
    tenants.nameFormField.sendKeys('Edit');
    tenants.descriptionFormField.sendKeys('Edit');
    tenants.adminFormDropDown.all(by.css('option')).get(1).click();

    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();
    
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(tenants.nameFormField.getAttribute('value')).toBe(originalName);
    expect(tenants.descriptionFormField.getAttribute('value')).toBe(originalDescription);
    expect(tenants.adminFormDropDown.getAttribute('value')).toBe(originalAdmin);
  });

  it('should allow the tenant name, description and admin fields to be updated', function() {
    tenants.firstTableRow.click();

    // Edit fields
    tenants.nameFormField.sendKeys('Edit');
    tenants.descriptionFormField.sendKeys('Edit');
    tenants.adminFormDropDown.all(by.css('option')).get(1).click();
    shared.submitFormBtn.click().then(function() {
      expect(tenants.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });
});
