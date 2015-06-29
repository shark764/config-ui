'use strict';

describe('The profile view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    profile = require('./profile.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.profilePageUrl);
  });

  afterAll(function() {
    // Reset user details
    shared.welcomeMessage.click();
    shared.userProfileButton.click();

    profile.firstNameFormField.clear();
    profile.firstNameFormField.sendKeys(params.login.firstName);
    profile.lastNameFormField.clear();
    profile.lastNameFormField.sendKeys(params.login.lastName);
    profile.displayNameFormField.clear();
    profile.displayNameFormField.sendKeys(params.login.userDisplayName);

    profile.updateProfileBtn.click().then(function() {
      shared.tearDown();
    });
  });

  it('should include profile page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName);
    expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName);
    expect(profile.displayNameFormField.getAttribute('value')).toBe(params.login.userDisplayName);
    expect(profile.userEmail.getText()).toContain(params.login.user);
    expect(profile.userProfilePic.isDisplayed()).toBeTruthy();

    expect(profile.updateProfileBtn.isDisplayed()).toBeTruthy();
  });

  it('should require First Name when editing', function() {
    profile.firstNameFormField.clear();
    profile.updateProfileBtn.click().then(function() {
      // Confirm user is not updated
      expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName);

      // TODO Validation messages
    });
  });

  it('should require Last Name when editing', function() {
    profile.lastNameFormField.clear();
    profile.updateProfileBtn.click().then(function() {
      // Confirm user is not updated
      expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName);

      // TODO Validation messages
    });
  });

  it('should require Display Name when editing', function() {
    profile.displayNameFormField.clear();
    profile.updateProfileBtn.click().then(function() {
      // Confirm user is not updated
      expect(profile.displayNameFormField.getAttribute('value')).toBe(params.login.userDisplayName);

      // TODO Validation messages
    });
  });

  it('should update user details', function() {
    profile.firstNameFormField.sendKeys('Update');
    profile.lastNameFormField.sendKeys('Update');
    profile.displayNameFormField.sendKeys('Update');

    profile.updateProfileBtn.click().then(function() {
      expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName + 'Update');
      expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName + 'Update');
      expect(profile.displayNameFormField.getAttribute('value')).toBe(params.login.userDisplayName + 'Update');

      // Confirm user is updated
      // TODO Fails from user list not showing all users
      //shared.usersNavButton.click();
      //shared.searchField.sendKeys(params.login.firstName + 'Update ' + params.login.lastName + 'Update');
      //expect(shared.tableElements.count()).toBe(1);
    });
  });
});
