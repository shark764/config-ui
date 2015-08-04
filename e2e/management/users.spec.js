'use strict';

describe('The users view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    userQueryText,
    statusFilterText,
    userCount;

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

  it('should include users management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(shared.searchField.getAttribute('placeholder')).toBe('Search');
    expect(shared.createBtn.getText()).toBe('Create');
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();

    expect(shared.tableColumnsDropDown.getText()).toBe('Columns');
    expect(shared.table.isDisplayed()).toBeTruthy();

    // Status field not displayed by default
    expect(users.statusTableDropDown.isPresent()).toBeFalsy();

    //Hide the right panel by default
    expect(shared.detailsForm.isDisplayed()).toBeFalsy();
  });

  it('should display supported fields for editing a user', function() {
    // Select user row
    shared.firstTableRow.click();
    expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
    expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();
    expect(users.externalIdFormField.isDisplayed()).toBeTruthy();

    // User email is not able to be edited
    expect(users.emailFormField.isPresent()).toBeFalsy();
    expect(users.emailLabel.isDisplayed()).toBeTruthy();

    // Reset password button displayed instead of form field
    expect(users.passwordFormField.isDisplayed()).toBeFalsy();
    expect(users.passwordEditFormBtn.isDisplayed()).toBeTruthy();

    expect(shared.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(shared.submitFormBtn.isDisplayed()).toBeTruthy();

    expect(shared.detailsFormHeader.getText()).not.toBe('Creating New User');
  });

  it('should display users based on the table Status filter', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDown.all(by.repeater('option in options track by option[valuePath]')).get(4).click();
    shared.tableColumnsDropDown.click();

    // Select Disabled from Status drop down
    users.statusTableDropDown.click();
    users.userStatuses.get(0).click();

    // Disabled input is selected
    expect(users.userStatusInputs.get(1).isSelected()).toBeTruthy();
    // All input is unselected
    expect(users.userStatusInputs.get(0).isSelected()).toBeFalsy();

    users.statusTableDropDown.click();
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(rows[i].getText()).toContain('Disabled');
      };
    });

    // Select Enabled from Status drop down
    users.statusTableDropDown.click();
    users.userStatuses.get(0).click();
    users.userStatuses.get(1).click();

    // Enabled input is selected
    expect(users.userStatusInputs.get(2).isSelected()).toBeTruthy();

    // Disabled and All inputs are unselected
    expect(users.userStatusInputs.get(1).isSelected()).toBeFalsy();
    expect(users.userStatusInputs.get(0).isSelected()).toBeFalsy();

    users.statusTableDropDown.click();
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(rows[i].getText()).toContain('Enabled');
      };
    });

    // Select All from Status drop down
    users.statusTableDropDown.click();
    users.allUserStatus.click();

    // All input is selected
    expect(users.userStatusInputs.get(0).isSelected()).toBeTruthy();

    // Disabled and Enabled inputs are unselected
    expect(users.userStatusInputs.get(1).isSelected()).toBeFalsy();
    expect(users.userStatusInputs.get(2).isSelected()).toBeFalsy();

    users.statusTableDropDown.click();
    // Expect all users to be displayed
    expect(shared.tableElements.count()).toBe(userCount);
  });

  it('should display users based on the Search and Status filters', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDown.all(by.repeater('option in options track by option[valuePath]')).get(4).click();
    shared.tableColumnsDropDown.click();

    // Search
    shared.searchField.sendKeys('a');

    // Select Status filter
    users.statusTableDropDown.click(); // Open
    users.userStatuses.get(1).click();
    users.statusTableDropDown.click(); // Close

    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('a');
        });
        expect(rows[i].getText()).toContain('Enabled');
      };
    });

    // Update Search & add filter options
    shared.searchField.clear();
    shared.searchField.sendKeys('se');

    // Select Status filter
    users.statusTableDropDown.click(); // Open
    users.userStatuses.get(0).click();
    users.statusTableDropDown.click(); // Close

    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('se');
        });

        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(5)')).getText().then(function(value) {
          expect(['Enabled', 'Disabled']).toContain(value);
        });
      };
    });
  });

  it('should display the selected user details in the user details section', function() {
    // Select user row
    shared.firstTableRow.click();

    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
    expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());

    // Change user and verify all fields are updated
    shared.tableElements.count().then(function(numUsers) {
      if (numUsers > 1) {
        shared.secondTableRow.click();

        expect(shared.secondTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(shared.secondTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
        expect(shared.secondTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
        expect(shared.secondTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
        expect(shared.secondTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
      }
    });
  });

  it('should not update table when user details are changed and cancelled', function() {
    // Select user row
    shared.firstTableRow.click();

    // Update User details
    users.firstNameFormField.sendKeys('cancel');
    users.lastNameFormField.sendKeys('cancel');
    users.externalIdFormField.sendKeys('cancel');

    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept().then(function() {
      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).not.toContain('cancel');
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).not.toContain('cancel');

      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
    }).then(function() {
      // Refresh browser and ensure changes did not persist
      browser.refresh();
      shared.firstTableRow.click();
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).not.toContain('cancel');
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).not.toContain('cancel');

      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
    });
  });

  it('should update table when user details are changed and saved', function() {
    // Select user row
    shared.firstTableRow.click();

    // Update User details
    users.firstNameFormField.sendKeys('test');
    users.lastNameFormField.sendKeys('test');
    users.externalIdFormField.sendKeys('test');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
    }).then(function() {
      // Refresh browser and ensure changes persist
      browser.refresh();
      shared.firstTableRow.click();
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(shared.detailsFormHeader.getText());
    }).then(function() {
      // Reset all user values
      users.firstNameFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.lastNameFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.externalIdFormField.sendKeys('\u0008\u0008\u0008\u0008');
      shared.submitFormBtn.click();
    });
  });

  it('should require First Name when editing', function() {
    // Select first user from table
    shared.firstTableRow.click();

    // Edit fields
    users.firstNameFormField.clear();
    users.lastNameFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a first name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should require Last Name when editing', function() {
    // Select first user from table
    shared.firstTableRow.click();

    // Edit fields
    users.lastNameFormField.clear();
    users.firstNameFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a last name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require External Id when editing', function() {
    // Select first user from table
    shared.firstTableRow.click();

    // Edit fields
    users.externalIdFormField.sendKeys('temp'); // Incase the field was already empty
    users.externalIdFormField.clear();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should not require Personal Telephone when editing', function() {
    // Select first user from table
    shared.firstTableRow.click();

    // Edit fields
    users.personalTelephoneFormField.sendKeys('temp'); // Incase the field was already empty
    users.personalTelephoneFormField.clear();
    users.firstNameFormField.click();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should display password field when editing button is selected', function() {
    // Select first user from table
    shared.firstTableRow.click();
    users.passwordEditFormBtn.click();

    expect(users.passwordFormField.isDisplayed()).toBeTruthy();
    expect(users.passwordEditFormBtn.isDisplayed()).toBeFalsy();

    shared.cancelFormBtn.click();

    // Warning message is displayed
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(users.passwordFormField.isDisplayed()).toBeFalsy();
    expect(users.passwordEditFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should require password when editing button is selected', function() {
    // Select first user from table
    shared.firstTableRow.click();

    users.passwordEditFormBtn.click();
    users.passwordFormField.click();
    users.firstNameFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(users.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a password');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not accept spaces as valid input when editing', function() {
    shared.firstTableRow.click();

    // Enter a space into each field
    users.firstNameFormField.clear();
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.clear();
    users.lastNameFormField.sendKeys(' ');
    users.externalIdFormField.clear();

    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a last name');
  });

  it('should successfully update password', function() {
    shared.firstTableRow.click();
    var randomPassword = 'newpassword' + Math.floor((Math.random() * 1000) + 1);

    users.emailLabel.getText(function(userEmail) {
      users.passwordEditFormBtn.click();
      users.passwordFormField.sendKeys(randomPassword);
      shared.submitFormBtn.click();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Close success message
      shared.closeMessageBtn.click();

      // Password field is hidden after saving
      expect(users.passwordEditFormBtn.isDisplayed()).toBeTruthy();
      expect(users.passwordFormField.isDisplayed()).toBeFalsy();

      // Login with user's new password
      shared.welcomeMessage.click();
      shared.logoutButton.click();
      loginPage.login(userEmail, randomPassword);
    });
  });

  it('should prevent invalid E164 numbers from being accepted', function() {
    shared.firstTableRow.click();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();

    //ensure the field is empty
    users.personalTelephoneFormField.clear();

    users.personalTelephoneFormField.sendKeys('a15064704361');

    users.firstNameFormField.click();

    expect(users.personalTelephoneFormField.getAttribute('class')).toContain('ng-invalid');
    expect(users.requiredErrors.get(0).getText()).toBe('Phone number should be in E.164 format.');
  });

  it('should allow E164 numbers to be accepted', function() {
    shared.firstTableRow.click();
    expect(users.personalTelephoneFormField.isDisplayed()).toBeTruthy();

    //ensure the field is empty
    users.personalTelephoneFormField.clear();

    users.personalTelephoneFormField.sendKeys('15064704361');

    users.firstNameFormField.click();

    //limits the user to digits only, limits the user to 15 characters, should prepend a +
    expect(users.personalTelephoneFormField.getAttribute('value')).toBe('+1 506-470-4361');
  });

  describe('bulk actions', function(){
    //Regression test for TITAN2-2237
    it('should only display confirm dialog once when switching selected elements', function() {
      //Dirty the bulk action form
      shared.actionsBtn.click();
      users.statusBulkEnableCheck.click();

      //Select a table item and dismiss the expected alert
      shared.firstTableRow.click();
      shared.dismissChanges();

      //Select another table item and expect there not to be an alert
      shared.secondTableRow.click();
    });
  });

});
