'use strict';

describe('The groups view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    groups = require('./groups.po.js'),
    params = browser.params,
    groupCount,
    randomGroup;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.groupsPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should successfully create new Group', function() {
    randomGroup = Math.floor((Math.random() * 1000) + 1);
    var groupAdded = false;
    var newGroupName = 'Group Name ' + randomGroup;
    shared.createBtn.click();

    // Edit fields
    groups.nameFormField.sendKeys(newGroupName);
    groups.descriptionFormField.sendKeys('Group Description');
    shared.submitFormBtn.click();

    expect(groups.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isDisplayed()).toBeTruthy();

    // Confirm group is displayed in group list
    shared.tableElements.then(function(rows) {
      for (var i = 1; i <= rows.length; ++i) {
        // Check if group name in table matches newly added group
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText().then(function(value) {
          if (value == newGroupName) {
            groupAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new group was found in the group table
      expect(groupAdded).toBeTruthy();
    });
  });

  it('should include group page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Groups Management');
  });

  it('should include valid Group fields when creating a new Group', function() {
    shared.createBtn.click();
    expect(groups.creatingGroupHeader.getText()).toBe('Creating Group');
    expect(groups.nameFormField.isDisplayed()).toBeTruthy();
    expect(groups.descriptionFormField.isDisplayed()).toBeTruthy();
  });

  it('should require field input when creating a new Group', function() {
    groupCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Submit without field input
    shared.submitFormBtn.click();

    // New Group is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(groupCount);
  });

  it('should require name when creating a new Group', function() {
    groupCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    groups.descriptionFormField.sendKeys('Group Description');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // New Group is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(groupCount);

    // Touch name input field
    groups.nameFormField.click();
    groups.descriptionFormField.click();
    shared.submitFormBtn.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(groups.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(groups.nameRequiredError.get(0).getText()).toBe('Please enter a name');

    // New Group is not saved
    expect(shared.tableElements.count()).toBe(groupCount);
  });

  it('should successfully create new Group without description', function() {
    groupCount = shared.tableElements.count();
    randomGroup = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Edit fields
    groups.nameFormField.sendKeys('Group Name ' + randomGroup);

    shared.submitFormBtn.click().then(function() {
      expect(groups.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(groupCount);
    });
  });

  it('should clear fields on Cancel', function() {
    groupCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    groups.nameFormField.sendKeys('Group Name');
    groups.descriptionFormField.sendKeys('Group Description');
    shared.cancelFormBtn.click();

    // New group is not created
    expect(groups.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(groupCount);

    // Form fields are cleared and reset to default
    expect(groups.nameFormField.getAttribute('value')).toBe('');
    expect(groups.descriptionFormField.getAttribute('value')).toBe('');
  });

  it('should display group details when selected from table', function() {
    // Select first queue from table
    groups.firstTableRow.click();

    // Verify group details in table matches populated field
    expect(groups.nameHeader.getText()).toContain(groups.firstTableRow.element(by.css(groups.nameColumn)).getText());
    expect(groups.firstTableRow.element(by.css(groups.nameColumn)).getText()).toBe(groups.nameFormField.getAttribute('value'));
    expect(groups.firstTableRow.element(by.css(groups.descriptionColumn)).getText()).toBe(groups.descriptionFormField.getAttribute('value'));
    expect(groups.detailsMemberCount.getText()).toContain(groups.firstTableRow.element(by.css(groups.membersColumn)).getText());

    // Change selected queue and ensure details are updated
    shared.tableElements.count().then(function(curGroupCount) {
      if (curGroupCount > 1) {
        groups.secondTableRow.click();
        expect(groups.nameHeader.getText()).toContain(groups.secondTableRow.element(by.css(groups.nameColumn)).getText());
        expect(groups.secondTableRow.element(by.css(groups.nameColumn)).getText()).toBe(groups.nameFormField.getAttribute('value'));
        expect(groups.secondTableRow.element(by.css(groups.descriptionColumn)).getText()).toBe(groups.descriptionFormField.getAttribute('value'));
        expect(groups.detailsMemberCount.getText()).toContain(groups.secondTableRow.element(by.css(groups.membersColumn)).getText());
      };
    });
  });

  it('should include valid Group fields when editing an existing Group', function() {
    groups.firstTableRow.click();
    expect(groups.nameHeader.isDisplayed()).toBeTruthy();
    expect(groups.nameFormField.isDisplayed()).toBeTruthy();
    expect(groups.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(groups.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(groups.detailsMemberCount.isDisplayed()).toBeTruthy();
  });

  it('should reset Group fields after editing and selecting Cancel', function() {
    groups.firstTableRow.click();

    var originalName = groups.nameFormField.getAttribute('value');
    var originalDescription = groups.descriptionFormField.getAttribute('value');

    // Edit fields
    groups.nameFormField.sendKeys('Edit');
    groups.descriptionFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();

    expect(groups.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(groups.nameFormField.getAttribute('value')).toBe(originalName);
    expect(groups.descriptionFormField.getAttribute('value')).toBe(originalDescription);
  });

  it('should allow the Group fields to be updated', function() {
    groups.firstTableRow.click();

    // Edit fields
    groups.nameFormField.sendKeys('Edit');
    groups.descriptionFormField.sendKeys('Edit');

    var editedName = groups.nameFormField.getAttribute('value');
    var editedDescription = groups.descriptionFormField.getAttribute('value');
    shared.submitFormBtn.click().then(function () {
      expect(groups.nameRequiredError.get(0).isDisplayed()).toBeFalsy();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Changes persist
      browser.refresh();
      expect(groups.nameFormField.getAttribute('value')).toBe(editedName);
      expect(groups.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    });
  });

  it('should require name field when editing a Group', function() {
    // Select first group from table
    groups.firstTableRow.click();

    // Edit fields
    groups.nameFormField.clear();
    groups.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    // Error messages displayed
    expect(groups.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(groups.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description field when editing a Group', function() {
    groups.firstTableRow.click();

    // Edit fields
    groups.descriptionFormField.clear();
    shared.submitFormBtn.click().then(function () {
      expect(shared.successMessage.isPresent()).toBeTruthy();
    });
  });
});