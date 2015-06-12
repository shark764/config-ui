'use strict';

describe('The create new user form', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    users = require('./users.po.js'),
    userCount,
    randomUser,
    userAdded,
    newUserName;

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.usersPageUrl);
    userCount = users.userElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should display Create New User section', function() {
    users.createUserBtn.click();
    expect(users.userDetails.isDisplayed()).toBeTruthy();
  });

  it('should include supported fields for creating a new user', function() {
    users.createUserBtn.click();
    expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
    expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
    expect(users.displayNameFormField.isDisplayed()).toBeTruthy();
    expect(users.emailFormField.isDisplayed()).toBeTruthy();
    expect(users.passwordFormField.isDisplayed()).toBeTruthy();
    expect(users.externalIdFormField.isDisplayed()).toBeTruthy();
    expect(users.roleFormDropDown.isDisplayed()).toBeTruthy();
    expect(users.stateFormDropDown.isDisplayed()).toBeTruthy();

    expect(users.passwordEditFormBtn.isPresent()).toBeFalsy();

    expect(users.cancelUserFormBtn.isDisplayed()).toBeTruthy();
    expect(users.submitUserFormBtn.isDisplayed()).toBeTruthy();

    expect(users.createNewUserHeader.isDisplayed()).toBeTruthy();
  });


  it('should clear user details section when Create button is selected', function() {
    if (userCount > 0) {
      // Select User from table
      element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).click();

      // Select Create button
      users.createUserBtn.click();

      // Create user section cleared
      expect(users.userDetails.isDisplayed()).toBeTruthy();
      expect(users.userDetailsHeader.getText()).toBe('');
      expect(users.firstNameFormField.getAttribute('value')).toBe('');
      expect(users.lastNameFormField.getAttribute('value')).toBe('');
      expect(users.displayNameFormField.getAttribute('value')).toBe('');
      expect(users.emailFormField.getAttribute('value')).toBe('');
      expect(users.externalIdFormField.getAttribute('value')).toBe('');
      expect(users.roleFormDropDown.getAttribute('value')).toBe('');
      expect(users.stateFormDropDown.getAttribute('value')).toBe('');
    }
  });

  it('should require completed fields in Create New User section', function() {
    users.createUserBtn.click();
    expect(users.userDetails.isDisplayed()).toBeTruthy();

    // Select Okay with empty fields, no user is created
    users.submitUserFormBtn.click();
    expect(users.userDetails.isDisplayed()).toBeTruthy();
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should not accept spaces as valid input in Create New User modal', function() {
    // TODO Validation on user form
    users.createUserBtn.click();

    // Enter a space into each field
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.displayNameFormField.sendKeys(' ');
    users.emailFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    // Select Okay with 'empty' fields, confirm error message displayed, no user is created
    users.submitUserFormBtn.click();
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should display new user in table and display user details', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 100) + 1);
    userAdded = false;
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    users.createUserBtn.click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.displayNameFormField.sendKeys('Display' + randomUser);
    users.emailFormField.sendKeys('email' + randomUser + '@email.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys(randomUser);
    users.roleFormDropDown.all(by.css('option')).get((randomUser % 3) + 1).click();
    users.stateFormDropDown.all(by.css('option')).get((randomUser % 4) + 1).click();
    users.submitUserFormBtn.click();

    // Confirm user is displayed in user list with correct details
    users.userElements.then(function(users) {
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
      expect(users.userElements.count()).toBeGreaterThan(userCount);
    });
  });

  it('should clear new user fields after clicking Cancel', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 100) + 1);
    userAdded = false;
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    users.createUserBtn.click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.displayNameFormField.sendKeys('Display' + randomUser);
    users.emailFormField.sendKeys('email' + randomUser + '@email.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys(randomUser);
    users.roleFormDropDown.all(by.css('option')).get((randomUser % 3) + 1).click();
    users.stateFormDropDown.all(by.css('option')).get((randomUser % 4) + 1).click();
    users.cancelUserFormBtn.click();

    // Fields are cleared
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.displayNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
    expect(users.roleFormDropDown.getAttribute('value')).toBe('');
    expect(users.stateFormDropDown.getAttribute('value')).toBe('');

    // Confirm user is not displayed in user list with correct details
    users.userElements.then(function(users) {
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
      expect(users.userElements.count()).toBe(userCount);
    });
  });

  it('should require First Name field in Create New User modal', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 100) + 1);
    users.createUserBtn.click();

    // First name field blank
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.displayNameFormField.sendKeys('Display' + randomUser);
    users.emailFormField.sendKeys('email' + +randomUser + '@email.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.roleFormDropDown.all(by.css('option')).get((randomUser % 3) + 1).click();
    users.stateFormDropDown.all(by.css('option')).get((randomUser % 4) + 1).click();
    users.submitUserFormBtn.click();

    // Error messages displayed, no user is created
    // TODO Error messages
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should require Last Name field in Create New User modal', function() {
    randomUser = Math.floor((Math.random() * 100) + 1);
    users.createUserBtn.click();

    // Last name field blank
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.displayNameFormField.sendKeys('Display' + randomUser);
    users.emailFormField.sendKeys('email' + randomUser + '@email.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.roleFormDropDown.all(by.css('option')).get(1).click();
    users.stateFormDropDown.all(by.css('option')).get(1).click();
    users.submitUserFormBtn.click();

    // Error messages displayed, no user is created
    // TODO Error messages
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should user default Display Name in Create New User modal', function() {
    randomUser = Math.floor((Math.random() * 100) + 1);
    users.createUserBtn.click();

    // Display name field blank
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('email' + randomUser + '@email.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.roleFormDropDown.all(by.css('option')).get((randomUser % 3) + 1).click();
    users.stateFormDropDown.all(by.css('option')).get((randomUser % 4) + 1).click();

    expect(users.displayNameFormField.getAttribute('value')).toBe('First' + randomUser + ' Last' + randomUser);
    users.submitUserFormBtn.click();

    // User added, error messages not displayed
    // TODO Error messages not displayed
    expect(users.userElements.count()).toBeGreaterThan(userCount);
  });

  it('should require Email field in Create New User modal', function() {
    randomUser = Math.floor((Math.random() * 100) + 1);
    users.createUserBtn.click();

    // Email field blank
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.displayNameFormField.sendKeys('Display' + randomUser);
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.roleFormDropDown.all(by.css('option')).get((randomUser % 3) + 1).click();
    users.stateFormDropDown.all(by.css('option')).get((randomUser % 4) + 1).click();
    users.submitUserFormBtn.click();

    // Error messages displayed, no user is created
    // TODO Error messages
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should require State field in Create New User modal', function() {
    randomUser = Math.floor((Math.random() * 100) + 1);
    users.createUserBtn.click();

    // Email field blank
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.displayNameFormField.sendKeys('Display' + randomUser);
    users.emailFormField.sendKeys('email' + randomUser + '@email.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.roleFormDropDown.all(by.css('option')).get((randomUser % 3) + 1).click();
    users.submitUserFormBtn.click();

    // Error messages displayed, no user is created
    // TODO Error messages
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should require Role field in Create New User modal', function() {
    randomUser = Math.floor((Math.random() * 100) + 1);
    users.createUserBtn.click();

    // Email field blank
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.displayNameFormField.sendKeys('Display' + randomUser);
    users.emailFormField.sendKeys('email' + randomUser + '@email.com');
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.stateFormDropDown.all(by.css('option')).get((randomUser % 4) + 1).click();
    users.submitUserFormBtn.click();

    // Error messages displayed, no user is created
    // TODO Error messages
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should validate field input in Create New User modal', function() {
    // TODO
    // Validate field input: email format, acceptable characters in name, password
    // Validate field character limits
  });

  it('should ensure User Email is unique when Creating a new user', function() {
    if (userCount > 0) {
      // Attempt to create a new User with the email of an existing user
      user.userElements.then(function(existingUsers) {
        users.emailFormField.sendKeys(existingUsers.get(0).email);

        randomUser = Math.floor((Math.random() * 100) + 1);
        users.firstNameFormField.sendKeys('First' + randomUser);
        users.lastNameFormField.sendKeys('Last' + randomUser);
        users.displayNameFormField.sendKeys('Display' + randomUser);
        users.passwordFormField.sendKeys('password');
        users.externalIdFormField.sendKeys('12345');
        users.roleFormDropDown.all(by.css('option')).get((randomUser % 3) + 1).click();
        users.stateFormDropDown.all(by.css('option')).get((randomUser % 4) + 1).click();
        users.submitUserFormBtn.click();

        // Verify user is not created
        expect(users.userElements.count()).toBe(userCount);
        // TODO Error message displayed
      });
    }
  });
});
