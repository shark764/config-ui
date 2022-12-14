'use strict';

describe('The profile view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    profile = require('./profile.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    users = require('../management/users.po.js'),
    extensions = require('../management/extensions.po.js'),
    params = browser.params,
    defaultTenantName,
    newTenantName,
    extensionCount;

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

    // Does not update password if current user is titantest
    if (params.login.user !== 'titan@liveops.com') {
      profile.passwordFormField.clear();
      profile.passwordFormField.sendKeys(params.login.password);
    }

    profile.updateProfileBtn.click().then(function() {
      shared.tearDown();
    });
  });

  it('should include profile page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(profile.firstNameFormField.getAttribute('value')).toBe(params.login.firstName);
    expect(profile.lastNameFormField.getAttribute('value')).toBe(params.login.lastName);
    expect(profile.userEmail.getAttribute('value')).toContain(params.login.user);
    expect(profile.userEmail.isEnabled()).toBeFalsy();
    expect(profile.userProfilePic.isDisplayed()).toBeTruthy();

    expect(profile.resetPasswordButton.isDisplayed()).toBeTruthy();
    expect(profile.passwordFormField.isDisplayed()).toBeFalsy();
    expect(profile.passwordPolicy.isDisplayed()).toBeFalsy();
    expect(profile.updateProfileBtn.isDisplayed()).toBeTruthy();

    expect(profile.userSkillsSectionHeader.isDisplayed()).toBeTruthy();
    expect(profile.userGroupsSectionHeader.isDisplayed()).toBeTruthy();
  });

  it('should include extension fields', function() {
    expect(extensions.extensionsSection.isDisplayed()).toBeTruthy();
    expect(extensions.typeDropdown.isDisplayed()).toBeTruthy();
    expect(extensions.providerDropdown.isDisplayed()).toBeTruthy();
    expect(extensions.pstnValueFormField.isDisplayed()).toBeFalsy(); // Hidden by default when WebRTC is selected
    expect(extensions.extFormField.isDisplayed()).toBeFalsy(); // Hidden by default when WebRTC is selected
    expect(extensions.sipValueFormField.isDisplayed()).toBeFalsy(); // Hidden by default when WebRTC is selected
    expect(extensions.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(extensions.addBtn.isDisplayed()).toBeTruthy();

    expect(extensions.table.isDisplayed()).toBeTruthy();
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

  it('should require first and last name', function() {
    profile.firstNameFormField.clear();
    profile.lastNameFormField.clear();
    profile.lastNameFormField.sendKeys('\t');

    // Submit button is disabled
    expect(profile.updateProfileBtn.isEnabled()).toBeFalsy();
    profile.updateProfileBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Error messages
    expect(profile.errors.count()).toBe(2);
    expect(profile.errors.get(0).getText()).toBe('Please enter a first name');
    expect(profile.errors.get(1).getText()).toBe('Please enter a last name');
  });

  it('should not accept spaces as valid input for required fields', function() {
    profile.firstNameFormField.clear();
    profile.lastNameFormField.clear();
    profile.firstNameFormField.sendKeys(' ');
    profile.lastNameFormField.sendKeys(' \t');

    // Submit button is disabled
    expect(profile.updateProfileBtn.isEnabled()).toBeFalsy();
    profile.updateProfileBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Error messages
    expect(profile.errors.count()).toBe(2);
    expect(profile.errors.get(0).getText()).toBe('Please enter a first name');
    expect(profile.errors.get(1).getText()).toBe('Please enter a last name');
  });

  it('should display password policy when reset password button is clicked', function() {
    profile.resetPasswordButton.click();

    expect(profile.passwordFormField.isDisplayed()).toBeTruthy();
    expect(profile.passwordPolicy.isDisplayed()).toBeTruthy();
    expect(profile.passwordPolicy.getText()).toBe(profile.passwordPolicyText);
  });

  it('should require password after reset password button is clicked', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.clear();
    profile.firstNameFormField.click();

    // Submit button is disabled
    expect(profile.updateProfileBtn.getAttribute('disabled')).toBeTruthy();
    profile.updateProfileBtn.click();

    // Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('Please enter a password');
  });

  it('should display error for invalid password and remove after editing field', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('notvalid');
    profile.updateProfileBtn.click();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    shared.waitForError();
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.updateProfileBtn.getAttribute('disabled')).toBeTruthy();

    // Edit field
    profile.passwordFormField.sendKeys('edit');
    expect(profile.errors.count()).toBe(0);
    expect(profile.updateProfileBtn.getAttribute('disabled')).toBeFalsy();
  });

  it('should not accept spaces for password input', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('       ');
    profile.updateProfileBtn.click();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    shared.waitForError();

    // Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('must be a non-blank string');
  });

  it('should require password with more than 8 characters', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('seven1!');
    profile.updateProfileBtn.click();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    shared.waitForError();

    // Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('must be at least 8 characters in length');
  });

  it('should require password with at least one letter', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('12345678!');
    profile.updateProfileBtn.click();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    shared.waitForError();

    // Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('must contain at least 1 alphabetic characters');
  });

  it('should require password with at least one number', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('abcdefg!');
    profile.updateProfileBtn.click();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    shared.waitForError();

    // Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('must contain at least 1 numeric case characters');
  });

  it('should require password with at least one special character', function() {
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('abcdefg1');
    profile.updateProfileBtn.click();

    expect(shared.successMessage.isPresent()).toBeFalsy();
    shared.waitForError();

    // Error messages
    expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
    expect(profile.errors.get(0).getText()).toBe('must contain at least 1 characters from !#$%-_=+<>.');
  });

  it('should accept a password with 8 characters, 1 letter, 1 number and 1 special character', function() {
    // Do not update password if current user is titantest
    if (params.login.user !== 'titan@liveops.com') {
      profile.resetPasswordButton.click();
      profile.passwordFormField.sendKeys('abcdef1!');
      profile.updateProfileBtn.click().then(function() {
        shared.waitForSuccess();
        shared.closeMessageBtn.click();

        // No validation messages displayed
        expect(profile.errors.count()).toBe(0);
      });
    }
  });

  it('should not unauthorize the user after password change', function() {
    browser.get(shared.usersPageUrl);

    shared.createBtn.click();
    var randomUser = Math.floor((Math.random() * 1000) + 1);

    users.emailFormField.sendKeys('titantest' + randomUser + '@mailinator.com\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();
    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
    });
  });

  it('should apply the new password', function() {
    // Do not update password if current user is titantest
    if (params.login.user !== 'titan@liveops.com') {
      // Change the password
      profile.resetPasswordButton.click();
      profile.passwordFormField.clear();
      profile.passwordFormField.sendKeys(params.login.password + 'new');

      // Log in with the new password
      profile.updateProfileBtn.click().then(function() {
        shared.waitForSuccess();
        shared.closeMessageBtn.click();

        // No validation messages displayed
        expect(profile.errors.count()).toBe(0);
      });
    }
  });

  it('should login with new password', function() {
    // Does not update password if current user is titantest
    if (params.login.user !== 'titan@liveops.com') {
      shared.welcomeMessage.click();
      shared.logoutButton.click();
      loginPage.login(params.login.user, params.login.password + 'new');
      expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
    }
  });

  it('should display message if user has no groups or skills', function() {
    profile.waitForUserSkills();
    profile.userSkills.count().then(function(userSkillsCount) {
      if (userSkillsCount > 0) {
        expect(profile.noUserSkillsMessage.isPresent()).toBeFalsy();
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
    profile.waitForUserSkills();
    profile.userSkills.then(function(userSkillElements) {
      for (var i = 0; i < userSkillElements.length; i++) {
        userSkillElements[i].getText().then(function(skillName) {
          userSkillsList.push(skillName);
        });
      }
    });

    // Get list of User Groups
    profile.userGroups.then(function(userGroupElements) {
      for (var j = 0; j < userGroupElements.length; j++) {
        userGroupElements[j].getText().then(function(groupName) {
          userGroupsList.push(groupName);
        });
      }
    }).then(function() {
      browser.get(shared.usersPageUrl);
      // Compare user skills from profile page
      shared.searchField.sendKeys(params.login.user);
      shared.firstTableRow.click();

      // Wait for user skills
      browser.driver.wait(function() {
        return users.userSkills.count().then(function(userSkillCount) {
          return userSkillCount == userSkillsList.length;
        });
      }, 5000).then(function() {

        expect(users.userSkills.count()).toBe(userSkillsList.length)
        expect(users.userGroups.count()).toBe(userGroupsList.length)

        for (var i = 0; i < userSkillsList.length; i++) {
          expect(userSkillsList[i]).toContain(users.userSkills.get(i).getText());
        }

        for (var j = 0; j < userGroupsList.length; j++) {
          expect(users.userGroups.get(j).getText()).toBe(userGroupsList[j]);
        }
      });
    });
  });

  // TODO TITAN2-7078
  xit('should display user groups and skills for the current tenant', function() {
    browser.get(shared.tenantsPageUrl);
    shared.tenantsNavDropdown.getText().then(function(selectTenantNav) {
      defaultTenantName = selectTenantNav;
    });
    newTenantName = tenants.createTenant();
    tenants.selectTenant(newTenantName);

    // No skills or groups for the new Tenant
    browser.get(shared.profilePageUrl);
    profile.waitForUserSkills();
    expect(profile.userSkills.count()).toBe(0);
    expect(profile.noUserSkillsMessage.isDisplayed()).toBeTruthy();
    expect(profile.userGroups.count()).toBe(1); // everyone group
    expect(profile.userGroups.get(0).getText()).toBe('everyone');
  });

  // TODO TITAN2-7078
  xit('should add new user groups and skills for the current tenant', function() {
    tenants.selectTenant(newTenantName);

    // Add user skill and group
    browser.get(shared.usersPageUrl);
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();
    users.addGroupSearch.sendKeys('User Group ' + newTenantName);
    users.addGroupBtn.click();
    users.addSkillSearch.sendKeys('User Skill ' + newTenantName);
    users.addSkillBtn.click().then(function() {
      shared.waitForSuccess();

      // Verify added to current tenant profile page but not previous
      browser.get(shared.profilePageUrl);
      profile.waitForUserSkills();
      expect(profile.userSkills.count()).toBe(1);
      expect(profile.userSkills.get(0).getText()).toContain('User Skill ' + newTenantName);
      expect(profile.userGroups.count()).toBe(2);
      expect(['User Group ' + newTenantName, 'everyone']).toContain(profile.userGroups.get(0).getText());

      tenants.selectTenant(defaultTenantName);
      profile.waitForUserSkills();
      profile.userSkills.each(function(userSkillItem) {
        expect(userSkillItem.getText()).not.toContain('User Skill ' + newTenantName);
      });
      profile.userGroups.each(function(userGroupItem) {
        expect(userGroupItem.getText()).not.toBe('User Group ' + newTenantName);
      });
    });
  });

  it('should allow user to add an extension', function() {
    // Do not update if current user is titantest
    if (params.login.user !== 'titan@liveops.com') {
      extensions.userExtensions.count().then(function(originalExtensionCount) {
        extensions.typeDropdown.click();
        extensions.pstnDropdownOption.click();

        extensions.pstnValueFormField.sendKeys('15064561234\t');
        extensions.extFormField.sendKeys('12345');

        extensions.descriptionFormField.sendKeys('PSTN Extension description');

        extensions.addBtn.click().then(function() {
          shared.waitForSuccess();

          expect(extensions.userExtensions.count()).toBe(originalExtensionCount + 1);
          var newExtension = extensions.userExtensions.get(originalExtensionCount);
          expect(newExtension.element(by.css('.type-col')).getText()).toContain('PSTN');
          expect(newExtension.element(by.css('.phone-number-col')).getText()).toBe('+15064561234x12345');
          expect(newExtension.element(by.css('.description-col')).getText()).toBe('PSTN Extension description');
          expect(newExtension.element(by.css('.remove')).isDisplayed()).toBeTruthy();

          // Fields are reset
          expect(extensions.typeDropdown.$('option:checked').getText()).toContain('WebRTC');
          expect(extensions.providerDropdown.$('option:checked').getText()).toContain('Provider');
          expect(extensions.pstnValueFormField.isDisplayed()).toBeFalsy();
          expect(extensions.extFormField.isDisplayed()).toBeFalsy();
          expect(extensions.descriptionFormField.getAttribute('value')).toBe('');
        });
      });
    }
  });

  it('should require description when adding an extension', function() {
    extensions.userExtensions.count().then(function(originalExtensionCount) {
      extensions.typeDropdown.click();
      extensions.pstnDropdownOption.click();

      extensions.descriptionFormField.click();
      extensions.pstnValueFormField.sendKeys('15064561234\t');
      extensions.extFormField.sendKeys('12345');

      expect(extensions.addBtn.isEnabled()).toBeFalsy();
      extensions.addBtn.click();

      // Error messages
      expect(profile.errors.get(0).isDisplayed()).toBeTruthy();
      expect(profile.errors.get(0).getText()).toBe('Please provide a description');

      extensions.descriptionFormField.sendKeys('PSTN Extension description\t');
      expect(profile.errors.count()).toBe(0);
      expect(extensions.addBtn.isEnabled()).toBeTruthy();
    });
  });

  it('should add an extension and update user page', function() {
    // Do not update if current user is titantest
    if (params.login.user !== 'titan@liveops.com') {
      extensionCount = extensions.userExtensions.count();

      extensions.typeDropdown.click();
      extensions.pstnDropdownOption.click();

      extensions.pstnValueFormField.sendKeys('15064657894\t');
      extensions.extFormField.sendKeys('12345');

      extensions.descriptionFormField.sendKeys('PSTN Extension description');
      extensions.addBtn.click().then(function() {
        shared.waitForSuccess();

        expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
        extensionCount = extensions.userExtensions.count();

        browser.get(shared.usersPageUrl);
        shared.searchField.sendKeys(params.login.user);
        shared.firstTableRow.click();
        expect(extensions.userExtensions.count()).toBe(extensionCount);
      });
    }
  });

  it('should remove an extension and update user page', function() {
    // Do not update if current user is titantest
    if (params.login.user !== 'titan@liveops.com') {
      extensionCount = extensions.userExtensions.count();

      extensions.removeBtns.get(0).click().then(function() {
        shared.waitForSuccess();

        expect(extensions.userExtensions.count()).toBeLessThan(extensionCount);
        extensionCount = extensions.userExtensions.count();

        browser.get(shared.usersPageUrl);
        shared.searchField.sendKeys(params.login.user);
        shared.firstTableRow.click();
        expect(extensions.userExtensions.count()).toBe(extensionCount);
      });
    }
  });

  xit('should update order on user profile page', function() {
    var originalUserExtensionOrder = [];
    extensions.userExtensions.each().then(function(extensionRow) {
      extensionRow.getText().then(function(extensionRowText) {
        originalUserExtensionOrder.push(extensionRowText);
      });
    }).then(function() {
      // Drag second extension to the bottom
      browser.actions().dragAndDrop(extensions.sortingHandles.get(1), extensions.sortingHandles.get(originalUserExtensionOrder.length - 1)).perform();

      // All other extensions are moved up in order
      expect(extensions.userExtensions.get(0).getText()).toBe(originalUserExtensionOrder[0]);
      for (var i = 1; i < originalUserExtensionOrder.length - 1; i++) {
        expect(extensions.userExtensions.get(i).getText()).toBe(originalUserExtensionOrder[i + 1]);
      }
      expect(extensions.userExtensions.get(originalUserExtensionOrder.length - 1).getText()).toBe(originalUserExtensionOrder[1]);
    });
  });
});
