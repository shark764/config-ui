'use strict';

describe('The login view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params;

  beforeEach(function() {
    // Ensure user is logged out initially
    browser.get(shared.loginPageUrl);
    browser.executeScript('window.sessionStorage.clear()');
    browser.executeScript('window.localStorage.clear()');
    browser.get(shared.loginPageUrl);
  });

  afterEach(function() {
    shared.tearDown();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include header, login fields, and submit button', function() {
    expect(loginPage.logo.isDisplayed()).toBeTruthy();

    expect(loginPage.emailLoginField.isDisplayed()).toBeTruthy();
    expect(loginPage.emailLoginField.getAttribute('placeholder')).toBe('Email')
    expect(loginPage.emailLoginField.getAttribute('type')).toBe('text');

    expect(loginPage.passwordLoginField.isDisplayed()).toBeTruthy();
    expect(loginPage.passwordLoginField.getAttribute('placeholder')).toBe('Password')
    expect(loginPage.passwordLoginField.getAttribute('type')).toBe('password');

    expect(loginPage.loginButton.getAttribute('value')).toBe('Login');

    expect(loginPage.errorMessage.isPresent()).toBeFalsy();
  });

  it('should not display nav bar links when not logged in', function() {
    expect(shared.navBar.isPresent()).toBeFalsy();
    expect(shared.siteNavLogo.isPresent()).toBeFalsy();
    expect(shared.tenantsNavDropdown.isPresent()).toBeFalsy();
    expect(shared.usersNavButton.isPresent()).toBeFalsy();
    expect(shared.tenantsNavButton.isPresent()).toBeFalsy();
    expect(shared.flowsNavButton.isPresent()).toBeFalsy();
    expect(shared.settingsDropdown.isPresent()).toBeFalsy();
    expect(shared.welcomeMessage.isPresent()).toBeFalsy();
  });

  it('should redirect after successful login', function() {
    loginPage.login(params.login.user, params.login.password);
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
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
    loginPage.emailLoginField.sendKeys(params.login.user);
    loginPage.passwordLoginField.sendKeys('');
    loginPage.loginButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    // Password only
    loginPage.emailLoginField.clear();
    loginPage.passwordLoginField.sendKeys(params.login.password);
    loginPage.loginButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  it('should display user\'s name after successful login', function() {
    loginPage.login(params.login.user, params.login.password);
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);

    expect(shared.welcomeMessage.getText()).toContain('Welcome back, ' + params.login.userDisplayName);
  });

  it('should redirect to login page after logout', function() {
    loginPage.login(params.login.user, params.login.password);
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);

    shared.welcomeMessage.click();
    shared.logoutButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  xit('should login successfully using all uppercase email', function() {
    // TODO Test fails due to existing bug
    loginPage.emailLoginField.sendKeys(params.login.user.toUpperCase());
    loginPage.passwordLoginField.sendKeys(params.login.password);
    loginPage.loginButton.click();

    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });

  xit('should login successfully using all lowercase email', function() {
    // TODO Test fails due to existing bug
    loginPage.emailLoginField.sendKeys(params.login.user.toLowerCase());
    loginPage.passwordLoginField.sendKeys(params.login.password);
    loginPage.loginButton.click();

    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });

  it('should require correct password case input', function() {
    loginPage.emailLoginField.sendKeys(params.login.user);
    loginPage.passwordLoginField.sendKeys(params.login.password.toLowerCase());
    loginPage.loginButton.click();

    // Not logged in; error message displayed
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    expect(loginPage.errorMessage.isDisplayed()).toBeTruthy();

    loginPage.emailLoginField.clear();
    loginPage.passwordLoginField.clear();

    loginPage.emailLoginField.sendKeys(params.login.user);
    loginPage.passwordLoginField.sendKeys(params.login.password.toUpperCase());
    loginPage.loginButton.click();

    // Not logged in; error message displayed
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    expect(loginPage.errorMessage.isDisplayed()).toBeTruthy();
  });

  it('should not redirect after unsuccessful login and display error message', function() {
    loginPage.emailLoginField.sendKeys('test@test.test');
    loginPage.passwordLoginField.sendKeys('test');
    loginPage.loginButton.click();

    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    expect(loginPage.errorMessage.isDisplayed()).toBeTruthy();
  });

  it('should not login with valid user email and invalid password', function() {
    loginPage.emailLoginField.sendKeys(params.login.user);
    loginPage.passwordLoginField.sendKeys('invalidpassword');
    loginPage.loginButton.click();

    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    expect(loginPage.errorMessage.isDisplayed()).toBeTruthy();
  });

  it('should not login with invalid user email and valid password', function() {
    loginPage.emailLoginField.sendKeys('invalid@user.email');
    loginPage.passwordLoginField.sendKeys(params.login.password);
    loginPage.loginButton.click();

    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
    expect(loginPage.errorMessage.isDisplayed()).toBeTruthy();
  });
});
