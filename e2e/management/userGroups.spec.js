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

  it('should add to the member count for an existing group', function() {
	//Regression test for TITAN2-2533
    
	//Create a new group
	browser.get(shared.groupsPageUrl);
	shared.createBtn.click();
	var randomGroup = Math.floor((Math.random() * 1000) + 1);
    var newGroupName = 'Group Name ' + randomGroup;
    groups.nameFormField.sendKeys(newGroupName);
    shared.submitFormBtn.click().then(function () {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
        
      //Assign a user to it
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys('e'); //Filter out users with blank first and last names, such as pending users
      shared.firstTableRow.click();
      var selectedUserName = users.userNameDetailsHeader.getText();
      users.addGroupSearch.sendKeys(newGroupName);
      users.addGroupBtn.click();
      
      //View the group again
      browser.get(shared.groupsPageUrl);
      shared.searchField.sendKeys(newGroupName);
      shared.firstTableRow.click();
      
      //Verify that the group members has increased
      expect(groups.groupMembersRows.count()).toEqual(1);
      expect(groups.groupMembersRows.get(0).getText()).toContain(selectedUserName);
      expect(shared.firstTableRow.element(by.css(groups.membersColumn)).getText()).toEqual('1');
    });
  });
});
