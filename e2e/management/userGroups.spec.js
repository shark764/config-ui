'use strict';

describe('The user groups component of User view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    groups = require('./groups.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  xit('should add to the group count for a user', function() {
    //Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserFirstName = 'First ' + randomUser;
    users.firstNameFormField.sendKeys(newUserFirstName);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Add a group to the new user
      shared.searchField.sendKeys(newUserFirstName);
      shared.firstTableRow.click();
      users.addGroupSearch.click();
      users.groupDropdownItems.get(0).click();
      users.addGroupSearch.getAttribute('value').then(function(newUserGroup) {
        users.addGroupBtn.click();

        //Verify that the users group count has increased and the new group is displayed
        expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toBe('1');
        expect(users.userGroups.count()).toBe(1);
        expect(users.userGroups.get(0).getText()).toBe(newUserGroup);
      });
    });
  });

  it('should add to the member count for an existing group', function() {
    //Regression test for TITAN2-2533

    //Create a new group
    browser.get(shared.groupsPageUrl);
    shared.createBtn.click();
    var randomGroup = Math.floor((Math.random() * 1000) + 1);
    var newGroupName = 'Group Name ' + randomGroup;
    groups.nameFormField.sendKeys(newGroupName);
    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Assign a user to it
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
      shared.firstTableRow.click();
      var selectedTenantUserName = users.userNameDetailsHeader.getText();
      users.addGroupSearch.sendKeys(newGroupName);
      users.addGroupBtn.click();

      //View the group again
      browser.get(shared.groupsPageUrl);
      shared.searchField.sendKeys(newGroupName);
      shared.firstTableRow.click();

      //Verify that the group members has increased
      expect(groups.groupMembersRows.count()).toEqual(1);
      expect(groups.groupMembersRows.get(0).getText()).toContain(selectedTenantUserName);
      expect(shared.firstTableRow.element(by.css(groups.membersColumn)).getText()).toEqual('1');
    });
  });

  xit('should create new group and add user', function() {
    shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
    shared.firstTableRow.click();

    var randomGroup = Math.floor((Math.random() * 1000) + 1);
    var newGroupName = 'Group Name from User Page ' + randomGroup;

    //Assign a user to a group that doesn't exist
    var selectedUserName = users.userNameDetailsHeader.getText();
    users.addGroupSearch.sendKeys(newGroupName);
    users.addGroupBtn.click();

    //View the group page
    browser.get(shared.groupsPageUrl);
    shared.searchField.sendKeys(newGroupName);
    shared.firstTableRow.click(); // group exists

    //Verify that the group members has increased
    expect(groups.groupMembersRows.count()).toEqual(1);
    expect(groups.groupMembersRows.get(0).getText()).toContain(selectedUserName);
    expect(shared.firstTableRow.element(by.css(groups.membersColumn)).getText()).toEqual('1');
  });

  xit('should update group count when removing a user group', function() {
    shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
    shared.firstTableRow.click();

    //Add a group to the user
    users.addGroupSearch.click();
    users.groupDropdownItems.get(0).click();
    users.addGroupSearch.getAttribute('value').then(function(newUserGroup) {
      users.addGroupBtn.click();

      // Remove all user Groups
      users.userGroups.each(function(currentUserGroup) {
        currentUserGroup.element(by.css('a')).click();
      }).then(function() {
        expect(users.userGroups.count()).toBe(0);
        expect(users.noUserGroupsMessage.isDisplayed()).toBeTruthy();
        expect(users.noUserGroupsMessage.getText()).toBe('This user is not assigned to any groups.');
        // TODO
        //expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toEqual('0');
      });
    });
  });

  xit('should update member count for an existing group when removing a user group', function() {
    shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
    shared.firstTableRow.click();

    var selectedUserName = users.userNameDetailsHeader.getText();

    users.addGroupBtn.click();
    users.addGroupSearch.click();
    users.groupDropdownItems.get(0).click();
    users.addGroupBtn.click();

    // Remove user Group
    users.userGroups.get(0).getText().then(function(currentUserGroup) {
      users.userGroups.get(0).element(by.css('a')).click();
      var removedUserGroupName = currentUserGroup;

      //View the group again
      browser.get(shared.groupsPageUrl);
      shared.searchField.sendKeys(removedUserGroupName);
      shared.firstTableRow.click();

      //Verify that the group members has been updated to remove user
      groups.groupMembersRows.each(function(groupUser) {
        expect(groupUser.getText()).not.toContain(selectedUserName);
      });
    });
  });

  xit('should allow the user to be added to each group once', function() {
    //Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserName = 'First ' + randomUser + ' Last' + randomUser;
    users.firstNameFormField.sendKeys('First ' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com');
    users.passwordFormField.sendKeys('password');

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Add all groups to the new user
      shared.searchField.sendKeys(newUserName);
      shared.firstTableRow.click();

      users.addGroupSearch.click();

      users.groupDropdownItems.each(function(currentGroup) {
        users.addGroupSearch.click();
        currentGroup.click();
        users.addGroupBtn.click();
      }).then(function() {
        users.userGroups.count().then(function(userGroupCount) {
          expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toBe(userGroupCount.toString())

          // No more existing groups to add to user
          users.addGroupSearch.click();
          expect(users.groupDropdownItems.count()).toBe(0);
        });
      });
    }).then(function() {
      // Verify user is added to all groups
      browser.get(shared.groupsPageUrl);
      var userAdded = false;

      shared.tableRows.then(function(groups) {
        for (var i = 0; i < groups.length; i++) {
          groups[i].click();

          //Verify that the group members has been updated to remove user
          groups.groupMembersRows.each(function(groupUser) {
            if (groupUser.getText() == newUserName) {
              userAdded = true;
            }
          }).then(function() {
            expect(userAdded).toBeTruthy();
          });
        }
      });
    });
  });

  it('should link user members from group page', function() {
    //Create a new group
    browser.get(shared.groupsPageUrl);
    shared.firstTableRow.click();
    groups.groupMembersRows.then(function(memberDetails) {
      if (memberDetails.length > 0) {
        var memberName = memberDetails[0].getText();

        memberDetails[0].element(by.css('a')).click().then(function() {
          browser.driver.wait(function() {
            return browser.getCurrentUrl().then(function(url) {
              return url.indexOf(shared.groupsPageUrl) == -1;
            });
          }, 5000);

          expect(users.userNameDetailsHeader.getText()).toBe(memberName);
        });
      }
    });
  });

  it('should include the correct number of Group elements', function() {
    shared.firstTableRow.click();

    // Get list of Groups
    var totalGroups = 0;

    // Get groups not assigned to the current user
    users.addGroupSearch.click();
    users.groupDropdownItems.count().then(function(groupListCount) {
      totalGroups = groupListCount;
    }).then(function () {
      user.userGroups.count().then(function (userGroupsCount) {
        totalGroups = totalGroups + userGroupsCount;
      });
    }).thenFinally(function () {
      browser.get(shared.groupsPageUrl);

      // Group list on should contain the same number of group records
      expect(shared.tableElements.count()).toBe(totalGroups);
    });
  });

  it('should list each existing Group not assigned to the user', function() {
    shared.firstTableRow.click();
    users.addGroupSearch.click();

    // Get list of Groups
    var groupNameList = [];
    users.groupDropdownItems.each(function(groupElement, index) {
      groupElement.getText().then(function(groupName) {
        groupNameList.push(groupName);
      });
    }).then(function() {
      browser.get(shared.groupPageUrl);

      // Group list on Users page should contain each of the same Group records
      for (var i = 0; i < groupNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(groupNameList[i]);
        expect(shared.tableElements.get(0).getText()).toContain(groupNameList[i]);
      }
    });
  });

  it('should list each existing Group assigned to the user', function() {
    shared.firstTableRow.click();

    // Get list of Groups
    var groupNameList = [];
    users.userGroups.each(function(groupElement, index) {
      groupElement.getText().then(function(groupName) {
        groupNameList.push(groupName);
      });
    }).then(function() {
      browser.get(shared.groupPageUrl);

      // Group list on Users page should contain each of the same Group records
      for (var i = 0; i < groupNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(groupNameList[i]);
        expect(shared.tableElements.get(0).getText()).toContain(groupNameList[i]);
      }
    });
  });

  it('should search list of all existing Groups by Group name', function() {
    browser.get(shared.groupPageUrl);

    // Get list of groups from Group page
    var groupNameList = [];
    shared.tableElements.each(function(groupElement, index) {
      groupElement.getText().then(function(groupName) {
        groupNameList.push(groupName);
      });
    }).then(function() {
      browser.get(shared.usersPageUrl);
      shared.firstTableRow.click();

      // Remove all user Groups
      users.userGroups.each(function(currentUserGroup) {
        currentUserGroup.element(by.css('a')).click();
      });

      users.addGroupSearch.click();
      expect(users.groupDropdownItems.count()).toBe(groupNameList.length);

      // Search Groups for each group element
      for (var i = 0; i < groupNameList.length; i++) {
        expect(groupNameList[i]).toContain(users.groupDropdownItems.get(i).getText());
      }
    });
  });
});