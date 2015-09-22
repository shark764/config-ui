'use strict';

describe('The profile view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    profile = require('./profile.po.js'),
    loginPage = require('../login/login.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.profilePageUrl);
  });

  afterAll(function() {
    // Reset user details
    browser.get(shared.profilePageUrl);
    profile.firstNameFormField.clear();
    profile.firstNameFormField.sendKeys(params.login.firstName);
    profile.lastNameFormField.clear();
    profile.lastNameFormField.sendKeys(params.login.lastName);
    profile.resetPasswordButton.click();
    profile.passwordFormField.clear();
    profile.passwordFormField.sendKeys(params.login.password);

    profile.updateProfileBtn.click().then(function() {
      shared.tearDown();
    });
  });

  it('should include profile page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName);
    expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName);
    expect(profile.userEmail.getText()).toContain(params.login.user);
    expect(profile.userProfilePic.isDisplayed()).toBeTruthy();

    expect(profile.resetPasswordButton.isDisplayed()).toBeTruthy();
    expect(profile.updateProfileBtn.isDisplayed()).toBeTruthy();
  });

  it('should update user name', function() {
    profile.firstNameFormField.sendKeys('Update');
    profile.lastNameFormField.sendKeys('Update');

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
      expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName + 'Update');
      expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.firstName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.lastName + 'Update');

      // Confirm user is updated
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys(params.login.firstName + 'Update ' + params.login.lastName + 'Update');
      expect(shared.tableElements.count()).toBe(1);
    });
  });

  it('should not require first or last name', function() {
    profile.firstNameFormField.clear();
    profile.lastNameFormField.clear();

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
      expect(profile.firstNameFormField.getAttribute('value')).toBe('');
      expect(profile.lastNameFormField.getAttribute('value')).toBe('');

      // Welcome message shows user email
      expect(shared.welcomeMessage.getText()).toContain('Welcome back, ' + params.login.user);
      expect(shared.welcomeMessage.getText()).not.toContain(params.login.firstName + 'Update');
      expect(shared.welcomeMessage.getText()).not.toContain(params.login.lastName + 'Update');

      // Confirm user is updated
      shared.welcomeMessage.click();
      shared.logoutButton.click();

      loginPage.login(params.login.user, params.login.password);
      expect(shared.welcomeMessage.getText()).toContain('Welcome back, ' + params.login.user);
    });
  });

  it('should require password after reset password button is clicked', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.clear();
    profile.firstNameFormField.click();

    //Submit button is disabled
    expect(profile.updateProfileBtn.getAttribute('disabled')).toBeTruthy();
    profile.updateProfileBtn.click();

    //Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('Please enter a password');
  });

  it('should apply the new password', function() {
    //Change the password
    profile.resetPasswordButton.click();
    profile.passwordFormField.clear();
    profile.passwordFormField.sendKeys(params.login.password + 'new');

    //Log in with the new password
    profile.updateProfileBtn.click();
    shared.closeMessageBtn.click();
    shared.welcomeMessage.click();
    shared.logoutButton.click();
    loginPage.login(params.login.user, params.login.password + 'new');
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });
});
