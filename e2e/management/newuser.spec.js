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

    expect(users.createNewUserHeader.isDisplayed()).toBeTruthy();

    expect(users.emailFormField.isDisplayed()).toBeTruthy();

    // Role dropdown dispayed with expected roles
    expect(users.roleFormDropdown.isDisplayed()).toBeTruthy();
    expect(users.roleFormDropdownOptions.get(1).getText()).toBe(users.roles[0]);
    expect(users.roleFormDropdownOptions.get(2).getText()).toBe(users.roles[1]);
    expect(users.roleFormDropdownOptions.get(3).getText()).toBe(users.roles[2]);

    // Invite now toggle displayed, selected by default with help icon
    expect(users.inviteNowFormToggle.isDisplayed()).toBeTruthy();
    expect(users.inviteNowFormToggle.element(by.css('input')).isSelected()).toBeTruthy();
    expect(users.inviteNowHelp.isDisplayed()).toBeTruthy();

    expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
    expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
    expect(users.externalIdFormField.isDisplayed()).toBeTruthy();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();
    expect(users.personalTelephoneHelp.isDisplayed()).toBeTruthy();

    expect(users.passwordEditFormBtn.isPresent()).toBeFalsy();
    expect(users.passwordFormField.isPresent()).toBeFalsy();

    expect(shared.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should clear user details section when Create button is selected', function() {
    // Select User from table
    shared.firstTableRow.click();

    // Select Create button
    shared.createBtn.click();

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

    shared.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not accept spaces as valid input for required fields', function() {
    shared.createBtn.click();

    // Enter a space into each field, select required dropdown field
    users.emailFormField.sendKeys(' ');
    users.roleFormDropdownOptions.get(1).click();
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.sendKeys(' ');
    users.personalTelephoneFormField.sendKeys(' ');
    users.externalIdFormField.sendKeys(' ');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
  });

  it('should display new user in table and display user details with correct Tenant Status', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    userAdded = false;
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    shared.createBtn.click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.roleFormDropdownOptions.get((randomUser % 3) + 1).click();
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
    users.roleFormDropdownOptions.get((randomUser % 3) + 1).click();
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
    expect(users.roleFormDropdownOptions.getAttribute('value')).toBe('');
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

  it('should require Email field', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Email field blank
    users.emailFormField.click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.roleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.externalIdFormField.sendKeys(randomUser);
    users.personalTelephoneFormField.sendKeys('15062345678');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    shared.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
  });

  it('should require Role field', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.roleFormDropdown.click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.passwordFormField.sendKeys('password');
    users.externalIdFormField.sendKeys('12345');
    users.personalTelephoneFormField.sendKeys('15062345678');

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please select a role');
  });

  it('should not require First Name, Last Name, External Id or Personal Telephone', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserEmail = 'titantest' + randomUser + '@mailinator.com'
    userAdded = false;

    // Add new user
    shared.createBtn.click();
    users.emailFormField.sendKeys(newUserEmail);
    users.roleFormDropdownOptions.get((randomUser % 3) + 1).click();

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(userCount);

      // User displayed in table without Name
      shared.tableElements.then(function(users) {
        for (var i = 1; i <= users.length; ++i) {
          // Check if user email in table matches newly added user
          element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(3)')).getText().then(function(value) {
            if (value == newUserEmail) {
              userAdded = true;
              expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).toBeNull();
            }
          });
        }
      }).thenFinally(function() {
        // Verify new user was found in the user table
        expect(userAdded).toBeTruthy();
      });
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

  it('should populate and disable uneditable fields for existing user in the tenant', function() {
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

  it('should populate and disable uneditable fields for existing user not in the tenant', function() {
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

  xit('should should populate and disable uneditable fields for existing user with case insensitive email', function() {
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

  it('should reset uneditable fields for existing user when email is removed', function() {
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

  it('should require role field for existing user', function() {
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

  it('should prevent invalid E164 numbers from being accepted', function() {
    shared.createBtn.click();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();

    // Ensure the field is empty
    users.personalTelephoneFormField.clear();
    users.personalTelephoneFormField.sendKeys('a15064704361');

    users.firstNameFormField.click();
    expect(users.personalTelephoneFormField.getAttribute('class')).toContain('ng-invalid');
    // BUG
    //expect(users.requiredErrors.get(0).getText()).toBe('Phone number should be in E.164 format.');
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
  });

  it('should allow E164 numbers to be accepted and format the input', function() {
    shared.createBtn.click();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();

    // Complete field with valid input
    users.personalTelephoneFormField.sendKeys('15064704361');

    users.firstNameFormField.click();
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

  it('should successfully send invitation email', function() {
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

  it('should not send invitation email when Invite Now is deselected', function() {
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

  it('should successfully send invitation email for existing user', function() {
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

  it('should not send invitation email when Invite Now is deselected for existing user', function() {
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

});
