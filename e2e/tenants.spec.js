'use strict';

describe('The tenants view', function() {
  var loginPage = require('./login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('./shared.po.js');

  beforeEach(function() {
    // Login
    browser.get(shared.loginPageUrl);
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);

    browser.get(shared.tenantsPageUrl);
  });

  it('should include list of tenants, create tenant section and standard page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavButton.getText()).toBe('Tenants');
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
