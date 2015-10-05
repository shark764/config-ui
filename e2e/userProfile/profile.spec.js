'use strict';

describe('The profile view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    profile = require('./profile.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    users = require('../management/users.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.profilePageUrl);
  });

  afterAll(function() {
    // Reset user details
    browser.get(shared.profilePageUrl);
    profile.firstNameFormField.clear();
    profile.firstNameFormField.sendKeys(params.login.firstName);
    profile.lastNameFormField.clear();
    profile.lastNameFormField.sendKeys(params.login.lastName);
    profile.resetPasswordButton.click();
    profile.passwordFormField.clear();
    profile.passwordFormField.sendKeys(params.login.password);

    profile.updateProfileBtn.click().then(function() {
      shared.tearDown();
    });
  });

  it('should include profile page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName);
    expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName);
    expect(profile.userEmail.getText()).toContain(params.login.user);
    expect(profile.userProfilePic.isDisplayed()).toBeTruthy();

    expect(profile.resetPasswordButton.isDisplayed()).toBeTruthy();
    expect(profile.updateProfileBtn.isDisplayed()).toBeTruthy();

    expect(profile.userSkillsSectionHeader.isDisplayed()).toBeTruthy();
    expect(profile.userGroupsSectionHeader.isDisplayed()).toBeTruthy();
  });

  it('should update user name', function() {
    profile.firstNameFormField.sendKeys('Update');
    profile.lastNameFormField.sendKeys('Update');

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
      expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName + 'Update');
      expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.firstName + 'Update');
      expect(shared.welcomeMessage.getText()).toContain(params.login.lastName + 'Update');

      // Confirm user is updated
      browser.get(shared.usersPageUrl);
      shared.searchField.sendKeys(params.login.firstName + 'Update ' + params.login.lastName + 'Update');
      expect(shared.tableElements.count()).toBe(1);
    });
  });

  it('should not require first or last name', function() {
    profile.firstNameFormField.clear();
    profile.lastNameFormField.clear();

    profile.updateProfileBtn.click().then(function() {
      expect(shared.successMessage.isPresent()).toBeTruthy();
      expect(profile.firstNameFormField.getAttribute('value')).toBe('');
      expect(profile.lastNameFormField.getAttribute('value')).toBe('');

      // Welcome message shows user email
      expect(shared.welcomeMessage.getText()).toContain('Welcome back, ' + params.login.user);
      expect(shared.welcomeMessage.getText()).not.toContain(params.login.firstName + 'Update');
      expect(shared.welcomeMessage.getText()).not.toContain(params.login.lastName + 'Update');

      // Confirm user is updated
      shared.welcomeMessage.click();
      shared.logoutButton.click();

      loginPage.login(params.login.user, params.login.password);
      expect(shared.welcomeMessage.getText()).toContain('Welcome back, ' + params.login.user);
    });
  });

  it('should require password after reset password button is clicked', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.clear();
    profile.firstNameFormField.click();

    //Submit button is disabled
    expect(profile.updateProfileBtn.getAttribute('disabled')).toBeTruthy();
    profile.updateProfileBtn.click();

    //Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('Please enter a password');
  });

  it('should apply the new password', function() {
    //Change the password
    profile.resetPasswordButton.click();
    profile.passwordFormField.clear();
    profile.passwordFormField.sendKeys(params.login.password + 'new');

    //Log in with the new password
    profile.updateProfileBtn.click();
    shared.closeMessageBtn.click();
    shared.welcomeMessage.click();
    shared.logoutButton.click();
    loginPage.login(params.login.user, params.login.password + 'new');
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });

  it('should display message if user has no groups or skills', function() {
    profile.userSkills.count().then(function(userSkillsCount) {
      if (userSkillsCount > 0) {
        expect(profile.noUserSkillsMessage.isDisplayed()).toBeFalsy();
      } else {
        expect(profile.noUserSkillsMessage.isDisplayed()).toBeTruthy();
      }
    });

    profile.userGroups.count().then(function(userGroupsCount) {
      if (userGroupsCount > 0) {
        expect(profile.noUserGroupsMessage.isDisplayed()).toBeFalsy();
      } else {
        expect(profile.noUserGroupsMessage.isDisplayed()).toBeTruthy();
      }
    });
  });

  it('should display user groups and skills', function() {
    var userSkillsList = [];
    var userGroupsList = [];

    // Get list of User Skills
    profile.userSkills.each(function(userSkillElement, index) {
      userSkillElement.getText().then(function(skillName) {
        userSkillsList.push(skillName);
      });
    }).then(function() {
      // Get list of User Groups
      profile.userGroups.each(function(userGroupElement, index) {
        userGroupElement.getText().then(function(groupName) {
          userGroupsList.push(groupName);
        });
      });
    }).then(function() {
      browser.get(shared.usersPageUrl);

      // Compare user skills from profile page
      shared.searchField.sendKeys(params.login.user);
      shared.firstTableRow.click();

      expect(users.userSkills.count()).toBe(userSkillsList.length)
      expect(users.userGroups.count()).toBe(userGroupsList.length)

      for (var i = 0; i < userSkillsList.length; i++) {
        expect(userSkillsList[i]).toContain(users.userSkills.get(i).getText());
      }

      for (var j = 0; j < userGroupsList.length; i++) {
        expect(users.userGroups.get(i).getText()).toBe(userGroupsList[i]);
      }
    });
  });

  it('should display user groups and skills for the current tenant', function() {
    browser.get(shared.tenantsPageUrl);
    var defaultTenantName;
    shared.tenantsNavDropdown.getText().then(function(selectTenantNav) {
      defaultTenantName = selectTenantNav;
    });
    var newTenantName = tenants.createTenant();
    tenants.selectTenant(newTenantName);

    // No skills or groups for the new Tenant
    browser.get(shared.profilePageUrl);
    expect(profile.userSkills.count()).toBe(0);
    expect(profile.noUserSkillsMessage.isDisplayed()).toBeTruthy();
    expect(profile.userGroups.count()).toBe(0);
    expect(profile.noUserGroupsMessage.isDisplayed()).toBeTruthy();

    // Add user skill and group
    browser.get(shared.usersPageUrl);
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();
    users.addGroupSearch.sendKeys('User Group ' + newTenantName);
    users.addGroupBtn.click();
    users.addSkillSearch.sendKeys('User Skill ' + newTenantName);
    users.addSkillBtn.click().then(function () {
      shared.waitForSuccess();

      // Verify added to current tenant profile page but not previous
      browser.get(shared.profilePageUrl);
      expect(profile.userSkills.count()).toBe(1);
      expect(profile.userSkills.get(0).getText()).toContain('User Skill ' + newTenantName);
      expect(profile.userGroups.count()).toBe(1);
      expect(profile.userGroups.get(0).getText()).toBe('User Group ' + newTenantName);

      tenants.selectTenant(defaultTenantName);
      profile.userSkills.each(function (userSkillItem) {
        expect(userSkillItem.getText()).not.toContain('User Skill ' + newTenantName);
      });
      profile.userGroups.each(function (userGroupItem) {
        expect(userGroupItem.getText()).not.toBe('User Group ' + newTenantName);
      });
    });
  });

});
