'use strict';

describe('The login view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js');

  beforeEach(function() {
    // Ensure user is logged out initially
    browser.get(shared.loginPageUrl);
    browser.executeScript('window.sessionStorage.clear()');
    browser.executeScript('window.localStorage.clear()');
    browser.get(shared.loginPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include header, login fields, and submit button', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(loginPage.emailLoginField.isDisplayed()).toBeTruthy();
    expect(loginPage.emailLoginField.getAttribute('placeholder')).toBe('Email')
    expect(loginPage.emailLoginField.getAttribute('type')).toBe('text');

    expect(loginPage.passwordLoginField.isDisplayed()).toBeTruthy();
    expect(loginPage.passwordLoginField.getAttribute('placeholder')).toBe('Password')
    expect(loginPage.passwordLoginField.getAttribute('type')).toBe('password');

    expect(loginPage.loginButton.getAttribute('value')).toBe('Login');
  });

  it('should not display nav bar links when not logged in', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(shared.siteNavLogo.isPresent()).toBeFalsy();
    expect(shared.tenantsNavDropdown.isPresent()).toBeFalsy();
    expect(shared.usersNavButton.isPresent()).toBeFalsy();
    expect(shared.tenantsNavButton.isPresent()).toBeFalsy();
    expect(shared.queuesNavButton.isPresent()).toBeFalsy();
    expect(shared.flowsNavButton.isPresent()).toBeFalsy();
    expect(shared.settingsDropdown.isPresent()).toBeFalsy();
    expect(shared.welcomeMessage.isPresent()).toBeFalsy();
  });

  it('should redirect after successful login', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);
  });

  it('should require email and password input', function() {
    expect(loginPage.emailLoginField.getAttribute('required')).toBeTruthy();
    expect(loginPage.passwordLoginField.getAttribute('required')).toBeTruthy();

    // No login credentials input
    loginPage.emailLoginField.sendKeys('');
    loginPage.passwordLoginField.sendKeys('');
    loginPage.loginButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    // Email only
    loginPage.emailLoginField.sendKeys(loginPage.emailLoginCreds);
    loginPage.passwordLoginField.sendKeys('');
    loginPage.loginButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    // Password only
    loginPage.emailLoginField.clear();
    loginPage.passwordLoginField.sendKeys(loginPage.passwordLoginCreds);
    loginPage.loginButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  it('should display error message after unsuccessful login', function() {
    // TODO
  });

  it('should display user\'s name after successful login', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);

    expect(shared.welcomeMessage.getText()).toContain('Welcome back, titan');
  });

  it('should redirect to login page after logout', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);

    browser.actions().mouseMove(shared.welcomeMessage).perform();
    shared.logoutButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });
});
