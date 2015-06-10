'use strict';

describe('The users view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    users = require('./users.po.js'),
    userQueryText,
    statusFilterText,
    userCount;

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

  it('should include users management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(users.userSearchField.getAttribute('placeholder')).toBe('Search');
    expect(users.createUserBtn.getText()).toBe('Create');
    expect(users.actionsBtn.isDisplayed()).toBeTruthy();

    expect(users.tableColumnsDropDown.getText()).toBe('Columns');
    expect(users.userTable.isDisplayed()).toBeTruthy();
    expect(users.statusTableDropDown.isDisplayed()).toBeTruthy();
    expect(users.stateTableDropDown.isDisplayed()).toBeTruthy();

    expect(users.userDetails.isDisplayed()).toBeTruthy();
  });

  it('should display supported fields for editing a user', function() {
    // Select user row
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).click();
    expect(users.firstNameFormField.isDisplayed()).toBeTruthy();
    expect(users.lastNameFormField.isDisplayed()).toBeTruthy();
    expect(users.displayNameFormField.isDisplayed()).toBeTruthy();
    expect(users.externalIdFormField.isDisplayed()).toBeTruthy();
    expect(users.roleFormDropDown.isDisplayed()).toBeTruthy();
    expect(users.stateFormDropDown.isDisplayed()).toBeTruthy();
    expect(users.statusFormToggle.isDisplayed()).toBeTruthy();

    // User details not able to be edited are not displayed
    expect(users.emailFormField.isDisplayed()).toBeFalsy();

    // Reset password button displayed instead of form field
    expect(users.passwordFormField.isDisplayed()).toBeFalsy();
    expect(users.passwordEditFormBtn.isDisplayed()).toBeTruthy();

    expect(users.cancelUserFormBtn.isDisplayed()).toBeTruthy();
    expect(users.submitUserFormBtn.isDisplayed()).toBeTruthy();

    expect(users.createNewUserHeader.isPresent()).toBeFalsy();
  });

  it('should display users based on the user Search', function() {
    // TODO: Update with values that will be more likely to always match users

    users.userSearchField.sendKeys('Titan');
    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan');
        });
      };
    });

    users.userSearchField.clear();
    users.userSearchField.sendKeys('tan');
    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('tan');
        });
      };
    });

    users.userSearchField.clear();
    users.userSearchField.sendKeys('USER');
    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('user');
        });
      };
    });

    users.userSearchField.clear();
    users.userSearchField.sendKeys('Ti*er');
    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ti');
          expect(value.toLowerCase()).toContain('er');
        });
      };
    });

    users.userSearchField.clear();
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should display users based on the table Status filter', function() {
    // Select Disabled from Status drop down
    users.statusTableDropDown.click();
    users.statusTableDropDown.all(by.css('input')).get(1).click();
    expect(users.statusTableDropDown.all(by.css('input')).get(1).getAttribute('checked')).toBe('true');
    expect(users.statusTableDropDown.all(by.css('input')).get(0).getAttribute('checked')).toBe(null);
    users.statusTableDropDown.click();
    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(rows[i].getText()).toContain('Disabled');
      };
    });

    // Select Enabled from Status drop down
    users.statusTableDropDown.click();
    users.statusTableDropDown.all(by.css('input')).get(1).click();
    users.statusTableDropDown.all(by.css('input')).get(2).click();
    users.statusTableDropDown.click();
    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(rows[i].getText()).toContain('Enabled');
      };
    });

    // Select All from Status drop down
    users.statusTableDropDown.click();
    users.statusTableDropDown.all(by.css('input')).get(0).click();
    expect(users.statusTableDropDown.all(by.css('input')).get(0).getAttribute('checked')).toBe('true');
    expect(users.statusTableDropDown.all(by.css('input')).get(1).getAttribute('checked')).toBe(null);
    expect(users.statusTableDropDown.all(by.css('input')).get(2).getAttribute('checked')).toBe(null);
    users.statusTableDropDown.click();
    // Expect all users to be displayed
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should display users based on the table State filter', function() {
    // One State selected
    users.stateTableDropDown.click(); // Open
    users.stateTableDropDown.all(by.css('input')).get(3).click(); // Select Ready
    // All is deselected
    expect(users.stateTableDropDown.all(by.css('input')).get(3).getAttribute('checked')).toBe('true');
    expect(users.stateTableDropDown.all(by.css('input')).get(0).getAttribute('checked')).toBe(null);
    users.stateTableDropDown.click(); // Close

    users.userElements.then(function(rows) {
      for (var j = 1; j <= rows.length; ++j) {
        expect(element(by.css('tr.ng-scope:nth-child(' + j + ') > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe('READY');
      };
    });

    // Multiple States selected
    users.stateTableDropDown.click(); // Open
    users.stateTableDropDown.all(by.css('input')).get(1).click(); // Select Busy
    users.stateTableDropDown.click(); // Close

    var userHasState = false;
    var currentUserState;
    users.userElements.then(function(rows) {
      for (var j = 1; j <= rows.length; ++j) {
        element(by.css('tr.ng-scope:nth-child(' + j + ') > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state').then(function(value) {
          expect(['BUSY', 'READY']).toContain(value);
        });
      };
    });

    // All selected
    users.stateTableDropDown.click(); // Open
    users.stateTableDropDown.all(by.css('input')).get(0).click(); // Select All
    // Previous selections are deselected
    expect(users.stateTableDropDown.all(by.css('input')).get(0).getAttribute('checked')).toBe('true');
    expect(users.stateTableDropDown.all(by.css('input')).get(3).getAttribute('checked')).toBe(null);
    expect(users.stateTableDropDown.all(by.css('input')).get(1).getAttribute('checked')).toBe(null);
    users.stateTableDropDown.click(); // Close
    // Expect all users to be displayed
    expect(users.userElements.count()).toBe(userCount);
  });

  it('should display users based on the Search, Status and State filters', function() {
    // Search
    users.userSearchField.sendKeys('a');

    // Select Status filter
    users.statusTableDropDown.click(); // Open
    users.statusTableDropDown.all(by.css('input')).get(2).click();
    users.statusTableDropDown.click(); // Close

    // Select State filter
    users.stateTableDropDown.click(); // Open
    users.stateTableDropDown.all(by.css('input')).get(3).click(); // Select Ready
    users.stateTableDropDown.click(); // Close

    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('a');
        });
        expect(rows[i].getText()).toContain('Enabled');
        expect(element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe('READY');
      };
    });

    // Update Search & add filter options
    users.userSearchField.clear();
    users.userSearchField.sendKeys('an');

    // Select Status filter
    users.statusTableDropDown.click(); // Open
    users.statusTableDropDown.all(by.css('input')).get(1).click();
    users.statusTableDropDown.click(); // Close

    // Select State filter
    users.stateTableDropDown.click(); // Open
    users.stateTableDropDown.all(by.css('input')).get(4).click(); // Select Ready
    users.stateTableDropDown.click(); // Close

    users.userElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('an');
        });
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(6) > div:nth-child(1) > user-status:nth-child(1)')).getText().then(function(value) {
          expect(['Enabled', 'Disabled']).toContain(value);
        });
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state').then(function(value) {
          expect(['LOGIN', 'READY']).toContain(value);
        });
      };
    });
  });

  it('should display the selected user details in the user details section', function() {
    if (userCount > 0) {
      // Select user row
      element(by.css('tr.ng-scope:nth-child(1)')).click();
      expect(users.userDetails.isDisplayed()).toBeTruthy();

      // Verify user's name in table matches user details
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.lastNameFormField.getAttribute('value'));

      // Verify user's externalId in table matches user details
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));

      // Verify user's state in table matches user details
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe(element(by.css('h1.ng-binding > user-state:nth-child(1)')).getAttribute('state'));

      // Verify user's displayName matches
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(3)')).getAttribute('value')).toBe(element(by.css('h1.ng-binding')).getText());

      // Change user and verify all fields are updated
      if (userCount > 1) {
        element(by.css('tr.ng-scope:nth-child(2)')).click();
        expect(users.userDetails.isDisplayed()).toBeTruthy();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)')).getText()).toContain(users.lastNameFormField.getAttribute('value'));
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(5)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe(element(by.css('h1.ng-binding > user-state:nth-child(1)')).getAttribute('state'));
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(3)')).getAttribute('value')).toBe(element(by.css('h1.ng-binding')).getText());
      }
    }
  });

  it('should update table when user details are changed and saved', function() {
    // Select user row
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).click();
    expect(users.userDetails.isDisplayed()).toBeTruthy();

    // Update User details
    users.firstNameFormField.sendKeys('test');
    users.lastNameFormField.sendKeys('test');
    users.displayNameFormField.sendKeys('test');
    users.externalIdFormField.sendKeys('test');

    users.submitUserFormBtn.click().then(function() {
      expect(users.userDetails.isDisplayed()).toBeTruthy();
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe(element(by.css('h1.ng-binding > user-state:nth-child(1)')).getAttribute('state'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());
    }).then(function() {
      // Refresh browser and ensure changes persist
      browser.refresh();
      element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).click();
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe(element(by.css('h1.ng-binding > user-state:nth-child(1)')).getAttribute('state'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());
    }).then(function() {
      // Reset all user values
      users.firstNameFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.lastNameFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.displayNameFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.externalIdFormField.sendKeys('\u0008\u0008\u0008\u0008');
      users.submitUserFormBtn.click();
    });
  });

  it('should not update table when user details are changed and cancelled', function() {
    // Select user row
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).click();
    expect(users.userDetails.isDisplayed()).toBeTruthy();

    // Update User details
    users.firstNameFormField.sendKeys('test');
    users.lastNameFormField.sendKeys('test');
    users.displayNameFormField.sendKeys('test');
    users.externalIdFormField.sendKeys('test');

    users.cancelUserFormBtn.click().then(function() {
      expect(users.userDetails.isDisplayed()).toBeTruthy();

      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).not.toContain('test');
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).not.toContain('test');
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5)')).getText()).not.toContain('test');
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).not.toContain('test');

      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe(element(by.css('h1.ng-binding > user-state:nth-child(1)')).getAttribute('state'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());
    }).then(function() {
      // Refresh browser and ensure changes did not persist
      browser.refresh();
      element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).click();
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).not.toContain('test');
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).not.toContain('test');
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5)')).getText()).not.toContain('test');
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).not.toContain('test');

      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.lastNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(7) > div:nth-child(1) > user-state:nth-child(1)')).getAttribute('state')).toBe(element(by.css('h1.ng-binding > user-state:nth-child(1)')).getAttribute('state'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());
    });
  });
});
