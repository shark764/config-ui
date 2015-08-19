'use strict';

describe('The user invitation', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    invites = require('./invites.po.js'),
    params = browser.params,
    userCount,
    randomUser,
    newUserName;

  beforeAll(function() {
    // Send Invitation
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
    userCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('email', function() {
    it('should contain a link to accept the invitation and user details', function() {
      shared.createBtn.click();
      expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    });

    it('should link to the invitation accept form', function() {
      shared.createBtn.click();
      expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    });
  });

  describe('acceptance form', function() {
    it('should include supported fields and user details', function() {
      shared.createBtn.click();
      expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
      expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
      expect(users.emailFormField.isDisplayed()).toBeTruthy();
      expect(users.passwordFormField.isDisplayed()).toBeTruthy();
      expect(users.externalIdFormField.isDisplayed()).toBeTruthy();
      expect(users.personalTelephoneFormField.isDisplayed).toBeTruthy();

      expect(users.passwordEditFormBtn.isPresent()).toBeFalsy();

      expect(shared.cancelFormBtn.isDisplayed()).toBeTruthy();
      expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();

      expect(users.createNewUserHeader.isDisplayed()).toBeTruthy();
    });

    it('should require completed fields', function() {
      shared.createBtn.click();
      expect(shared.detailsForm.isDisplayed()).toBeTruthy();

      expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(shared.tableElements.count()).toBe(userCount);

      expect(shared.successMessage.isPresent()).toBeFalsy();
    });

    it('should require password field input', function() {
      // Select User from table
      shared.firstTableRow.click();

      // Select Create button
      shared.createBtn.click();
      shared.dismissChanges();

      // Create user section cleared
      expect(users.createNewUserHeader.getText()).toBe('Creating New User');
      expect(users.firstNameFormField.getAttribute('value')).toBe('');
      expect(users.lastNameFormField.getAttribute('value')).toBe('');
      expect(users.emailFormField.getAttribute('value')).toBe('');
      expect(users.externalIdFormField.getAttribute('value')).toBe('');
      expect(users.personalTelephoneFormField.getAttribute('value')).toBe('');
    });

    it('should not require first or last name field input', function() {
      // Select User from table
      shared.firstTableRow.click();

      // Select Create button
      shared.createBtn.click();
      shared.dismissChanges();

      // Create user section cleared
      expect(users.createNewUserHeader.getText()).toBe('Creating New User');
      expect(users.firstNameFormField.getAttribute('value')).toBe('');
      expect(users.lastNameFormField.getAttribute('value')).toBe('');
      expect(users.emailFormField.getAttribute('value')).toBe('');
      expect(users.externalIdFormField.getAttribute('value')).toBe('');
      expect(users.personalTelephoneFormField.getAttribute('value')).toBe('');
    });

    it('should not accept spaces as valid input', function() {
      shared.createBtn.click();

      // Enter a space into each field
      users.emailFormField.sendKeys(' ');
      users.firstNameFormField.sendKeys(' ');
      users.lastNameFormField.sendKeys(' ');
      users.personalTelephoneFormField.sendKeys(' ');
      users.externalIdFormField.sendKeys(' ');

      expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(shared.tableElements.count()).toBe(userCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Verify error messages are displayed
      expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
      expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
      expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
    });

    it('should redirect to login page when invitation is already accepted', function() {
      shared.createBtn.click();

      // Enter a space into each field
      users.emailFormField.sendKeys(' ');
      users.firstNameFormField.sendKeys(' ');
      users.lastNameFormField.sendKeys(' ');
      users.personalTelephoneFormField.sendKeys(' ');
      users.externalIdFormField.sendKeys(' ');

      expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
      expect(shared.tableElements.count()).toBe(userCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Verify error messages are displayed
      expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
      expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
      expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
    });
  });

  it('should expire after 24 hours', function() {
    shared.createBtn.click();

    // Enter a space into each field
    users.emailFormField.sendKeys(' ');
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.personalTelephoneFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
  });

  it('should not be expired after 23 hours', function() {
    shared.createBtn.click();

    // Enter a space into each field
    users.emailFormField.sendKeys(' ');
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.personalTelephoneFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
  });

  it('should display expired message after expiry period has passed', function() {
    shared.createBtn.click();

    // Enter a space into each field
    users.emailFormField.sendKeys(' ');
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.personalTelephoneFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(2).getText()).toBe('Please enter a last name');
  });


  // For existing users

});
