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

  it('should add to the group count for a user', function() {
    // Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserFirstName = 'First ' + randomUser;

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys(newUserFirstName);
    users.lastNameFormField.sendKeys('Last ' + randomUser);

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      users.userGroups.count().then(function(originalGroupCount) {
        // Add a group to the new user
        users.addGroupSearch.click();
        users.groupDropdownItems.get(0).click();
        users.addGroupSearch.getAttribute('value').then(function(newUserGroup) {
          users.addGroupBtn.click();

          shared.searchField.sendKeys('titantest' + randomUser + '@mailinator.com');

          // Verify that the users group count has increased and the new group is displayed
          expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toContain(originalGroupCount + 1);
          expect(users.userGroups.count()).toBe(originalGroupCount + 1);
          expect(users.userGroups.get(originalGroupCount).getText()).toBe(newUserGroup);
        });
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
      shared.firstTableRow.click();
      users.userNameDetailsHeader.getText().then(function(selectedTenantUserName) {
        users.addGroupSearch.sendKeys(newGroupName);
        users.addGroupBtn.click();

        //View the group again
        browser.get(shared.groupsPageUrl);
        shared.searchField.sendKeys(newGroupName);
        shared.firstTableRow.click();

        //Verify that the group members has increased
        expect(groups.groupMembersRows.count()).toBe(1);
        expect(groups.groupMembersRows.get(0).getText()).toContain(selectedTenantUserName);
        expect(shared.firstTableRow.element(by.css(groups.membersColumn)).getText()).toEqual('1');
      });
    });
  });

  it('should create new group and add user', function() {
    shared.firstTableRow.click();

    var randomGroup = Math.floor((Math.random() * 1000) + 1);
    var newGroupName = 'Group Name from User Page ' + randomGroup;
    users.userGroups.count().then(function(originalUserGroupCount) {

      // Assign a user to a group that doesn't exist
      users.userNameDetailsHeader.getText().then(function(selectedUserName) {
        users.addGroupSearch.sendKeys(newGroupName);
        users.addGroupBtn.click();

        // Wait for group to be added to the current user
        browser.driver.wait(function() {
          return users.userGroups.count().then(function(userGroupCount) {
            return userGroupCount == (originalUserGroupCount + 1);
          });
        }, 5000);

        // View the group page
        browser.get(shared.groupsPageUrl);
        shared.searchField.sendKeys(newGroupName);

        shared.firstTableRow.click().then(function() {
          // Verify that the group has been added
          expect(groups.groupMembersRows.count()).toEqual(1);
          expect(groups.groupMembersRows.get(0).getText()).toContain(selectedUserName);
          expect(shared.firstTableRow.element(by.css(groups.membersColumn)).getText()).toEqual('1');
        });
      });
    });
  });

  it('should create new group and add user after pressing Enter key', function() {
    shared.firstTableRow.click();

    var randomGroup = Math.floor((Math.random() * 1000) + 1);
    var newGroupName = 'Group Name from User Page ' + randomGroup;
    users.userGroups.count().then(function(originalUserGroupCount) {
      //Assign a user to a group that doesn't exist
      users.userNameDetailsHeader.getText().then(function(selectedUserName) {
        users.addGroupSearch.sendKeys(newGroupName);

        // Send Enter key instead of pressing Add button
        users.addGroupSearch.sendKeys(protractor.Key.ENTER).then(function() {

          // Wait for group to be added to the current user
          browser.driver.wait(function() {
            return users.userGroups.count().then(function(userGroupCount) {
              return userGroupCount == (originalUserGroupCount + 1);
            });
          }, 5000);

          //View the group page
          browser.get(shared.groupsPageUrl);
          shared.searchField.sendKeys(newGroupName);
          shared.firstTableRow.click(); // group exists

          //Verify that the group has been added
          expect(groups.groupMembersRows.count()).toEqual(1);
          expect(groups.groupMembersRows.get(0).getText()).toContain(selectedUserName);
          expect(shared.firstTableRow.element(by.css(groups.membersColumn)).getText()).toEqual('1');
        });
      });
    });
  });

  it('should update group count when removing a user group', function() {
    shared.firstTableRow.click();
    users.userGroups.count().then(function(userGroupCount) {
      if (userGroupCount == 0) {
        // Add a group to the user
        users.addGroupSearch.click();
        users.groupDropdownItems.get(0).click();
        users.addGroupBtn.click();
        expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toEqual('1');
      }
    }).then(function() {
      // Remove all user Groups
      users.userGroups.count().then(function(currentUserGroupCount) {
        for (var i = 1; i < currentUserGroupCount; i++) {
          users.userGroups.get(1).element(by.css('a')).click();
        }
      }).then(function() {
        users.userGroups.get(0).getText().then(function(lastGroupName) {
          if (lastGroupName == 'everyone') {
            // User is still assigned to 'everyone' group
            expect(users.userGroups.count()).toBe(1);
            expect(users.noUserGroupsMessage.isDisplayed()).toBeFalsy();
            expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toEqual('1');
          } else {
            users.userGroups.get(0).element(by.css('a')).click(); // Remove last group
            expect(users.userGroups.count()).toBe(0);
            expect(users.noUserGroupsMessage.isDisplayed()).toBeTruthy();
            expect(users.noUserGroupsMessage.getText()).toBe('This user is not assigned to any groups.');
            expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toEqual('0');
          }
        });
      });
    });
  });

  xit('should allow the user to be added to each group once', function() {
    // TODO Times out when there are a lot of groups
    // Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserEmail = 'titantest' + randomUser + '@mailinator.com';

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First ' + randomUser);
    users.lastNameFormField.sendKeys('Last ' + randomUser);

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Add all groups to the new user
      shared.searchField.sendKeys(newUserEmail);
      shared.firstTableRow.click();

      users.addGroupSearch.click();

      users.groupDropdownItems.count().then(function(groupCount) {
        // In turn, add each group to the current user
        for (var i = 0; i < groupCount; i++) {
          users.groupDropdownItems.get(0).click(); // Groups are removed from the dropdown as they are added to the user
          users.addGroupBtn.click();
          users.addGroupSearch.click();
        }
      }).then(function() {
        // No more groups to add to the user
        users.addGroupSearch.click();
        expect(users.groupDropdownItems.count()).toBe(0)
        users.userGroups.count().then(function(userGroupCount) {
          expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toBe(userGroupCount.toString())

          // No more existing groups to add to user
          users.addGroupSearch.click();
          expect(users.groupDropdownItems.count()).toBe(0);
        });
      });
    });
  });

  it('should update member count for an existing group when removing a user group', function() {
    shared.firstTableRow.click();

    users.userNameDetailsHeader.getText().then(function(selectedUserName) {
      shared.firstTableRow.element(by.css(users.groupsColumn)).getText().then(function(userGroupCount) {
        if (userGroupCount == parseInt(userGroupCount)) {
          //Add a group to the user
          users.addGroupSearch.click();
          users.groupDropdownItems.get(0).click();
          users.addGroupBtn.click();
          expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toContain(parseInt(userGroupCount) + 1);
        }
      }).then(function() {
        // Remove user Group
        users.userGroups.get(0).getText().then(function(currentUserGroup) {
          if (currentUserGroup != 'everyone') {
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
          }
        });
      });
    });
  });

  it('should link user members from group page', function() {
    browser.get(shared.groupsPageUrl);
    shared.searchField.sendKeys('Group Name'); // Can timeout if 'everyone' group is selected
    shared.firstTableRow.click();
    groups.groupMembersRows.then(function(memberDetails) {
      if (memberDetails.length > 0) {
        var memberName = memberDetails[0].getText();

        memberDetails[0].element(by.css('a')).click().then(function() {
          browser.driver.wait(function() {
            return browser.getCurrentUrl().then(function(url) {
              return url.indexOf(shared.usersPageUrl) > -1;
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
    }).then(function() {
      users.userGroups.count().then(function(userGroupsCount) {
        totalGroups = totalGroups + userGroupsCount;
      });
    }).thenFinally(function() {
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
      browser.get(shared.groupsPageUrl);

      // Group list on Users page should contain each of the same Group records
      for (var i = 0; i < groupNameList.length && i < 10; i++) { // Limit test length
        shared.searchField.clear();
        shared.searchField.sendKeys(groupNameList[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
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
      browser.get(shared.groupsPageUrl);

      // Group list on Users page should contain each of the same Group records
      for (var i = 0; i < groupNameList.length && i < 10; i++) { // Limit test length
        shared.searchField.clear();
        shared.searchField.sendKeys(groupNameList[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });
  });

  it('should search list of all existing Groups by Group name', function() {
    browser.get(shared.groupsPageUrl);

    // Get list of groups from Group page
    var groupNameList = [];
    shared.tableElements.each(function(groupElement, index) {
      groupElement.element(by.css('td:nth-child(2)')).getText().then(function(groupName) {
        if (groupName != 'everyone') {
          groupNameList.push(groupName);
        }
      });
    }).then(function() {
      browser.get(shared.usersPageUrl);
      shared.firstTableRow.click();

      // Remove all user Groups
      users.userGroups.then(function(currentUserGroups) {
        for (var i = 1; i < currentUserGroups.length; i++) {
          currentUserGroups[i].element(by.css('a')).click();
        }
      }).then(function() {
        users.userGroups.get(0).getText().then(function(lastGroupName) {
          if (lastGroupName != 'everyone') {
            users.userGroups.get(0).element(by.css('a')).click();
          }
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

  it('should update group count when adding and removing groups', function() {
    var randomGroup = Math.floor((Math.random() * 1000) + 1);
    shared.firstTableRow.click();
    shared.firstTableRow.element(by.css(users.groupsColumn)).getText().then(function(userGroupCount) {
      //Add a group to the user
      users.addGroupSearch.click();
      users.addGroupSearch.sendKeys('New Group ' + randomGroup);
      users.addGroupBtn.click();

      expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toEqual(parseInt(userGroupCount) + 1 + '');

      // Remove a user Group
      if (parseInt(userGroupCount)) {
        users.userGroups.get(1).element(by.css('a')).click();
        expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toEqual(userGroupCount);
      } else {
        users.userGroups.get(0).element(by.css('a')).click();
        expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toEqual(userGroupCount);
      }
    });
  });

  it('should autocomplete group dropdown when arrow buttons are selected', function() {
    //Create a new user
    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);
    var newUserFirstName = 'First ' + randomUser;

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys(newUserFirstName);
    users.lastNameFormField.sendKeys('Last ' + randomUser);

    users.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      //Add a group to the new user
      users.addGroupSearch.click();
      browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform().then(function() {
        // Expect first group to be highlighted
        expect(users.groupDropdownItems.get(0).getAttribute('class')).toContain('lo-highlight');
        expect(users.groupDropdownItems.get(1).getAttribute('class')).not.toContain('lo-highlight');

        browser.driver.actions().sendKeys(protractor.Key.ARROW_DOWN).perform().then(function() {
          // Expect second group to be highlighted
          expect(users.groupDropdownItems.get(0).getAttribute('class')).not.toContain('lo-highlight');
          expect(users.groupDropdownItems.get(1).getAttribute('class')).toContain('lo-highlight');

          browser.driver.actions().sendKeys(protractor.Key.ARROW_UP).perform().then(function() {
            // Expect first group to be highlighted again
            expect(users.groupDropdownItems.get(0).getAttribute('class')).toContain('lo-highlight');
            expect(users.groupDropdownItems.get(1).getAttribute('class')).not.toContain('lo-highlight');

            users.groupDropdownItems.get(0).getText().then(function(firstGroupName) {
              users.addGroupSearch.sendKeys('\n');

              // Expect first group to be added
              users.userGroups.count().then(function(userGroupCount) {
                expect(users.userGroups.get(userGroupCount - 1).getText()).toContain(firstGroupName);
              })
            });
          });
        });
      });
    });
  });
});
