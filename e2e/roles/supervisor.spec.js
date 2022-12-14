'use strict';

describe('The Supervisor role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    role = require('../management/role.po.js'),
    skills = require('../management/skills.po.js'),
    groups = require('../management/groups.po.js'),
    extensions = require('../management/extensions.po.js'),
    invites = require('../invitations/invites.po.js'),
    profile = require('../userProfile/profile.po.js'),
    params = browser.params,
    random,
    supervisorEmail;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow new user to be created with the role', function() {
    // Create user with supervisor role
    random = Math.floor((Math.random() * 1000) + 1);
    supervisorEmail = 'supervisor' + random + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(supervisorEmail);
    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Supervisor')).click();
    users.platformRoleFormDropdown.element(by.cssContainingText('option', 'Platform User')).click();

    users.firstNameFormField.sendKeys('Supervisor' + random);
    users.lastNameFormField.sendKeys('Role' + random);

    users.submitFormBtn.click().then(function() {

      // Wait to allow the API to send and Mailinator to receive the email
      invites.goToInvitationAcceptPage();

      browser.driver.wait(function() {
        return invites.submitFormBtn.isPresent().then(function(submitBtn) {
          return submitBtn;
        });
      }, 50000).then(function() {
        invites.passwordFormField.sendKeys('password1!');

        invites.submitFormBtn.click().then(function() {
          expect(shared.message.isDisplayed()).toBeTruthy();
          expect(shared.message.getText()).toBe('Your invitation has been accepted!');
        });
      });
    });
  });

  it('should login as new user with Supervisor role', function() {
    expect(shared.welcomeMessage.getText()).toContain('Hello, Supervisor' + random + ' Role' + random);
  });

  it('should only have access to the current tenant', function() {
    shared.tenantsNavDropdownClick.click().then(function() {
      expect(shared.tenantsNavDropdownContents.count()).toBe(1);
      expect(shared.tenantsNavDropdownContents.get(0).getText()).toBe('Platform');
    });
  });

  it('should display nav bar links for User Management and Reporting pages only', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(shared.usersNavButton.isDisplayed()).toBeTruthy();
    expect(shared.reportingNavButton.isDisplayed()).toBeTruthy();

    //expect(shared.tenantsNavButton.isDisplayed()).toBeFalsy();
    expect(shared.flowsNavButton.isDisplayed()).toBeFalsy();
  });

  it('should only have access to User Management pages with limited permissions', function() {
    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toContain('management/users');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy(); // Cannot create
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); // Cannot perform bulk actions
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(0);

    /* TODO TITAN2-4936
    browser.get(shared.groupsPageUrl);
    expect(browser.getCurrentUrl()).toContain('management/groups');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy(); // Cannot create
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); // Cannot perform bulk actions
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    */

    /* TODO TITAN2-4936
    browser.get(shared.skillsPageUrl);
    expect(browser.getCurrentUrl()).toContain('management/skills');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy(); // Cannot create
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); // Cannot perform bulk actions
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    */

    browser.get(shared.rolePageUrl);
    expect(browser.getCurrentUrl()).toContain('management/roles');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy(); // Cannot create
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    // TODO TITAN2-4936 Admin role is not listed
    expect(shared.tableElements.count()).not.toBeLessThan(3);

    // Ensure default roles are listed
    shared.searchField.sendKeys('Agent');
    expect(shared.tableElements.count()).not.toBeLessThan(1);
    shared.searchField.clear();
    // TODO TITAN2-4936 Admin role is not listed
    shared.searchField.sendKeys('Administrator');
    expect(shared.tableElements.count()).not.toBeLessThan(1);
    shared.searchField.clear();
    shared.searchField.sendKeys('Supervisor');
    expect(shared.tableElements.count()).not.toBeLessThan(1);
  });

  it('should not have access to Configuration pages', function() {
    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.integrationsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
  });

  it('should not have access to Flow pages', function() {
    browser.get(shared.flowsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.queuesPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.mediaPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.mediaCollectionsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
    shared.message.click();

    browser.get(shared.dispatchMappingsPageUrl);
    expect(browser.getCurrentUrl()).toContain('userprofile?messageKey=permissions.unauthorized.message');
    expect(shared.message.isDisplayed()).toBeTruthy();
    expect(shared.message.getText()).toContain('Sorry, your account does not have the correct permissions to view that page.');
  });

  it('should have access to user profile details', function() {
    expect(profile.userEmail.getAttribute('value')).toContain(supervisorEmail);
    expect(profile.firstNameFormField.getAttribute('value')).toBe('Supervisor' + random);
    expect(profile.lastNameFormField.getAttribute('value')).toBe('Role' + random);

    expect(profile.resetPasswordButton.isDisplayed()).toBeTruthy();
    expect(profile.userSkillsSectionHeader.isDisplayed()).toBeTruthy();
    expect(profile.userGroupsSectionHeader.isDisplayed()).toBeTruthy();
  });

  it('should have access to edit user profile details', function() {
    // Sanity check: if user never got created, titan user will still be logged in
    profile.userEmail.getAttribute('value').then(function(userEmail) {
      if (userEmail != params.login.user) {
        profile.firstNameFormField.sendKeys('Update');
        profile.lastNameFormField.sendKeys('Update');
        profile.resetPasswordButton.click();
        profile.passwordFormField.sendKeys('newpassword1!');

        profile.updateProfileBtn.click().then(function() {
          shared.waitForSuccess();
          shared.successMessage.click();
          expect(profile.firstNameFormField.getAttribute('value')).toBe('Supervisor' + random + 'Update');
          expect(profile.lastNameFormField.getAttribute('value')).toBe('Role' + random + 'Update');
          expect(shared.welcomeMessage.getText()).toContain('Supervisor' + random + 'Update');
          expect(shared.welcomeMessage.getText()).toContain('Role' + random + 'Update');
        });
      }
    });
  });

  it('should allow user to add an extension', function() {
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
      });
    });
  });

  it('should not have access to edit an existing User', function() {
    browser.get(shared.usersPageUrl);
    shared.firstTableRow.click();

    expect(users.firstNameFormField.isEnabled()).toBeFalsy();
    expect(users.lastNameFormField.isEnabled()).toBeFalsy();
    expect(users.externalIdFormField.isEnabled()).toBeFalsy();
    expect(users.tenantRoleFormDropdown.isEnabled()).toBeFalsy();

    expect(extensions.typeDropdown.isEnabled()).toBeFalsy();
    expect(extensions.providerDropdown.isEnabled()).toBeFalsy();
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
  });

  // TODO: Supervisor cannot edit other's extensions; determine requirements
  xit('should have access to add Extensions existing User', function() {
    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();

    extensions.pstnValueFormField.sendKeys('15064561234\t');
    extensions.extFormField.sendKeys('12345');

    extensions.descriptionFormField.sendKeys('PSTN Extension description');
    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();

      expect(extensions.userExtensions.count()).toBe(2);
      shared.successMessage.click(); // Dismiss message
    });
  });

  xit('should have access to add Skills to existing User', function() {
    // TODO TITAN2-4936
    // Edit user previously created
    users.addSkillSearch.sendKeys('New Skill');
    users.addSkillBtn.click().then(function() {
      shared.waitForSuccess();

      expect(users.userSkills.count()).toBe(1);
      shared.successMessage.click(); // Dismiss message
    });
  });

  xit('should have access to add Groups to existing User', function() {
    // TODO TITAN2-4936
    // Edit user previously created
    users.addGroupSearch.sendKeys('New Group\t');
    users.addGroupBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(users.userGroups.count()).toBe(1);
    });
  });

  it('should have access to view existing User details', function() {
    shared.firstTableRow.click();

    shared.firstTableRow.element(by.css(users.nameColumn)).getText().then(function(firstRowUserName) {
      shared.firstTableRow.element(by.css(users.emailColumn)).getText().then(function(firstRowEmail) {
        if (firstRowUserName != firstRowEmail) {
          expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
          expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
          expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
          expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());
          // TODO TITAN2-4936
          //expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toContain(users.userSkills.count());
          //expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toContain(users.userGroups.count());
          expect(extensions.userExtensions.count()).toBeGreaterThan(0);
        } else {
          expect(users.firstNameFormField.getAttribute('value')).toBe('');
          expect(users.lastNameFormField.getAttribute('value')).toBe('');
          expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
          expect(users.userNameDetailsHeader.getText()).toBe(users.emailLabel.getText());
          // TODO TITAN2-4936
          //expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toContain(users.userSkills.count());
          //expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toContain(users.userGroups.count());
          expect(extensions.userExtensions.count()).toBeGreaterThan(0);
        }
      });
    });
  });

  xit('should not have access to edit an existing Skill', function() {
    // TODO TITAN2-4936
    browser.get(shared.skillsPageUrl);
    shared.firstTableRow.click();

    expect(skills.nameFormField.isEnabled()).toBeFalsy();
    expect(skills.descriptionFormField.isEnabled()).toBeFalsy();
    expect(skills.proficiencyFormCheckbox.isEnabled()).toBeFalsy();
  });

  xit('should have access to add members to an existing Skill', function() {
    // TODO TITAN2-4936
    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).click();
    skills.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
    });
  });

  xit('should have access to view existing Skill details', function() {
    // TODO TITAN2-4936
    shared.firstTableRow.click();

    // Verify skill details in table matches populated field
    expect(skills.nameHeader.getText()).toContain(shared.firstTableRow.element(by.css(skills.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(skills.nameColumn)).getText()).toBe(skills.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(skills.descriptionColumn)).getText()).toBe(skills.descriptionFormField.getAttribute('value'));
    expect(skills.detailsMemberCount.getText()).toContain(shared.firstTableRow.element(by.css(skills.membersColumn)).getText());
    shared.firstTableRow.element(by.css(skills.proficiencyColumn)).getText().then(function(skillProficiency) {
      if (skillProficiency == 'Yes') {
        expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
      } else if (skillProficiency == 'No') {
        expect(skills.proficiencySwitch.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
  });

  xit('should not have access to edit an existing Group', function() {
    // TODO TITAN2-4936
    browser.get(shared.groupsPageUrl);
    shared.firstTableRow.click();

    expect(groups.nameFormField.isEnabled()).toBeFalsy();
    expect(groups.descriptionFormField.isEnabled()).toBeFalsy();
  });

  xit('should have access to add members to an existing Group', function() {
    // TODO TITAN2-4936
    groups.addMemberField.click();
    groups.addMemberDropdownOptions.get(0).click();
    groups.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
    });
  });

  xit('should have access to view existing Group details', function() {
    // TODO TITAN2-4936
    groups.firstTableRow.click();

    // Verify group details in table matches populated field
    expect(groups.nameHeader.getText()).toContain(groups.firstTableRow.element(by.css(groups.nameColumn)).getText());
    expect(groups.firstTableRow.element(by.css(groups.nameColumn)).getText()).toBe(groups.nameFormField.getAttribute('value'));
    expect(groups.firstTableRow.element(by.css(groups.descriptionColumn)).getText()).toBe(groups.descriptionFormField.getAttribute('value'));
    expect(groups.detailsMemberCount.getText()).toContain(groups.firstTableRow.element(by.css(groups.membersColumn)).getText());
  });

  it('should not have access to edit an existing Role', function() {
    browser.get(shared.rolePageUrl);
    shared.tableElements.count(function(roleCount) {
      for (var i = 0; i < roleCount & i < 4; i++) {
        shared.tableElements.get(i).element(by.css(roles.nameColumn)).getText(roleName).then(function() {
          if (roleName !== 'Administrator' && roleName !== 'Agent' && roleName !== 'Supervisor') {
            shared.tableElements.get(i).click();
          }
        });
      }
    }).then(function() {
      expect(role.nameFormField.isEnabled()).toBeFalsy();
      expect(role.descriptionFormField.isEnabled()).toBeFalsy();
      expect(role.permissionsDropdown.isDisplayed()).toBeFalsy();
      expect(role.permissionAddBtn.isDisplayed()).toBeFalsy();
    });
  });

  it('should have access to view existing Role details', function() {
    shared.firstTableRow.click();

    expect(role.nameHeader.getText()).toContain(shared.firstTableRow.element(by.css(role.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(role.nameColumn)).getText()).toBe(role.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(role.descriptionColumn)).getText()).toBe(role.descriptionFormField.getAttribute('value'));
    expect(role.detailsPermissionCount.getText()).toContain(shared.firstTableRow.element(by.css(role.permissionsColumn)).getText());
  });
});
