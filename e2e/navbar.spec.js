'use strict';

describe('The navbar', function () {

  beforeEach(function () {
    browser.get('http://localhost:3000/#/login');
    // Login
    emailLogin.sendKeys('test@test.com');
    passwordLogin.sendKeys('testpassword');
    loginButton.click();
  });

  it('should contain logo, Tenant drop down, page links, user info and Logout button', function() {
    expect(navBar.isDisplayed()).toBeTruthy();
    expect(element(by.css('.navbar > a:nth-child(1)')).isDisplayed()).toBeTruthy();
    expect(element(by.model('activeTenant')).isDisplayed()).toBeTruthy();
    expect(element(by.css('activeTenant')).isDisplayed()).toBeTruthy();
    expect(element(by.css('li.active:nth-child(3) > a:nth-child(1)')).getText()).toBe('Users Management');
    expect(element(by.css('li.active:nth-child(3) > a:nth-child(2)')).getText()).toBe('Tenants');
    // TODO Add remaining page buttons as they are added
    expect(element(by.css('div.ng-binding:nth-child(3)')).isDisplayed()).toBeTruthy();
  });

  it('should navigate to main page logo is selected', function() {
    element(by.css('.navbar > a:nth-child(1)')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/users');
  });

  it('should change current Tenant when tenant drop down is altered', function() {
    element(by.css('.navbar > a:nth-child(2)')).click();
    expect(element(by.css('select.ng-valid:nth-child(1) > option:nth-child(1)')).isDisplayed()).toBeTruthy();
    // TODO Verify page is updated to selected tenant
  });

  it('should navigate to correct page when buttons are selected', function() {
    element(by.css('ul.ng-scope > li:nth-child(3)')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/users');

    element(by.css('ul.ng-scope > li:nth-child(4)')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/tenants');
  });
});
