'use strict';

describe('The users view', function () {
  var Q = require("q");
  var navBar = element(by.css('nav')),
    emailLogin = element(by.model('username')),
    passwordLogin = element(by.model('password')),
    loginButton = element(by.css('.login-btn')),
    queryUserField = element(by.model('queryUser')),
    userTable = element(by.css('.user-table')),
    userDetails = element(by.id('user-details-container')),
    statusDropDown = element(by.css('.user-table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(3) > dropdown:nth-child(1)')),
    stateDropDown = element(by.css('.user-table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(4) > dropdown:nth-child(1)')),
    userQueryText,
    statusFilterText,
    userCount;

  beforeEach(function () {
    browser.get('http://localhost:3000/#/login');
    // Login
    emailLogin.sendKeys('test@test.com');
    passwordLogin.sendKeys('testpassword');
    loginButton.click();

    browser.get('http://localhost:3000/#/users');
    userCount = element.all(by.repeater('user in users')).count();
  });

  xit('should include users management page components', function() {
    expect(navBar.isDisplayed()).toBeTruthy();
    expect(element(by.css('ul.ng-scope > li:nth-child(1) > a:nth-child(1)')).getText()).toBe('Users Management');
    expect(element(by.css('#left-panel > div:nth-child(1) > button:nth-child(1)')).getText()).toBe('Create New User');
    expect(queryUserField.getAttribute('placeholder')).toBe('Search');
    expect(userTable.isDisplayed()).toBeTruthy();
    expect(userDetails.isDisplayed()).toBeTruthy();
  });

  xit('should display users based on the user Search', function() {
    // TO DO: Update with values that will be more likely to always match users

    queryUserField.sendKeys('Ron');
    element.all(by.repeater('user in users')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(1)')).getText().then(function (value) {
          expect(value.toLowerCase()).toContain('ron');
        });
      };
    });

    queryUserField.clear();
    queryUserField.sendKeys('B');
    element.all(by.repeater('user in users')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(1)')).getText().then(function (value) {
          expect(value.toLowerCase()).toContain('b');
        });
      };
    });

    queryUserField.clear();
    queryUserField.sendKeys('Ro*Bur');
    element.all(by.repeater('user in users')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(1)')).getText().then(function (value) {
          expect(value.toLowerCase()).toContain('ro');
          expect(value.toLowerCase()).toContain('bur');
        });
      };
    });

    queryUserField.clear();
    expect(element.all(by.repeater('user in users')).count()).toBe(userCount);
  });

  xit('should display users based on the table Status filter', function() {
    // Select Disabled from Status drop down
    statusDropDown.click();
    statusDropDown.all(by.css('input')).get(1).click();
    expect(statusDropDown.all(by.css('input')).get(0).getAttribute('ng-checked')).toBe('false');
    statusDropDown.click();
    element.all(by.repeater('user in users')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(3)')).getText()).toBe('Disabled');
      };
    });

    // Select Enabled from Status drop down
    statusDropDown.click();
    statusDropDown.all(by.css('input')).get(1).click();
    statusDropDown.all(by.css('input')).get(2).click();
    statusDropDown.click();
    element.all(by.repeater('user in users')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(3)')).getText()).toBe('Enabled');
      };
    });

    // Select All from Status drop down
    statusDropDown.click();
    statusDropDown.all(by.css('input')).get(0).click();
    expect(statusDropDown.all(by.css('input')).get(1).getAttribute('ng-checked')).toBe('false');
    expect(statusDropDown.all(by.css('input')).get(2).getAttribute('ng-checked')).toBe('false');
    statusDropDown.click();
    // Expect all users to be displayed
    expect(element.all(by.repeater('user in users')).count()).toBe(userCount);
  });

  xit('should display users based on the table State filter', function() {
    // One State selected
    stateDropDown.click(); // Open
    stateDropDown.all(by.css('input')).get(3).click(); // Select Ready
    // All is deselected
    expect(stateDropDown.all(by.css('input')).get(0).getAttribute('ng-checked')).toBe('false');
    stateDropDown.click(); // Close

    element.all(by.repeater('user in users')).then(function(rows) {
      for (var j = 0; j < rows.length; ++j) {
        expect(element(by.css('tr.ng-scope:nth-child('+ (j+1) +') > td:nth-child(4)')).getText()).toBe('READY');
      };
    });

    // Multiple States selected
    stateDropDown.click(); // Open
    stateDropDown.all(by.css('input')).get(1).click(); // Select Busy
    stateDropDown.click(); // Close

    var userHasState = false;
    var currentUserState;
    element.all(by.repeater('user in users')).then(function(rows) {
      for (var j = 0; j < rows.length; ++j) {
        element(by.css('tr.ng-scope:nth-child('+ (j+1) +') > td:nth-child(4)')).getText().then(function (value) {
          expect(['BUSY', 'READY']).toContain(value);
        });
      };
    });

    // All selected
    stateDropDown.click(); // Open
    stateDropDown.all(by.css('input')).get(0).click(); // Select All
    // Previous selections are deselected
    expect(stateDropDown.all(by.css('input')).get(3).getAttribute('ng-checked')).toBe('false');
    expect(stateDropDown.all(by.css('input')).get(1).getAttribute('ng-checked')).toBe('false');
    stateDropDown.click(); // Close
    // Expect all users to be displayed
    expect(element.all(by.repeater('user in users')).count()).toBe(userCount);
  });

  xit('should display users based on the Search, Status and State filters', function() {
    // Search
    queryUserField.sendKeys('a');

    // Select Status filter
    statusDropDown.click(); // Open
    statusDropDown.all(by.css('input')).get(2).click();
    statusDropDown.click(); // Close

    // Select State filter
    stateDropDown.click(); // Open
    stateDropDown.all(by.css('input')).get(3).click(); // Select Ready
    stateDropDown.click(); // Close

    element.all(by.repeater('user in users')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(1)')).getText().then(function (value) {
          expect(value.toLowerCase()).toContain('a');
        });
        expect(element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(3)')).getText()).toBe('Enabled');
        expect(element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(4)')).getText()).toBe('READY');
      };
    });

    // Update Search & add filter options
    queryUserField.clear();
    queryUserField.sendKeys('an');

    // Select Status filter
    statusDropDown.click(); // Open
    statusDropDown.all(by.css('input')).get(1).click();
    statusDropDown.click(); // Close

    // Select State filter
    stateDropDown.click(); // Open
    stateDropDown.all(by.css('input')).get(4).click(); // Select Ready
    stateDropDown.click(); // Close

    element.all(by.repeater('user in users')).then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(1)')).getText().then(function (value) {
          expect(value.toLowerCase()).toContain('an');
        });
        element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(3)')).getText().then(function (value) {
          expect(['Enabled', 'Disabled']).toContain(value);
        });
        element(by.css('tr.ng-scope:nth-child('+ (i+1) +') > td:nth-child(4)')).getText().then(function (value) {
          expect(['LOGIN', 'READY']).toContain(value);
        });
      };
    });
  });

  xit('should display the selected user details in the user details section', function() {
    // Select user row
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).click();

    // Verify user's name in table matches user details
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toContain(element(by.model('user.firstName')).getAttribute('value'));
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toContain(element(by.model('user.lastName')).getAttribute('value'));
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());

    // Verify user's externalId in table matches user details
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2)')).getText()).toBe(element(by.model('user.externalId')).getAttribute('value'));

    // Verify user's state in table matches user details
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(4)')).getText()).toBe(element(by.css('user-state.ng-isolate-scope > div:nth-child(1) > span:nth-child(1)')).getText());

    // Verify user's displayName matches
    expect(element(by.model('user.displayName')).getAttribute('value')).toBe(element(by.css('h2.ng-binding')).getText());

    // Verify remaining required fields are completed
    expect(element(by.model('user.firstName')).getAttribute('value')).toBeTruthy();
    expect(element(by.model('user.email')).getAttribute('value')).toBeTruthy();

    // Change user and verify all fields are updated
    if (userCount >= 2) {
      element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1)')).click();
      expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1)')).getText()).toContain(element(by.model('user.firstName')).getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1)')).getText()).toContain(element(by.model('user.lastName')).getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1)')).getText()).toBe(element(by.css('h1.ng-binding')).getText());
      expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2)')).getText()).toBe(element(by.model('user.externalId')).getAttribute('value'));
      expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(4)')).getText()).toBe(element(by.css('user-state.ng-isolate-scope > div:nth-child(1) > span:nth-child(1)')).getText());
      expect(element(by.model('user.displayName')).getAttribute('value')).toBe(element(by.css('h2.ng-binding')).getText());
      expect(element(by.model('user.firstName')).getAttribute('value')).toBeTruthy();
      expect(element(by.model('user.email')).getAttribute('value')).toBeTruthy();
    }
  });

  it('should update table when user details are changed', function() {
    // Select user row
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).click();

    // Update User details
    element(by.model('user.firstName')).sendKeys('test');
    element(by.model('user.lastName')).sendKeys('test');
    element(by.model('user.displayName')).sendKeys('test');
    element(by.model('user.telephone')).sendKeys('test');
    element(by.model('user.email')).sendKeys('test');
    element(by.model('user.externalId')).sendKeys('test');

    // Verify user's name in table matches new user details
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toContain(element(by.model('user.firstName')).getAttribute('value'));
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1)')).getText()).toContain(element(by.model('user.lastName')).getAttribute('value'));
    // TO DO: Uncomment once the user details header is updated automatically
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
    element(by.model('user.firstName')).sendKeys('\u0008\u0008\u0008\u0008');
    element(by.model('user.lastName')).sendKeys('\u0008\u0008\u0008\u0008');
    element(by.model('user.displayName')).sendKeys('\u0008\u0008\u0008\u0008');
    element(by.model('user.telephone')).sendKeys('\u0008\u0008\u0008\u0008');
    element(by.model('user.email')).sendKeys('\u0008\u0008\u0008\u0008');
    element(by.model('user.externalId')).sendKeys('\u0008\u0008\u0008\u0008');
    browser.pause();
  });

});
