'use strict';

describe('The read only message', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should be displayed for all default roles', function() {
    browser.get(shared.rolesPageUrl);

    shared.searchField.sendKeys('Administrator');
    shared.firstTableRow.click();
    expect(shared.readOnlyMessage.isDisplayed()).toBeTruthy();
    expect(shared.readOnlyMessage.getText()).toBe('This role is inherited and cannot be edited');

    shared.searchField.clear();
    shared.searchField.sendKeys('Agent');
    shared.firstTableRow.click();
    expect(shared.readOnlyMessage.isDisplayed()).toBeTruthy();
    expect(shared.readOnlyMessage.getText()).toBe('This role is inherited and cannot be edited');

    shared.searchField.clear();
    shared.searchField.sendKeys('Supervisor');
    shared.firstTableRow.click();
    expect(shared.readOnlyMessage.isDisplayed()).toBeTruthy();
    expect(shared.readOnlyMessage.getText()).toBe('This role is inherited and cannot be edited');
    shared.searchField.clear();
  });

  it('should be not displayed for custom roles', function() {
    shared.tableElements.then(function(allRoles) {
      if (allRoles.length > 3) {
        for (var i = 0; i < allRoles.length && i < 5; i++) {
          // Role is custom
          shared.tableElements.get(i).click();
          allRoles[i].getText().then(function(roleName) {
            if (roleName.indexOf('Administrator') == -1 && roleName.indexOf('Agent') == -1 && roleName.indexOf('Supervisor') == -1) {
              expect(shared.readOnlyMessage.isDisplayed()).toBeFalsy();
            }
          });
        }
      }
    });
  });

  xit('should be displayed for default everyone group', function() {
    // NOTE: Might timeout if there are a lot of users
    browser.get(shared.groupsPageUrl);

    shared.searchField.sendKeys('everyone');
    shared.tableElements.count().then(function(groupCount) {
      if (groupCount == 1) {
        shared.firstTableRow.click();
        expect(shared.readOnlyMessage.isDisplayed()).toBeTruthy();
        expect(shared.readOnlyMessage.getText()).toBe('This group is inherited and cannot be edited');
      }
    });
  });

  it('should be not displayed for custom groups', function() {
    shared.tableElements.then(function(allGroups) {
      if (allGroups.length > 1) {
        for (var i = 0; i < allGroups.length && i < 5; i++) {
          allGroups[i].getText().then(function (groupRowText) {
            if (groupRowText.indexOf('everyone') == -1) {
              shared.tableElements.get(i).click();
              expect(shared.readOnlyMessage.isDisplayed()).toBeFalsy();
            }
          });
        }
      }
    });
  });

});
