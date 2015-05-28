'use strict';

describe('The tenants view', function () {

  beforeEach(function () {
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
  });


});
