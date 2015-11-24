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
    newUserName,
    newTenantName,
    defaultTenantName;

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
    expect(users.rightPanel.isDisplayed()).toBeTruthy();
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
    expect(users.platformRoleFormDropdownOptions.get(2).getText()).toBe(users.platformRoles[1]);

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
    expect(users.rightPanel.isDisplayed()).toBeTruthy();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    users.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not accept spaces as valid input for required email field', function() {
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

  it('should not accept spaces as valid input for required name fields', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Enter a space into each field, select required dropdown field
    users.emailFormField.sendKeys('titantestrequired' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get(1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('  ');
    users.lastNameFormField.sendKeys('  ');
    users.externalIdFormField.sendKeys('  ');

    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    users.submitFormBtn.click();
    expect(shared.tableElements.count()).toBe(userCount);
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Verify error messages are displayed
    expect(users.requiredErrors.count()).toBe(2);
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a last name');
  });

  it('should display new user in table and display user details with correct Tenant Status', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    newUserName = 'First' + randomUser + ' Last' + randomUser;
    var newUserEmail = 'titantest' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.externalIdFormField.sendKeys(randomUser);

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm user is displayed in user list with correct details
      shared.searchField.sendKeys(newUserEmail);
      expect(shared.tableElements.count()).toBe(1);
      shared.firstTableRow.click();
      expect(users.userNameDetailsHeader.getText()).toBe(newUserName);
    });
  });

  it('should clear and close new user details after clicking Cancel', function() {
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
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Create new User form is closed
    expect(users.rightPanel.isDisplayed()).toBeFalsy();

    // Fields are cleared
    shared.createBtn.click();
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.tenantRoleFormDropdown.$('option:checked').getText()).toContain('Select a role');
    expect(users.platformRoleFormDropdown.$('option:checked').getText()).toContain('Select a role');
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
    expect(users.tenantRoleFormDropdown.getAttribute('disabled')).toBeNull();
    expect(users.platformRoleFormDropdown.getAttribute('disabled')).toBeNull();

    // Fields remain disabled
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

  it('should require First Name, and Last Name', function() {
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
    expect(users.firstNameFormField.isEnabled()).toBeTruthy();
    expect(users.lastNameFormField.isEnabled()).toBeTruthy();
    expect(users.externalIdFormField.isEnabled()).toBeTruthy();

    expect(users.submitFormBtn.isEnabled()).toBeFalsy();

    users.submitFormBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    users.firstNameFormField.click();
    users.lastNameFormField.click();
    users.externalIdFormField.click();

    expect(users.requiredErrors.count()).toBe(2);
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a last name');
  });

  it('should not require External Id', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    newUserName = 'First' + randomUser + ' Last' + randomUser;
    var newUserEmail = 'titantest' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm user is displayed in user list with correct details
      shared.searchField.sendKeys(newUserEmail);
      expect(shared.tableElements.count()).toBe(1);
      shared.firstTableRow.click();
      expect(users.userNameDetailsHeader.getText()).toBe(newUserName);
      expect(users.externalIdFormField.getAttribute('value')).toBe('');
    });
  });

  it('should require valid Email field input', function() {
    randomUser = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    users.emailFormField.sendKeys(randomUser + '\t');
    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Must be a valid email address');
    expect(users.tenantRoleFormDropdown.getAttribute('disabled')).toBeNull();
    expect(users.platformRoleFormDropdown.getAttribute('disabled')).toBeNull();

    // Fields remain disabled
    expect(users.firstNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.lastNameFormField.getAttribute('disabled')).toBeTruthy();
    expect(users.externalIdFormField.getAttribute('disabled')).toBeTruthy();

    users.emailFormField.clear();
    users.emailFormField.sendKeys(randomUser + '.' + randomUser + '\t');
    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy;
    expect(users.requiredErrors.get(0).getText()).toBe('Must be a valid email address');


    expect(users.tenantRoleFormDropdown.getAttribute('disabled')).toBeNull();
    expect(users.platformRoleFormDropdown.getAttribute('disabled')).toBeNull();

    // Fields remain disabled
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
        expect(shared.detailsFormHeader.getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(shared.detailsFormHeader.getText()).toContain(users.lastNameFormField.getAttribute('value'));

        // Required details are populated
        expect(users.emailLabel.getText()).toBe(existingUserEmail);
        expect(users.tenantRoleFormDropdown.getAttribute('value')).not.toBeNull();
      });
    });
  });

  xit('should show user details when entering existing tenant user email; case insensitive', function() {
    var caseChangeExistingEmail;
    shared.createBtn.click();

    // Change sort order to list user's without First or Last names at the bottom
    columns.columnTwoHeader.click();

    // Attempt to create a new User with the email of an existing user
    shared.firstTableRow.element(by.css(users.emailColumn)).getText().then(function(existingUserEmail) {
      caseChangeExistingEmail = existingUserEmail.substring(0, 4).toUpperCase() + existingUserEmail.substring(4, existingUserEmail.length).toLowerCase();

      users.emailFormField.sendKeys(caseChangeExistingEmail + '\t');

      // User details form displayed instead of creating a new user
      expect(shared.detailsFormHeader.getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(shared.detailsFormHeader.getText()).toContain(users.lastNameFormField.getAttribute('value'));

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
    shared.waitForAlert();
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

    //Fill out all fields
    users.emailFormField.sendKeys('not a valid email');
    users.tenantRoleFormDropdownOptions.get(1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    //Click Create button again
    shared.createBtn.click();
    shared.waitForAlert();
    shared.dismissChanges();

    //Expect all fields to have been cleared
    expect(users.firstNameFormField.getAttribute('value')).toBe('');
    expect(users.lastNameFormField.getAttribute('value')).toBe('');
    expect(users.emailFormField.getAttribute('value')).toBe('');
    expect(users.tenantRoleFormDropdown.getAttribute('value')).toBe('');
    expect(users.externalIdFormField.getAttribute('value')).toBe('');
  });

  it('should allow newly added user to be edited', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    newUserName = 'First' + randomUser + ' Last' + randomUser;

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.externalIdFormField.sendKeys(randomUser);

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Edit user details
      users.firstNameFormField.sendKeys('NewUserEdit');
      users.lastNameFormField.sendKeys('NewUserEdit');
      users.externalIdFormField.sendKeys('NewUserEdit');
      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // User found in table by updated name
        shared.searchField.sendKeys('First' + randomUser + 'NewUserEdit');
        expect(shared.tableElements.count()).toBeGreaterThan(0);

        shared.firstTableRow.click();

        // All fields updated
        expect(users.firstNameFormField.getAttribute('value')).toBe('First' + randomUser + 'NewUserEdit');
        expect(users.lastNameFormField.getAttribute('value')).toBe('Last' + randomUser + 'NewUserEdit');
        expect(users.externalIdFormField.getAttribute('value')).toBe(randomUser + 'NewUserEdit');
      });
    });
  });

  it('should add new user with status toggle disabled', function() {
    // Add randomness to user details
    randomUser = Math.floor((Math.random() * 1000) + 1);
    newUserName = 'First' + randomUser + ' Last' + randomUser;
    var newUserEmail = 'titantest' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.externalIdFormField.sendKeys(randomUser);

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Confirm user is enabled by default
      expect(users.activeFormToggle.isEnabled()).toBeFalsy();
    });
  });
});
