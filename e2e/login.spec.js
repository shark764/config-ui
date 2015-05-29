'use strict';

describe('The login view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js');

  beforeEach(function() {
    browser.get(shared.loginPageUrl);
  });

  it('should include header, login fields, and submit button', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(loginPage.emailLoginField.isDisplayed()).toBeTruthy();
    expect(loginPage.emailLoginField.getAttribute('placeholder')).toBe('joe.blo@example.com')
    expect(loginPage.emailLoginField.getAttribute('type')).toBe('text');

    expect(loginPage.passwordLoginField.isDisplayed()).toBeTruthy();
    expect(loginPage.passwordLoginField.getAttribute('placeholder')).toBe('*********')
    expect(loginPage.passwordLoginField.getAttribute('type')).toBe('password');

    expect(loginPage.loginButton.getAttribute('value')).toBe('Login');
  });

  it('should redirect after successful login', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);
  });

  it('should require email and password input', function() {
    expect(loginPage.emailLoginField.getAttribute('required')).toBeTruthy();
    expect(loginPage.passwordLoginField.getAttribute('required')).toBeTruthy();

    // No login credentials input
    loginPage.login('', '');
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    // Email only
    loginPage.login(loginPage.emailLoginCreds, '');
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);

    // Password only
    loginPage.emailLoginField.clear();
    loginPage.login('', loginPage.passwordLoginCreds);
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

  it('should display error message after unsuccessful login', function() {
    // TODO
  });

  it('should display user\'s name after successful login', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);

    // TO DO: Update to match current logged in user's name
    expect(shared.welcomeMessage.getText()).toContain('Welcome back');
  });

  it('should redirect to login page after logout', function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    expect(browser.getCurrentUrl()).toBe(shared.mainUrl);

    shared.logoutButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });

});
