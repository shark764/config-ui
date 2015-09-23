'use strict';

describe('The users view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    columns = require('../tableControls/columns.po.js'),
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

    expect(users.tableDropDowns.get(0).isPresent()).toBeTruthy();
    expect(users.tableDropDowns.get(1).isPresent()).toBeTruthy();

    //Hide the right panel by default
    expect(users.rightPanel.isDisplayed()).toBeFalsy();
  });

  it('should display supported fields for editing a user', function() {
    // Select user row
    shared.firstTableRow.click();
    expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
    expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
    expect(users.externalIdFormField.isDisplayed()).toBeTruthy();

    // User email is not able to be edited
    expect(users.emailFormField.isPresent()).toBeFalsy();
    expect(users.emailLabel.isDisplayed()).toBeTruthy();

    // Reset password and Telephone form fields are not displayed
    expect(users.passwordFormField.isPresent()).toBeFalsy();
    expect(users.personalTelephoneFormField.isPresent()).toBeFalsy();

    expect(users.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(users.submitFormBtn.isDisplayed()).toBeTruthy();

    expect(users.userNameDetailsHeader.getText()).not.toBe('Creating New User');
  });

  xit('should restrict editing user detail fields for others', function() {
    // TODO With roles testing; need to login with a user that does not have platform admin role
    // Select user row
    shared.firstTableRow.click();
    expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
    expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
    expect(users.externalIdFormField.isDisplayed()).toBeTruthy();

    // Fields are not editable for other users
    users.emailLabel.getText().then(function(selectedUserEmail) {
      if (selectedUserEmail != params.login.user) {
        expect(users.firstNameFormField.getAttribute('disabled')).toBeTruthy();
        expect(users.lastNameFormField.getAttribute('disabled')).toBeTruthy();
        expect(users.externalIdFormField.getAttribute('disabled')).toBeTruthy();
      }
    }).thenFinally(function() {
      // Fields can be edited for your own user
      shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
      shared.firstTableRow.click();

      expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
      expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
      expect(users.externalIdFormField.isDisplayed()).toBeTruthy();

      expect(users.firstNameFormField.getAttribute('disabled')).toBeNull();
      expect(users.lastNameFormField.getAttribute('disabled')).toBeNull();
      expect(users.externalIdFormField.getAttribute('disabled')).toBeNull();
    });
  });

  it('should display the selected user details in the user details section', function() {
    // Select External Id column
    shared.tableColumnsDropDown.click();
    columns.options.get(2).click();
    expect(columns.optionCheckboxes.get(2).getAttribute('selected')).toBeTruthy();
    shared.tableColumnsDropDown.click();

    // Select user row
    shared.firstTableRow.click();

    shared.firstTableRow.element(by.css(users.nameColumn)).getText().then(function(firstRowUserName) {
      if (firstRowUserName) {
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
        expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());
      } else {
        expect(users.firstNameFormField.getAttribute('value')).toBe('');
        expect(users.lastNameFormField.getAttribute('value')).toBe('');
        expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
        expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
        expect(users.userNameDetailsHeader.getText()).toBe('');
      }
    }).then(function() {
      // Change user and verify all fields are updated
      shared.tableElements.count().then(function(numUsers) {
        if (numUsers > 1) {
          shared.secondTableRow.click();

          shared.secondTableRow.element(by.css(users.nameColumn)).getText().then(function(secondRowUserName) {
            if (secondRowUserName) {
              expect(shared.secondTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
              expect(shared.secondTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
              expect(shared.secondTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
              expect(shared.secondTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
              expect(shared.secondTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());
            } else {
              expect(users.firstNameFormField.getAttribute('value')).toBe('');
              expect(users.lastNameFormField.getAttribute('value')).toBe('');
              expect(shared.secondTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
              expect(shared.secondTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
              expect(users.userNameDetailsHeader.getText()).toBe('');
            }
          });
        }
      });
    });
  });

  it('should not update table when user details are changed and cancelled', function() {
    // Select External Id column
    shared.tableColumnsDropDown.click();
    columns.options.get(2).click();
    expect(columns.optionCheckboxes.get(2).getAttribute('selected')).toBeTruthy();
    shared.tableColumnsDropDown.click();

    // Select user row
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    // Update User details
    users.firstNameFormField.sendKeys('cancel');
    users.lastNameFormField.sendKeys('cancel');
    users.externalIdFormField.sendKeys('cancel');

    users.cancelFormBtn.click();

    // Warning message is displayed
    shared.dismissChanges();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).not.toContain('cancel');
    expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).not.toContain('cancel');

    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());

    // Refresh browser and ensure changes did not persist
    browser.refresh();

    // Select External Id column
    shared.tableColumnsDropDown.click();
    columns.options.get(2).click();
    expect(columns.optionCheckboxes.get(2).getAttribute('selected')).toBeTruthy();
    shared.tableColumnsDropDown.click();

    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).not.toContain('cancel');
    expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).not.toContain('cancel');

    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());
  });

  it('should update table when user details are changed and saved', function() {
    // Select External Id column
    shared.tableColumnsDropDown.click();
    columns.options.get(2).click();
    expect(columns.optionCheckboxes.get(2).getAttribute('selected')).toBeTruthy();
    shared.tableColumnsDropDown.click();

    // Select user row
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    // Update User details
    users.firstNameFormField.sendKeys('test');
    users.lastNameFormField.sendKeys('test');
    users.externalIdFormField.sendKeys('test');

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      shared.searchField.clear();
      shared.searchField.sendKeys(params.login.firstName + 'test ' + params.login.lastName + 'test');
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());
    }).then(function() {
      // Refresh browser and ensure changes persist
      browser.refresh();
      // Select External Id column
      shared.tableColumnsDropDown.click();
      columns.options.get(2).click();
      expect(columns.optionCheckboxes.get(2).getAttribute('selected')).toBeTruthy();
      shared.tableColumnsDropDown.click();

      shared.searchField.sendKeys(params.login.firstName + 'test ' + params.login.lastName + 'test');
      shared.firstTableRow.click();

      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.externalIdColumn)).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());
    }).then(function() {
      // Reset all user values
      users.firstNameFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.lastNameFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.externalIdFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should not require First Name when editing', function() {
    // Select first user from table
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    // Edit fields
    users.firstNameFormField.sendKeys('not required');
    users.firstNameFormField.clear();
    users.lastNameFormField.click();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeNull();

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    }).thenFinally(function() {
      // Reset First Name
      users.firstNameFormField.sendKeys(params.login.firstName);

      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should not require Last Name when editing', function() {
    // Select first user from table
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    // Edit fields
    users.lastNameFormField.sendKeys('not required');
    users.lastNameFormField.clear();
    users.firstNameFormField.click();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeNull();

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    }).thenFinally(function() {
      // Reset Last Name
      users.lastNameFormField.sendKeys(params.login.lastName);

      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should display email when First and Last name are blank', function() {
    // Select first user from table
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();

    // Edit fields
    users.firstNameFormField.sendKeys('not required');
    users.lastNameFormField.sendKeys('not required');
    users.firstNameFormField.clear();
    users.lastNameFormField.clear();
    users.firstNameFormField.click();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeNull();

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // User name is shown as email in table and details header
      expect(shared.tableElements.count()).toBeGreaterThan(0);
      expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(params.login.user);
      expect(users.userNameDetailsHeader.getText()).toBe(params.login.user);

    }).thenFinally(function() {
      // Reset User Name
      users.firstNameFormField.sendKeys(params.login.firstName);
      users.lastNameFormField.sendKeys(params.login.lastName);

      users.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  it('should not require External Id when editing', function() {
    // Select first user from table
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    // Edit fields
    users.externalIdFormField.sendKeys('not required'); // Incase the field was already empty
    users.externalIdFormField.clear();
    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  xit('should not accept spaces as valid input when editing', function() {
    // TODO Fails
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    // Enter a space into each field
    users.firstNameFormField.clear();
    users.firstNameFormField.sendKeys(' ');
    users.lastNameFormField.clear();
    users.lastNameFormField.sendKeys(' ');
    users.externalIdFormField.clear();

    expect(users.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    expect(shared.tableElements.count()).toBe(userCount);

    // Verify error messages are displayed
    expect(users.requiredErrors.get(0).getText()).toBe('Please enter a first name');
    expect(users.requiredErrors.get(1).getText()).toBe('Please enter a last name');
  });

  it('should not allow user to update it\'s own status', function() {
    // Select current user from table
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    shared.firstTableRow.click();

    expect(users.activeFormToggle.getAttribute('disabled')).toBeTruthy();
  });

  describe('bulk actions', function() {
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
