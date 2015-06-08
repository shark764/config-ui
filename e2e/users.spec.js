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
    expect(users.createUserBtn.getText()).toBe('Create');
    expect(users.userSearchField.getAttribute('placeholder')).toBe('Search');
    expect(users.userTable.isDisplayed()).toBeTruthy();
    // expect(users.userDetails.isDisplayed()).toBeTruthy();
  });

  it('should display users based on the user Search', function() {
    // TODO: Update with values that will be more likely to always match users

    users.userSearchField.sendKeys('Ron');
    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(1)')).getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ron');
        });
      };
    });

    users.userSearchField.clear();
    users.userSearchField.sendKeys('B');
    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(1)')).getText().then(function(value) {
          expect(value.toLowerCase()).toContain('b');
        });
      };
    });

    users.userSearchField.clear();
    users.userSearchField.sendKeys('Ro*Bur');
    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(1)')).getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ro');
          expect(value.toLowerCase()).toContain('bur');
        });
      };
    });

    users.userSearchField.clear();
    expect(element.all(by.repeater('user in filteredUsers')).count()).toBe(userCount);
  });

  it('should display users based on the table Status filter', function() {
    // Select Disabled from Status drop down
    users.statusTableDropDown.click();
    users.statusTableDropDown.all(by.css('input')).get(1).click();
    expect(users.statusTableDropDown.all(by.css('input')).get(1).getAttribute('checked')).toBe('true');
    expect(users.statusTableDropDown.all(by.css('input')).get(0).getAttribute('checked')).toBe(null);
    users.statusTableDropDown.click();
    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(4)')).getText()).toBe('Disabled');
      };
    });

    // Select Enabled from Status drop down
    users.statusTableDropDown.click();
    users.statusTableDropDown.all(by.css('input')).get(1).click();
    users.statusTableDropDown.all(by.css('input')).get(2).click();
    users.statusTableDropDown.click();
    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(4)')).getText()).toBe('Enabled');
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
    expect(element.all(by.repeater('user in filteredUsers')).count()).toBe(userCount);
  });

  it('should display users based on the table State filter', function() {
    // One State selected
    users.stateTableDropDown.click(); // Open
    users.stateTableDropDown.all(by.css('input')).get(3).click(); // Select Ready
    // All is deselected
    expect(users.stateTableDropDown.all(by.css('input')).get(3).getAttribute('checked')).toBe('true');
    expect(users.stateTableDropDown.all(by.css('input')).get(0).getAttribute('checked')).toBe(null);
    users.stateTableDropDown.click(); // Close

    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var j = 1; j <= rows.length; ++j) {
        expect(element(by.css('tr.ng-scope:nth-child(' + j + ') > td:nth-child(5) > div:nth-child(1)')).getAttribute('state')).toBe('READY');
      };
    });

    // Multiple States selected
    users.stateTableDropDown.click(); // Open
    users.stateTableDropDown.all(by.css('input')).get(1).click(); // Select Busy
    users.stateTableDropDown.click(); // Close

    var userHasState = false;
    var currentUserState;
    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var j = 0; j < rows.length; ++j) {
        element(by.css('tr.ng-scope:nth-child(' + (j + 1) + ') > td:nth-child(5) > div:nth-child(1)')).getAttribute('state').then(function(value) {
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
    expect(element.all(by.repeater('user in filteredUsers')).count()).toBe(userCount);
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

    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var i = 1; i <= rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
          expect(value.toLowerCase()).toContain('a');
        });
        expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(4)')).getText()).toBe('Enabled');
        expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(5) > div:nth-child(1)')).getAttribute('state')).toBe('READY');
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

    element.all(by.repeater('user in filteredUsers')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(2)')).getText().then(function(value) {
          expect(value.toLowerCase()).toContain('an');
        });
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(4)')).getText().then(function(value) {
          expect(['Enabled', 'Disabled']).toContain(value);
        });
        element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(5) > div:nth-child(1)')).getAttribute('state').then(function(value) {
          expect(['LOGIN', 'READY']).toContain(value);
        });
      };
    });
  });

  it('should display the selected user details in the user details section', function() {
    if (userCount > 0) {
      // Select user row
      element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).click();
      expect(users.userDetails.isDisplayed()).toBeTruthy();

      // Verify user's name in table matches user details
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toContain(users.lastNameFormField.getAttribute('value'));

      // Verify user's externalId in table matches user details
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));

      // Verify user's state in table matches user details
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(5) > div:nth-child(1)')).getAttribute('state')).toBe(users.stateFormDropDown.getAttribute('value'));

      // Verify user's displayName matches
      expect(element(by.model('user.displayName')).getAttribute('value')).toBe(element(by.css('h2.ng-binding')).getText());

      // Verify remaining required fields are completed
      expect(element(by.model('user.firstName')).getAttribute('value')).toBeTruthy();

      // Change user and verify all fields are updated
      if (userCount > 1) {
        element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)')).click();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)')).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(3)')).getText()).toBe(users.externalIdFormField.getAttribute('value'));
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(5) > div:nth-child(1)')).getAttribute('state')).toBe(users.stateFormDropDown.getAttribute('value'));
        expect(element(by.model('user.displayName')).getAttribute('value')).toBe(element(by.css('h2.ng-binding')).getText());
        expect(element(by.model('user.firstName')).getAttribute('value')).toBeTruthy();
      }
    }
  });

  xit('should update table when user details are changed', function() {
    // TODO Update selectors for user Details
    // Select user row
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).click();
    expect(userDetails.isDisplayed()).toBeTruthy();

    // Update User details
    element(by.model('user.firstName')).sendKeys('test\n');
    element(by.model('user.lastName')).sendKeys('test\n');
    element(by.model('user.displayName')).sendKeys('test\n');
    element(by.model('user.email')).sendKeys('test\n');
    element(by.model('user.externalId')).sendKeys('test\n');
    // TODO Add telephone and any other user details that can be updated

    // Verify user's name in table matches new user details
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toContain(element(by.css('user.firstName')).getAttribute('value'));
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());

    // Verify user's externalId in table matches new user details
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(element(by.model('user.externalId')).getAttribute('value'));

    // Verify user's state in table matches new user details
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(4)')).getText()).toBe(element(by.css('user-state.ng-isolate-scope > div:nth-child(1) > span:nth-child(1)')).getText());

    // Verify user's displayName matches new value
    expect(element(by.model('user.displayName')).getAttribute('value')).toBe(element(by.css('h2.ng-binding')).getText());

    // Verify remaining required fields are completed
    expect(element(by.model('user.firstName')).getAttribute('value')).toBeTruthy();
    expect(element(by.model('user.email')).getAttribute('value')).toBeTruthy();

    // Refresh browser and ensure changes persist
    browser.refresh();
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).click();
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toContain(element(by.model('user.firstName')).getAttribute('value'));
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toContain(element(by.model('user.lastName')).getAttribute('value'));
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(element(by.model('user.externalId')).getAttribute('value'));
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(4)')).getText()).toBe(element(by.css('user-state.ng-isolate-scope > div:nth-child(1) > span:nth-child(1)')).getText());
    expect(element(by.model('user.displayName')).getAttribute('value')).toBe(element(by.css('h2.ng-binding')).getText());
    expect(element(by.model('user.firstName')).getAttribute('value')).toBeTruthy();
    expect(element(by.model('user.email')).getAttribute('value')).toBeTruthy();

    // Reset all user values
    element(by.model('user.firstName')).sendKeys('\u0008\u0008\u0008\u0008\n');
    element(by.model('user.lastName')).sendKeys('\u0008\u0008\u0008\u0008\n');
    element(by.model('user.displayName')).sendKeys('\u0008\u0008\u0008\u0008\n');
    element(by.model('user.email')).sendKeys('\u0008\u0008\u0008\u0008\n');
    element(by.model('user.externalId')).sendKeys('\u0008\u0008\u0008\u0008\n');
  });

});
