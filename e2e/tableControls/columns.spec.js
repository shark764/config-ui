'use strict';

describe('The table columns', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    columns = require('./columns.po.js'),
    params = browser.params,
    elementCount;

  beforeEach(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterEach(function() {
    shared.tearDown();
  });

  it('should open and close columns drop down when selected', function() {
    expect(columns.dropdownFilter.isDisplayed()).toBeFalsy();

    shared.tableColumnsDropDown.click();
    expect(columns.dropdownFilter.isDisplayed()).toBeTruthy();

    shared.tableColumnsDropDown.click();
    expect(columns.dropdownFilter.isDisplayed()).toBeFalsy();
  });

  it('should be selected when shown by default', function() {
    // On the User Management page, confirm that the Name, Email, Skills, Groups, columns are displayed
    expect(columns.selectAll.isDisplayed()).toBeTruthy();
    expect(columns.columnTwoHeader.getText()).toBe(columns.userDefaults[0]);
    expect(columns.columnThreeHeader.getText()).toBe(columns.userDefaults[1]);
    expect(columns.columnFourHeader.getText()).toContain(columns.userDefaults[2]);
    expect(columns.columnFiveHeader.getText()).toContain(columns.userDefaults[3]);
    expect(columns.columnSixHeader.getText()).toContain(columns.userDefaults[4]);
    expect(columns.columnSevenHeader.getText()).toContain(columns.userDefaults[5]);
    expect(columns.columnEightHeader.getText()).toContain(columns.userDefaults[6]);

    // Confirm that no other columns are displayed
    expect(columns.columnNineHeader.isPresent()).toBeFalsy();

    // Confirm that only the displayed columns are shown as selected in the dropdown
    shared.tableColumnsDropDown.click();
    expect(columns.options.get(0).getText()).toBe(columns.users[0]);
    expect(columns.options.get(1).getText()).toBe(columns.users[1]);
    expect(columns.options.get(2).getText()).toBe(columns.users[2]);
    expect(columns.options.get(3).getText()).toBe(columns.users[3]);
    expect(columns.options.get(4).getText()).toBe(columns.users[4]);
    expect(columns.options.get(5).getText()).toBe(columns.users[5]);
    expect(columns.options.get(6).getText()).toBe(columns.users[6]);
    expect(columns.options.get(7).getText()).toBe(columns.users[7]);
    expect(columns.options.get(8).getText()).toBe(columns.users[8]);
    expect(columns.optionCheckboxes.get(0).getAttribute('selected')).toBeTruthy();
    expect(columns.optionCheckboxes.get(1).getAttribute('selected')).toBeTruthy();
    expect(columns.optionCheckboxes.get(2).getAttribute('selected')).toBeFalsy();
    expect(columns.optionCheckboxes.get(3).getAttribute('selected')).toBeTruthy();
    expect(columns.optionCheckboxes.get(4).getAttribute('selected')).toBeTruthy();
    expect(columns.optionCheckboxes.get(5).getAttribute('selected')).toBeTruthy();
    expect(columns.optionCheckboxes.get(6).getAttribute('selected')).toBeTruthy();
    expect(columns.optionCheckboxes.get(7).getAttribute('selected')).toBeFalsy();
    expect(columns.optionCheckboxes.get(8).getAttribute('selected')).toBeTruthy();
  });

  it('should not show default when unselected', function() {
    // Unselect Name column
    shared.tableColumnsDropDown.click();
    columns.options.get(0).click();
    expect(columns.optionCheckboxes.get(0).getAttribute('selected')).toBeFalsy();
    shared.tableColumnsDropDown.click().then(function() {
      // Confirm Name column is removed
      expect(columns.selectAll.isDisplayed()).toBeTruthy();
      expect(columns.columnTwoHeader.getText()).toContain(columns.users[1]);
      expect(columns.columnThreeHeader.getText()).toContain(columns.users[3]);

      expect(columns.columnEightHeader.isPresent()).toBeFalsy();

      // Unselect Email column
      shared.tableColumnsDropDown.click();
      columns.options.get(1).click();
      expect(columns.optionCheckboxes.get(1).getAttribute('selected')).toBeFalsy();
      shared.tableColumnsDropDown.click().then(function() {
        // Confirm ID column is removed
        expect(columns.selectAll.isDisplayed()).toBeTruthy();
        expect(columns.columnTwoHeader.getText()).toContain(columns.users[3]);

        expect(columns.columnSevenHeader.isPresent()).toBeFalsy();
      });
    });
  });

  it('should show additional columns when selected', function() {
    // Select External ID column
    shared.tableColumnsDropDown.click();
    columns.options.get(2).click().then(function () {
      expect(columns.optionCheckboxes.get(2).getAttribute('selected')).toBeTruthy();
      shared.tableColumnsDropDown.click();

      // Confirm column is added
      expect(columns.selectAll.isDisplayed()).toBeTruthy();
      expect(columns.columnTwoHeader.getText()).toBe(columns.users[0]);
      expect(columns.columnThreeHeader.getText()).toBe(columns.users[1]);
      expect(columns.columnFourHeader.getText()).toBe(columns.users[2]);
      expect(columns.columnFiveHeader.getText()).toContain(columns.users[3]);

      // Confirm that no other columns are displayed
      expect(columns.columnTenHeader.isPresent()).toBeFalsy();
    });
  });

  it('should show all columns when all are selected', function() {
    shared.tableColumnsDropDown.click();
    columns.options.get(2).click();
    columns.options.get(7).click().then(function () {
      // Confirm all checkboxes are selected
      columns.optionCheckboxes.then(function(columnSelection) {
        for (var i = 0; i < columnSelection.length; ++i) {
          expect(columnSelection[i].getAttribute('checked')).toBeTruthy();
        };
      });
      shared.tableColumnsDropDown.click().then(function () {
        // Confirm all columns are added
        expect(columns.selectAll.isDisplayed()).toBeTruthy();
        expect(columns.columnTwoHeader.getText()).toBe(columns.users[0]);
        expect(columns.columnThreeHeader.getText()).toBe(columns.users[1]);
        expect(columns.columnFourHeader.getText()).toBe(columns.users[2]);
        expect(columns.columnFiveHeader.getText()).toContain(columns.users[3]);
        expect(columns.columnSixHeader.getText()).toContain(columns.users[4]);
        expect(columns.columnSevenHeader.getText()).toContain(columns.users[5]);
        expect(columns.columnEightHeader.getText()).toContain(columns.users[6]);
        expect(columns.columnNineHeader.getText()).toContain(columns.users[7]);
        expect(columns.columnTenHeader.getText()).toContain(columns.users[8]);

        // Confirm that no other columns are displayed
        expect(columns.columnElevenHeader.isPresent()).toBeFalsy();
      });
    });
  });

  it('selection should persist on page reload', function() {
    shared.tableColumnsDropDown.click();
    columns.options.get(2).click();
    columns.options.get(3).click();

    shared.tenantsNavButton.click();
    shared.usersNavButton.click().then(function() {
      // Confirm the column selections are persistant page change
      shared.tableColumnsDropDown.click();
      expect(columns.optionCheckboxes.get(2).getAttribute('checked')).toBeTruthy();
      expect(columns.optionCheckboxes.get(3).getAttribute('checked')).toBeFalsy();
      shared.tableColumnsDropDown.click();

      expect(columns.selectAll.isDisplayed()).toBeTruthy();
      expect(columns.columnTwoHeader.getText()).toBe(columns.users[0]);
      expect(columns.columnThreeHeader.getText()).toBe(columns.users[1]);
      expect(columns.columnFourHeader.getText()).toContain(columns.users[2]);
      expect(columns.columnFiveHeader.getText()).toContain(columns.users[4]);

      // Confirm that no other columns are displayed
      expect(columns.columnNineHeader.isPresent()).toBeFalsy();
    })
  });

  it('should show \'Select\' column when all are unselected', function() {
    shared.tableColumnsDropDown.click();
    columns.options.get(0).click();
    columns.options.get(1).click();
    columns.options.get(3).click();
    columns.options.get(4).click();
    columns.options.get(5).click();
    columns.options.get(6).click();
    columns.options.get(8).click();

    // Confirm all checkboxes are unselected
    columns.optionCheckboxes.then(function(columnSelection) {
      for (var i = 0; i < columnSelection.length; ++i) {
        expect(columnSelection[i].getAttribute('checked')).toBeFalsy();
      };
    });
    shared.tableColumnsDropDown.click();

    // Confirm all optional columns are not displayed
    expect(columns.selectAll.isDisplayed()).toBeTruthy();
    expect(columns.columnTwoHeader.isPresent()).toBeFalsy();
  });

  it('should toggle selecting all elements when the \'Select All\' checkbox is selected', function() {
    // Select all
    columns.selectAll.click();

    // Confirm all are selected
    expect(columns.selectAll.getAttribute('checked')).toBeTruthy();
    // Confirm all checkboxes are unselected
    shared.tableElements.then(function(allUsers) {
      for (var i = 1; i <= allUsers.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();
      };
    });

    // Unselect all
    columns.selectAll.click();

    // Confirm all are unselected
    expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
    // Confirm all checkboxes are unselected
    shared.tableElements.then(function(allUsers) {
      for (var i = 1; i <= allUsers.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
      };
    });
  });

  it('should toggle selecting an elements when the \'Select\' checkbox is selected', function() {
    // Confirm checkboxes are able to be selected
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
    expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();
    shared.tableElements.then(function(allUsers) {
      if (allUsers.length > 1) {
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
        element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();

        // Unselect both
        element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();
        element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
      } else {
        // Unselect
        element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
      };
    });
  });

  it('on the Groups page should display correct defaults and options', function() {
    browser.get(shared.groupsPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      for (var i = 0; i < allColumns.length; ++i) {
        expect(columns.options.get(i).getText()).toBe(columns.groups[i]);
        expect(allColumns[i].getAttribute('checked')).toBeTruthy();
      };
    });
  });

  it('on the Skills page should display correct defaults and options', function() {
    browser.get(shared.skillsPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      for (var i = 0; i < allColumns.length; ++i) {
        expect(columns.options.get(i).getText()).toBe(columns.skills[i]);
        expect(allColumns[i].getAttribute('checked')).toBeTruthy();
      };
    });
  });

  it('on the Tenants page should display correct defaults and options', function() {
    browser.get(shared.tenantsPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      expect(columns.options.get(0).getText()).toBe(columns.tenants[0]);
      expect(allColumns[0].getAttribute('checked')).toBeTruthy();

      expect(columns.options.get(1).getText()).toBe(columns.tenants[1]);
      expect(allColumns[1].getAttribute('checked')).toBeTruthy();

      expect(columns.options.get(2).getText()).toBe(columns.tenants[2]);
      expect(allColumns[2].getAttribute('checked')).toBeFalsy();

      expect(columns.options.get(3).getText()).toBe(columns.tenants[3]);
      expect(allColumns[3].getAttribute('checked')).toBeTruthy();
    });
  });

  it('on the Dispatch Mappings page should display correct defaults and options', function() {
    browser.get(shared.dispatchMappingsPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      for (var i = 0; i < allColumns.length; ++i) {
        expect(columns.options.get(i).getText()).toBe(columns.dispatchMappings[i]);
        expect(allColumns[i].getAttribute('checked')).toBeTruthy();
      };
    });
  });

  it('on the Flows page should display correct defaults and options', function() {
    browser.get(shared.flowsPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      for (var i = 0; i < allColumns.length; ++i) {
        expect(columns.options.get(i).getText()).toBe(columns.flows[i]);
        expect(allColumns[i].getAttribute('checked')).toBeTruthy();
      };
    });
  });

  it('on the Queues page should display correct defaults and options', function() {
    browser.get(shared.queuesPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      for (var i = 0; i < allColumns.length; ++i) {
        expect(columns.options.get(i).getText()).toBe(columns.queues[i]);
        expect(allColumns[i].getAttribute('checked')).toBeTruthy();
      };
    });
  });

  it('on the Media Collections page should display correct defaults and options', function() {
    browser.get(shared.mediaCollectionsPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      for (var i = 0; i < allColumns.length; ++i) {
        expect(columns.options.get(i).getText()).toBe(columns.mediaCollections[i]);
        expect(allColumns[i].getAttribute('checked')).toBeTruthy();
      };
    });
  });

  it('on the Media page should display correct defaults and options', function() {
    browser.get(shared.mediaPageUrl);
    shared.tableColumnsDropDown.click();
    columns.optionCheckboxes.then(function(allColumns) {
      for (var i = 0; i < allColumns.length; ++i) {
        expect(columns.options.get(i).getText()).toBe(columns.media[i]);
        expect(allColumns[i].getAttribute('checked')).toBeTruthy();
      };
    });
  });
});
