'use strict';

describe('The groups view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    groups = require('./groups.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    groupCount,
    randomGroup,
    newGroupName,
    addedMember;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.groupsPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should successfully create new Group', function() {
    randomGroup = Math.floor((Math.random() * 1000) + 1);
    var groupAdded = false;
    newGroupName = 'Group Name ' + randomGroup;
    shared.createBtn.click();

    // Edit fields
    groups.nameFormField.sendKeys(newGroupName);
    groups.descriptionFormField.sendKeys('Group Description');
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      expect(groups.groupMembersLoading.isDisplayed()).toBeFalsy();
      expect(groups.groupMembersEmpty.isDisplayed()).toBeTruthy();
      expect(groups.groupMembersEmpty.getText()).toEqual('There are no members assigned to this group.');

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
  });

  it('should include group page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(groups.tablePane.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy(); //hide right panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Group Management');
  });

  it('should include valid Group fields when creating a new Group', function() {
    shared.createBtn.click();
    expect(groups.creatingGroupHeader.getText()).toBe('Creating Group');
    expect(groups.nameFormField.isDisplayed()).toBeTruthy();
    expect(groups.descriptionFormField.isDisplayed()).toBeTruthy();

    // Members fields not displayed
    expect(groups.addMemberArea.isPresent()).toBeFalsy();
  });

  it('should require field input when creating a new Group', function() {
    groupCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

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

    // New Group is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(groupCount);

    // Touch name input field
    groups.nameFormField.click();
    groups.descriptionFormField.click();

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
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBeGreaterThan(groupCount);
      expect(groups.groupMembersLoading.isDisplayed()).toBeFalsy();
      expect(groups.groupMembersEmpty.isDisplayed()).toBeTruthy();
    });
  });

  it('should clear fields on Cancel', function() {
    groupCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    groups.nameFormField.sendKeys('Group Name');
    groups.descriptionFormField.sendKeys('Group Description');
    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New group is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(groupCount);

    // Form fields are cleared and reset to default
    expect(groups.nameFormField.getAttribute('value')).toBe('');
    expect(groups.descriptionFormField.getAttribute('value')).toBe('');
  });

  it('should display group details when selected from table', function() {
    // Select first group from table
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
    groups.secondTableRow.click();
    expect(groups.nameHeader.isDisplayed()).toBeTruthy();
    expect(groups.nameFormField.isDisplayed()).toBeTruthy();
    expect(groups.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(groups.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(groups.detailsMemberCount.isDisplayed()).toBeTruthy();

    // Manage member fields
    expect(groups.addMemberArea.isDisplayed()).toBeTruthy();
    expect(groups.addMemberField.isDisplayed()).toBeTruthy();
    expect(groups.addMemberField.isDisplayed()).toBeTruthy();
  });

  it('should reset Group fields after editing and selecting Cancel', function() {
    groups.secondTableRow.click();

    var originalName = groups.nameFormField.getAttribute('value');
    var originalDescription = groups.descriptionFormField.getAttribute('value');

    // Edit fields
    groups.nameFormField.sendKeys('Edit');
    groups.descriptionFormField.sendKeys('Edit');

    shared.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(groups.nameFormField.getAttribute('value')).toBe(originalName);
    expect(groups.descriptionFormField.getAttribute('value')).toBe(originalDescription);
  });

  it('should allow the Group fields to be updated', function() {
    //Select group with second-most members. Group with most members will be an "everyone" group that cannot be edited.
    groups.membersHeader.click();
    groups.membersHeader.click();
    groups.secondTableRow.click();

    // Edit fields
    groups.nameFormField.sendKeys('Edit');
    groups.descriptionFormField.sendKeys('Edit');

    var editedName = groups.nameFormField.getAttribute('value');
    var editedDescription = groups.descriptionFormField.getAttribute('value');
    var numMembers = parseInt(groups.detailsMemberCount.getText());
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      if (numMembers > 0) {
        expect(groups.groupMembersEmpty.isDisplayed()).toBeFalsy();
      }
      expect(groups.groupMembersLoading.isDisplayed()).toBeFalsy();

      // Changes persist
      browser.refresh();
      expect(groups.nameFormField.getAttribute('value')).toBe(editedName);
      expect(groups.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    });
  });

  it('should require name field when editing a Group', function() {
    //Select group with second-most members. Group with most members will be an "everyone" group that cannot be edited.
    groups.membersHeader.click();
    groups.membersHeader.click();
    groups.secondTableRow.click();

    // Edit fields
    groups.nameFormField.clear();
    groups.descriptionFormField.click();

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(groups.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(groups.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description field when editing a Group', function() {
    //Select group with second-most members. Group with most members will be an "everyone" group that cannot be edited.
    groups.membersHeader.click();
    groups.membersHeader.click();
    groups.secondTableRow.click();

    // Edit fields
    groups.descriptionFormField.clear();
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
    });
  });

  it('should not allow updates to Everyone group', function() {
    shared.searchField.sendKeys('everyone');
    shared.tableElements.then(function(groups) {
      if (groups.length > 0) {
        shared.firstTableRow.click();
        expect(groups.activeFormToggle.getAttribute('disabled')).toBeTruthy();
        expect(groups.descriptionFormField.getAttribute('disabled')).toBeTruthy();
        expect(groups.nameFormField.getAttribute('disabled')).toBeTruthy();
      }
    });
  });

  it('should link to the user details view in the members list', function() {
    var groupWithMembersRow;

    // Order by group member count, descending
    groups.headerRow.element(by.css('th:nth-child(4)')).click();
    groups.headerRow.element(by.css('th:nth-child(4)')).click();

    shared.firstTableRow.element(by.css(groups.membersColumn)).getText().then(function(value) {
      if (parseInt(value) > 0) {
        shared.firstTableRow.click();

        //Save the member's name
        var memberName = groups.groupMembersRows.get(0).getText();

        //Follow the link
        groups.groupMembersRows.get(0).element(by.css('a')).click().then(function() {
          expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
          expect(shared.rightPanel.isDisplayed()).toBeTruthy();
          expect(users.userNameDetailsHeader.getText()).toContain(memberName);
        });
      }
    });
  });

// TODO Enable the following after TITAN2-4583 && TITAN2-4533
  xit('should list all users in Add Member dropdown', function() {
    randomGroup = Math.floor((Math.random() * 1000) + 1);
    newGroupName = 'Group Name ' + randomGroup;
    shared.createBtn.click();

    // Edit fields
    groups.nameFormField.sendKeys(newGroupName);
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      expect(groups.addMemberField.isDisplayed()).toBeTruthy();

      expect(groups.groupMembersLoading.isDisplayed()).toBeFalsy();
      expect(groups.groupMembersEmpty.isDisplayed()).toBeTruthy();
      expect(groups.groupMembersEmpty.getText()).toEqual('There are no members assigned to this group.');

      groups.addMemberField.click();
      groups.addMemberDropdownOptions.count().then(function(availableUserCount) {
        browser.get(shared.usersPageUrl);
        expect(shared.tableElements.count()).toBe(availableUserCount);
      });
    });
  });

  xit('should add member to group and increment member count', function() {
    // NOTE Uses new group from previous test to ensure member count is 0
    shared.searchField.sendKeys(newGroupName);
    shared.firstTableRow.click();

    expect(groups.addMemberField.isDisplayed()).toBeTruthy();
    expect(groups.groupMembersEmpty.getText()).toEqual('There are no members assigned to this group.');

    groups.addMemberField.click();
    groups.addMemberDropdownOptions.get(0).getText().then(function(addedMemberName) {
      addedMember = addedMemberName;
      groups.addMemberDropdownOptions.get(0).click();
      groups.addMemberBtn.click().then(function() {
        expect(groups.groupMembersEmpty.isDisplayed()).toBeFalsy();

        expect(groups.groupMembersRows.count()).toBe(1);
        expect(groups.groupMembersRows.get(0).getText()).toBe(addedMemberName);
        expect(groups.detailsMemberCount.getText()).toContain('1');
        expect(groups.firstTableRow.element(by.css(groups.membersColumn)).getText()).toBe('1');

        // Changes persist
        browser.refresh();
        shared.searchField.sendKeys(newGroupName);
        shared.firstTableRow.click();

        expect(groups.groupMembersRows.count()).toBe(1);
        expect(groups.groupMembersRows.get(0).getText()).toBe(addedMemberName);
        expect(groups.detailsMemberCount.getText()).toContain('1');
        expect(groups.firstTableRow.element(by.css(groups.membersColumn)).getText()).toBe('1');
      });
    });
  });

  xit('should add update user after adding as a member', function() {
    // NOTE Uses new group and user from previous test
    browser.get(shared.usersPageUrl);
    shared.searchField.sendKeys(newGroupName + '\t'); // Search for user based on new group
    expect(shared.tableElements.count()).toBe(1);
    expect(shared.firstTableRow.getText()).toContain(addedMember);
  });

  xit('should clear add member field after adding', function() {
    // NOTE Uses new group from previous test to ensure member count is 0
    shared.searchField.sendKeys(newGroupName);
    shared.firstTableRow.click();

    groups.addMemberField.click();
    groups.addMemberDropdownOptions.get(0).getText();
    groups.addMemberDropdownOptions.get(0).click();
    groups.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      expect(groups.addMemberField.getAttribute('value')).toBeNull();
    });
  });

  xit('should update user dropdown after adding and removing members', function() {
    // NOTE Uses new group from previous test
    shared.searchField.sendKeys(newGroupName);
    shared.firstTableRow.click();

    groups.addMemberField.click();
    groups.addMemberDropdownOptions.count().then(function(originalAvailableUserCount) {
      // Add user as a member
      groups.addMemberDropdownOptions.get(0).click();
      groups.addMemberBtn.click().then(function() {
        shared.waitForSuccess();

        expect(groups.groupMembersRows.count()).toBe(3);
        expect(groups.detailsMemberCount.getText()).toContain('3');

        // User is removed from dropdown
        groups.addMemberField.click();
        expect(groups.addMemberDropdownOptions.count()).toBe(originalAvailableUserCount - 1);
        // Remove member
        groups.groupMembersRows.get(0).element(by.css('.remove')).click().then(function() {
          shared.waitForSuccess();

          expect(groups.groupMembersRows.count()).toBe(2);
          expect(groups.detailsMemberCount.getText()).toContain('2');

          // User is added from dropdown
          groups.addMemberField.click();
          expect(groups.addMemberDropdownOptions.count()).toBe(originalAvailableUserCount);
        });
      });
    });
  });

  xit('should allow all members to be removed', function() {
    // NOTE Uses new group from previous test
    shared.searchField.sendKeys(newGroupName);
    shared.firstTableRow.click();

    // Remove member
    groups.groupMembersRows.get(0).element(by.css('.remove')).click().then(function() {
      shared.waitForSuccess();

      expect(groups.groupMembersRows.count()).toBe(1);
      expect(groups.detailsMemberCount.getText()).toContain('1');

      groups.groupMembersRows.get(0).element(by.css('.remove')).click().then(function() {
        shared.waitForSuccess();

        expect(groups.detailsMemberCount.getText()).toContain('0');
        expect(groups.groupMembersEmpty.isDisplayed()).toBeTruthy();
      });
    });
  });

});
