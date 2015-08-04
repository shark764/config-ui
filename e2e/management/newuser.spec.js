'use strict';

describe('The create new user form', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    userCount,
    randomUser,
    userAdded,
    newUserName;

  beforeAll(function() {
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

  it('should display Create New User section', function() {
    shared.createBtn.click();
    expect(shared.detailsForm.isDisplayed()).toBeTruthy();
  });

  it('should include supported fields for creating a new user', function() {
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

  it('should clear user details section when Create button is selected', function() {
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

  it('should require completed fields in Create New User section', function() {
    shared.createBtn.click();
    expect(shared.detailsForm.isDisplayed()).toBeTruthy();

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);

    expect(shared.successMessage.isPresent()).toBeFalsy();
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

  it('should display new user in table and display user details', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    userAdded = false;
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    shared.createBtn.click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys(randomUser);
    users.personalTelephoneFormField.sendKeys('15062345678');

    shared.submitFormBtn.click();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();

    // Confirm user is displayed in user list with correct details
    shared.tableElements.then(function(users) {
      for (var i = 1; i <= users.length; ++i) {
        // Check if user name in table matches newly added user
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
          if (value == newUserName) {
            userAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new user was found in the user table
      expect(userAdded).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(userCount);
      expect(shared.detailsFormHeader.getText()).toBe(newUserName);
    });
  });

  it('should clear new user fields after clicking Cancel', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    userAdded = false;
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    shared.createBtn.click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys(randomUser);
    users.personalTelephoneFormField.sendKeys('15062345678');
    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields are cleared
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
    expect(users.personalTelephoneFormField.getAttribute('value')).toBe('');

    // Confirm user is not displayed in user list with correct details
    shared.tableElements.then(function(users) {
      for (var i = 1; i <= users.length; ++i) {
        // Check if user name in table matches newly added user
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
          if (value == newUserName) {
            userAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new user was not found in the user table
      expect(userAdded).toBeFalsy();
      expect(shared.tableElements.count()).toBe(userCount);
    });
  });

  it('should require First Name field', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // First name field blank
    users.firstNameFormField.click();
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.personalTelephoneFormField.sendKeys('15062345678');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a first name');
  });

  it('should require Last Name field', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Last name field blank
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.click();
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.personalTelephoneFormField.sendKeys('15062345678');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a last name');
  });

  it('should require Email field', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Email field blank
    users.emailFormField.click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.personalTelephoneFormField.sendKeys('15062345678');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
  });

  it('should require password field', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Email field blank
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.click();
    users.externalIdFormField.sendKeys('12345');
    users.personalTelephoneFormField.sendKeys('15062345678');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a password');
  });

  it('should not require external id or personal telephone', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    shared.createBtn.click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(userCount);
    });
  });

  it('should require valid Email field input', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');

    users.emailFormField.sendKeys(randomUser + '\t');
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Must be a valid email address');

    users.emailFormField.clear();
    users.emailFormField.sendKeys(randomUser + '.' + randomUser + '\t');
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Must be a valid email address');
  });

  it('should ensure User Email is unique', function() {
    shared.createBtn.click();

    // Attempt to create a new User with the email of an existing user
    users.emailFormField.sendKeys(params.login.user);

    randomUser = Math.floor((Math.random() * 1000) + 1);
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.personalTelephoneFormField.sendKeys('15062345678');
    shared.submitFormBtn.click().then(function() {
      // New user not added, invite sent to existing user
      expect(shared.tableElements.count()).toBe(userCount);
      expect(shared.successMessage.getText()).toContain('User already exists. Sending ' + params.login.user + ' an invite for');
      shared.closeMessageBtn.click().then(function() {
        expect(shared.errorMessage.getText()).toContain('Record failed to save');
      });
    });
  });

  xit('should ensure User Email is unique and case insensitive', function() {
    // TODO Existing bug; this test fails
    shared.createBtn.click();

    // Attempt to create a new User with the email of an existing user
    users.emailFormField.sendKeys(params.login.user.toUpperCase());

    randomUser = Math.floor((Math.random() * 1000) + 1);
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.personalTelephoneFormField.sendKeys('15062345678');
    shared.submitFormBtn.click();

    // New user not added, invite sent to existing user
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.errorMessage.getText()).toContain('Record failed to save');
    expect(shared.successMessage.getText()).toContain('User already exists. Sending ' + params.login.user.toUpperCase() + ' an invite for');
  });

  it('should prevent invalid E164 numbers from being accepted', function() {
    shared.createBtn.click();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();

    // Ensure the field is empty
    users.personalTelephoneFormField.clear();
    users.personalTelephoneFormField.sendKeys('a15064704361');

    users.firstNameFormField.click();
    expect(users.personalTelephoneFormField.getAttribute('class')).toContain('ng-invalid');
    expect(users.requiredErrors.get(0).getText()).toBe('Phone number should be in E.164 format.');
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
  });

  it('should allow E164 numbers to be accepted and format the input', function() {
    shared.createBtn.click();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();

    // Complete field with valid input
    users.personalTelephoneFormField.sendKeys('15064704361');

    users.firstNameFormField.click();
    expect(users.requiredErrors.get(0).isDisplayed()).toBeFalsy();
    expect(users.personalTelephoneFormField.getAttribute('value')).toBe('+1 506-470-4361');
  });

  //Regression test for TITAN2-2267
  it('should reset the form when clicking Create while already Creating', function() {
    shared.createBtn.click();

    //Fill out all fields
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys(randomUser);
    users.personalTelephoneFormField.sendKeys('15062345678');

    //Click Create button again
    shared.createBtn.click();
    shared.dismissChanges();

    //Expect all fields to have been cleared
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
    expect(users.personalTelephoneFormField.getAttribute('value')).toBe('')
  });

  it('should reset invalid fields after clicking Create while already Creating', function() {
    shared.createBtn.click();

    //Fill in invalid values
    users.emailFormField.sendKeys('not an email');
    users.personalTelephoneFormField.sendKeys('not a phone number');

    //Click Create button again
    shared.createBtn.click();
    shared.dismissChanges();

    //Expect all fields to have been cleared
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.personalTelephoneFormField.getAttribute('value')).toBe('')
  });
});
