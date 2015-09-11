'use strict';

describe('The create new user form', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    columns = require('../tableControls/columns.po.js'),
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
    expect(users.detailsForm.isDisplayed()).toBeTruthy();
  });

  it('should include supported fields for creating a new user', function() {
    shared.createBtn.click();

    expect(users.createNewUserHeader.isDisplayed()).toBeTruthy();

    expect(users.emailFormField.isDisplayed()).toBeTruthy();

    // Tenant role dropdown displayed with expected roles
    expect(users.tenantRoleFormDropdown.isDisplayed()).toBeTruthy();
    expect(users.tenantRoleFormDropdownOptions.get(1).getText()).toBe(users.tenantRoles[0]);
    expect(users.tenantRoleFormDropdownOptions.get(2).getText()).toBe(users.tenantRoles[1]);
    expect(users.tenantRoleFormDropdownOptions.get(3).getText()).toBe(users.tenantRoles[2]);

    // Platform role dropdown displayed with expected roles
    expect(users.platformRoleFormDropdown.isDisplayed()).toBeTruthy();
    expect(users.platformRoleFormDropdownOptions.get(1).getText()).toBe(users.platformRoles[0]);

    // Invite now toggle displayed, selected by default with help icon
    expect(users.inviteNowFormToggle.isDisplayed()).toBeTruthy();
    expect(users.inviteNowFormToggle.element(by.css('label:nth-child(1) > input:nth-child(1)')).isSelected()).toBeTruthy();
    expect(users.inviteNowHelp.isDisplayed()).toBeTruthy();

    expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
    expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
    expect(users.externalIdFormField.isDisplayed()).toBeTruthy();

    // Password and Telephone fields are not displayed
    expect(users.personalTelephoneFormField.isPresent()).toBeFalsy();
    expect(users.personalTelephoneHelp.isPresent()).toBeFalsy();
    expect(users.passwordEditFormBtn.isPresent()).toBeFalsy();
    expect(users.passwordFormField.isPresent()).toBeFalsy();

    expect(users.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(users.submitFormBtn.isDisplayed()).toBeTruthy();
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

    // Fields disabled by default
    expect(users.firstNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.lastNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.externalIdFormField.getAttribute('disabled')).toBeTruthy();

  });

  it('should require completed fields in Create New User section', function() {
    shared.createBtn.click();
    expect(users.detailsForm.isDisplayed()).toBeTruthy();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    users.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not accept spaces as valid input for required fields', function() {
    shared.createBtn.click();

    // Enter a space into each field, select required dropdown field
    users.emailFormField.sendKeys(' ');
    users.tenantRoleFormDropdownOptions.get(1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    // Remaining fields remain disabled
    expect(users.firstNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.lastNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.externalIdFormField.getAttribute('disabled')).toBeTruthy();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    users.submitFormBtn.click();
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

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.externalIdFormField.sendKeys(randomUser);

    users.submitFormBtn.click();
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
      expect(users.userNameDetailsHeader.getText()).toBe(newUserName);
    });
  });

  it('should clear close new user details after clicking Cancel', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    userAdded = false;
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    shared.createBtn.click();
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.externalIdFormField.sendKeys(randomUser);
    users.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Create new User form is closed
    expect(users.detailsForm.isDisplayed()).toBeFalsy();

    // Fields are cleared
    shared.createBtn.click();
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.tenantRoleFormDropdown.getAttribute('value')).toBe('');
    expect(users.platformRoleFormDropdown.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');

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
    users.emailFormField.sendKeys('\t');

    // Fields remain disabled
    expect(users.tenantRoleFormDropdown.getAttribute('disabled')).toBeTruthy();
    expect(users.platformRoleFormDropdown.getAttribute('disabled')).toBeTruthy();
    expect(users.firstNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.lastNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.externalIdFormField.getAttribute('disabled')).toBeTruthy();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    users.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter an email address');
  });

  it('should require Role fields', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdown.click();
    users.platformRoleFormDropdown.click();
    users.tenantRoleFormDropdown.click();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    users.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Please select a role');
    expect(users.requiredErrors.get(1).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(1).getText()).toBe('Please select a role');
  });

  it('should not require First Name, Last Name, External Id', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserEmail = 'titantest' + randomUser + '@mailinator.com'
    userAdded = false;

    // Add new user
    shared.createBtn.click();
    users.emailFormField.sendKeys(newUserEmail + '\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    // Fields enabled
    expect(users.firstNameFormField.getAttribute('disabled')).toBeFalsy();
    expect(users.lastNameFormField.getAttribute('disabled')).toBeFalsy();
    expect(users.externalIdFormField.getAttribute('disabled')).toBeFalsy();

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(userCount);

      // User displayed in table without Name
      shared.tableElements.then(function(users) {
        for (var i = 1; i <= users.length; ++i) {
          // Check if user email in table matches newly added user
          element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(3)')).getText().then(function(value) {
            if (value == newUserEmail) {
              userAdded = true;
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

    users.emailFormField.sendKeys(randomUser + '\t');
    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Must be a valid email address');

    // Fields remain disabled
    expect(users.tenantRoleFormDropdown.getAttribute('disabled')).toBeTruthy();
    expect(users.platformRoleFormDropdown.getAttribute('disabled')).toBeTruthy();
    expect(users.firstNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.lastNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.externalIdFormField.getAttribute('disabled')).toBeTruthy();

    users.emailFormField.clear();
    users.emailFormField.sendKeys(randomUser + '.' + randomUser + '\t');
    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Must be a valid email address');

    // Fields remain disabled
    expect(users.tenantRoleFormDropdown.getAttribute('disabled')).toBeTruthy();
    expect(users.platformRoleFormDropdown.getAttribute('disabled')).toBeTruthy();
    expect(users.firstNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.lastNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.externalIdFormField.getAttribute('disabled')).toBeTruthy();
  });

  it('should show user details when entering existing tenant user email', function() {
    shared.createBtn.click();

    // Change sort order to list user's without First or Last names at the bottom
    columns.columnTwoHeader.click();

    // Attempt to create a new User with the email of an existing user
    shared.firstTableRow.element(by.css(users.emailColumn)).getText().then(function(existingUserEmail) {
      users.emailFormField.sendKeys(existingUserEmail + '\t').then(function() {
        // User details form displayed instead of creating a new user
        expect(users.createNewUserHeader.isPresent()).toBeFalsy();
        expect(users.userNameDetailsHeader.isDisplayed()).toBeTruthy();

        // Required details are populated
        expect(users.emailLabel.getText()).toBe(existingUserEmail);
        expect(users.tenantRoleFormDropdown.getAttribute('value')).not.toBeNull();
      });
    });
  });

  xit('should show user details when entering existing tenant user email; case insensitive', function() {
    // TODO API Email is currently case sensitive
    var caseChangeExistingEmail;
    shared.createBtn.click();

    // Change sort order to list user's without First or Last names at the bottom
    columns.columnTwoHeader.click();

    // Attempt to create a new User with the email of an existing user
    shared.firstTableRow.element(by.css(users.emailColumn)).getText().then(function(existingUserEmail) {
      caseChangeExistingEmail = existingUserEmail.substring(0, 4).toUpperCase() + existingUserEmail.substring(4, existingUserEmail.length).toLowerCase();

      users.emailFormField.sendKeys(caseChangeExistingEmail + '\t');

      // User details form displayed instead of creating a new user
      expect(shared.createNewUserHeader.isPresent()).toBeFalsy();
      expect(shared.userNameDetailsHeader.isDisplayed()).toBeTruthy();

      // Required details are populated
      expect(users.emailLabel.getText()).toBe(existingUserEmail);
      expect(users.tenantRoleFormDropdown.getAttribute('value')).not.toBeNull();
    });
  });

  //Regression test for TITAN2-2267
  it('should reset the form when clicking Create while already Creating', function() {
    shared.createBtn.click();

    //Fill out all fields
    randomUser = Math.floor((Math.random() * 1000) + 1);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.externalIdFormField.sendKeys(randomUser);

    //Click Create button again
    shared.createBtn.click();
    shared.dismissChanges();

    //Expect all fields to have been cleared
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.tenantRoleFormDropdown.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
  });

  it('should reset invalid Email field after clicking Create while already Creating', function() {
    shared.createBtn.click();

    //Fill in invalid values
    users.emailFormField.sendKeys('not an email');

    //Click Create button again
    shared.createBtn.click();
    shared.dismissChanges();

    //Expect all fields to have been cleared
    expect(users.emailFormField.getAttribute('value')).toBe('');
  });

  describe('for an existing user not in the current tenant', function() {
    // TODO Get user name that is in another but not the current tenant
    xit('should not populate fields and should disable uneditable fields', function() {
      // TODO
      shared.createBtn.click();

      // Attempt to create a new User with the email of an existing user
      users.emailFormField.sendKeys(params.login.user);

      randomUser = Math.floor((Math.random() * 1000) + 1);
      users.firstNameFormField.sendKeys('First' + randomUser);
      users.lastNameFormField.sendKeys('Last' + randomUser);
      users.externalIdFormField.sendKeys('12345');
      users.submitFormBtn.click().then(function() {
        // New user not added, invite sent to existing user
        expect(shared.tableElements.count()).toBe(userCount);
        expect(shared.successMessage.getText()).toContain('User already exists. Sending ' + params.login.user + ' an invite for');
        shared.closeMessageBtn.click().then(function() {
          expect(shared.errorMessage.getText()).toContain('Record failed to save');
        });
      });
    });

    xit('should should not populate fields and should disable uneditable fields', function() {
      // TODO Existing bug; this test fails
      shared.createBtn.click();

      // Attempt to create a new User with the email of an existing user
      users.emailFormField.sendKeys(params.login.user.toUpperCase());

      randomUser = Math.floor((Math.random() * 1000) + 1);
      users.firstNameFormField.sendKeys('First' + randomUser);
      users.lastNameFormField.sendKeys('Last' + randomUser);
      users.externalIdFormField.sendKeys('12345');
      users.submitFormBtn.click();

      // New user not added, invite sent to existing user
      expect(shared.tableElements.count()).toBe(userCount);
      expect(shared.errorMessage.getText()).toContain('Record failed to save');
      expect(shared.successMessage.getText()).toContain('User already exists. Sending ' + params.login.user.toUpperCase() + ' an invite for');
    });

    xit('should reset uneditable fields when email is removed', function() {
      // TODO
      shared.createBtn.click();

      // Attempt to create a new User with the email of an existing user
      users.emailFormField.sendKeys(params.login.user);

      randomUser = Math.floor((Math.random() * 1000) + 1);
      users.firstNameFormField.sendKeys('First' + randomUser);
      users.lastNameFormField.sendKeys('Last' + randomUser);
      users.externalIdFormField.sendKeys('12345');
      users.submitFormBtn.click().then(function() {
        // New user not added, invite sent to existing user
        expect(shared.tableElements.count()).toBe(userCount);
        expect(shared.successMessage.getText()).toContain('User already exists. Sending ' + params.login.user + ' an invite for');
        shared.closeMessageBtn.click().then(function() {
          expect(shared.errorMessage.getText()).toContain('Record failed to save');
        });
      });
    });

    xit('should require role fields', function() {
      // TODO
      shared.createBtn.click();

      // Attempt to create a new User with the email of an existing user
      users.emailFormField.sendKeys(params.login.user);

      randomUser = Math.floor((Math.random() * 1000) + 1);
      users.firstNameFormField.sendKeys('First' + randomUser);
      users.lastNameFormField.sendKeys('Last' + randomUser);
      users.externalIdFormField.sendKeys('12345');
      users.submitFormBtn.click().then(function() {
        // New user not added, invite sent to existing user
        expect(shared.tableElements.count()).toBe(userCount);
        expect(shared.successMessage.getText()).toContain('User already exists. Sending ' + params.login.user + ' an invite for');
        shared.closeMessageBtn.click().then(function() {
          expect(shared.errorMessage.getText()).toContain('Record failed to save');
        });
      });
    });
  });
});
