'use strict';

describe('The tenants view', function() {
  var loginPage = require('pages.po.js'),
    tenants = require('tenants.po.js'),
    shared = require('shared.po.js');

  beforeEach(function() {
    browser.get('http://localhost:3000/#/login');
    // Login
    emailLogin.sendKeys('test@test.com');
    passwordLogin.sendKeys('testpassword');
    loginButton.click();

    browser.get('http://localhost:3000/#/tenants');
  });

  it('should include list of tenants, create tenant section and standard page components', function() {
    expect(navBar.isDisplayed()).toBeTruthy();
    expect(element(by.css('ul.ng-scope > li:nth-child(4)')).getText()).toBe('Tenants');
    // TODO Determine what should be displayed on initial page load

    // Tenants table columns
    // Create Tenant fields
  });

  xit('should display table of existing tenants', function() {
    // TODO
  });

  xit('should list valid regions in the Region dropdown', function() {
    // TODO
  });

  xit('should list existing tenants in the Parent Tenant dropdown', function() {
    // TODO
  });

  xit('should successfully create a new tenant and add to the tenants table', function() {
    // TODO
  });

  xit('should require all fields when creating a new tenant', function() {
    // TODO
  });

  xit('should validate field input when creating a new tenant', function() {
    // TODO
  });




});
