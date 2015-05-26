'use strict';

describe('The login view', function () {
  var navBar = element(by.css('nav'));
  var emailLogin = element(by.model('username'));
  var passwordLogin = element(by.model('password'));
  var loginButton = element(by.css('.login-btn'));
  var logoutButton = element(by.css('.fa-sign-out'));

  beforeEach(function () {
    browser.get('http://localhost:3000/#/login');
  });

  it('should include header, login fields, and submit button', function() {
    expect(navBar.isDisplayed()).toBeTruthy();

    expect(emailLogin.isDisplayed()).toBeTruthy();
    expect(emailLogin.getAttribute('placeholder')).toBe('joe.blo@example.com')
    expect(emailLogin.getAttribute('type')).toBe('text');

    expect(passwordLogin.isDisplayed()).toBeTruthy();
    expect(passwordLogin.getAttribute('placeholder')).toBe('*********')
    expect(passwordLogin.getAttribute('type')).toBe('password');

    expect(loginButton.getAttribute('value')).toBe('Login');
  });

  it('should redirect after successful login', function () {
    emailLogin.sendKeys('test@test.com');
    passwordLogin.sendKeys('testpassword');
    loginButton.click();

    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/');
  });

  it('should require email and password input', function () {
    expect(emailLogin.getAttribute('required')).toBeTruthy();
    expect(passwordLogin.getAttribute('required')).toBeTruthy();

    loginButton.click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');

    emailLogin.sendKeys('test@test.com');
    loginButton.click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');

    emailLogin.clear();
    passwordLogin.sendKeys('testpassword');
    loginButton.click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');
  });

  it('should display error message after unsuccessful login', function () {
    // TO DO
  });

  it('should display user\'s name after successful login', function () {
    emailLogin.sendKeys('test@test.com');
    passwordLogin.sendKeys('testpassword');
    loginButton.click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/');

    // TO DO: Update to match current logged in user's name
    expect(element(by.css('div.ng-binding:nth-child(3)')).getText()).toContain('Welcome back');
  });

  it('should redirect to login page after logout', function () {
    emailLogin.sendKeys('test@test.com');
    passwordLogin.sendKeys('testpassword');
    loginButton.click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/');

    logoutButton.click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');
  });

});
