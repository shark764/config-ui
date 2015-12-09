'use strict';

describe('The Administrator role', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    role = require('../management/role.po.js'),
    skills = require('../management/skills.po.js'),
    groups = require('../management/groups.po.js'),
    extensions = require('../management/extensions.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    integrations = require('../configuration/integrations.po.js'),
    flows = require('../flows/flows.po.js'),
    queues = require('../flows/queues.po.js'),
    newVersion = require('../flows/newQueueVersion.po.js'),
    media = require('../flows/media.po.js'),
    mediaCollections = require('../flows/mediaCollections.po.js'),
    dispatchMappings = require('../flows/dispatchMappings.po.js'),
    invites = require('../invitations/invites.po.js'),
    profile = require('../userProfile/profile.po.js'),
    params = browser.params,
    administratorEmail,
    random;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow new user to be created with the role', function() {
    // Create user with administrator role
    random = Math.floor((Math.random() * 1000) + 1);
    administratorEmail = 'administrator' + random + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(administratorEmail);
    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Administrator')).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('Administrator' + random);
    users.lastNameFormField.sendKeys('Role' + random);

    users.submitFormBtn.click().then(function() {

      // Wait to allow the API to send and Mailinator to receive the email
      invites.goToInvitationAcceptPage();

      browser.driver.wait(function() {
        return invites.submitFormBtn.isPresent().then(function(submitBtn) {
          return submitBtn;
        });
      }, 10000).then(function() {
        invites.passwordFormField.sendKeys('password');

        invites.submitFormBtn.click().then(function() {
          expect(shared.message.isDisplayed()).toBeTruthy();
          expect(shared.message.getText()).toBe('Your invitation has been accepted!');
        });
      });
    });
  });

  it('should login as new user with Administrator role', function() {
    expect(shared.welcomeMessage.getText()).toContain('Hello, Administrator' + random + ' Role' + random);
  });

  it('should only have access to the current tenant', function() {
    shared.tenantsNavDropdownClick.click().then(function() {
      expect(shared.tenantsNavDropdownContents.count()).toBe(1);
      expect(shared.tenantsNavDropdownContents.get(0).getText()).toBe('Platform');
    });
  });

  it('should display all nav bar links', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.usersNavButton.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavButton.isDisplayed()).toBeTruthy();
    expect(shared.flowsNavButton.isDisplayed()).toBeTruthy();
    expect(shared.reportingNavButton.isDisplayed()).toBeTruthy();
  });

  it('should have access to all User Management pages with full access', function() {
    browser.get(shared.usersPageUrl);
    expect(browser.getCurrentUrl()).toContain('management/users');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBeGreaterThan(0);

    browser.get(shared.groupsPageUrl);
    expect(browser.getCurrentUrl()).toContain('management/groups');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();

    browser.get(shared.skillsPageUrl);
    expect(browser.getCurrentUrl()).toContain('management/skills');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();

    browser.get(shared.rolePageUrl);
    expect(browser.getCurrentUrl()).toContain('management/roles');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).not.toBeLessThan(3);

    // Ensure default roles are listed
    shared.searchField.sendKeys('Agent');
    expect(shared.tableElements.count()).not.toBeLessThan(1);
    shared.searchField.clear();
    shared.searchField.sendKeys('Administrator');
    expect(shared.tableElements.count()).not.toBeLessThan(1);
    shared.searchField.clear();
    shared.searchField.sendKeys('Supervisor');
    expect(shared.tableElements.count()).not.toBeLessThan(1);
  });

  it('should have access to all Configuration pages with limited access', function() {
    browser.get(shared.tenantsPageUrl);
    expect(browser.getCurrentUrl()).toContain('configuration/tenants');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy(); // Cannot add new tenant
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.tableElements.count()).toBe(1); // Only display current tenant

    browser.get(shared.integrationsPageUrl);
    expect(browser.getCurrentUrl()).toContain('configuration/integrations');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
  });

  it('should have access to all Flow pages with full access', function() {
    browser.get(shared.flowsPageUrl);
    expect(browser.getCurrentUrl()).toContain('flows/management');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();

    browser.get(shared.queuesPageUrl);
    expect(browser.getCurrentUrl()).toContain('flows/queues');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();

    browser.get(shared.mediaCollectionsPageUrl);
    expect(browser.getCurrentUrl()).toContain('flows/media-collections');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();

    browser.get(shared.mediaPageUrl);
    expect(browser.getCurrentUrl()).toContain('flows/media');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();

    browser.get(shared.dispatchMappingsPageUrl);
    expect(browser.getCurrentUrl()).toContain('flows/dispatchMappings');
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
  });

  it('should have access to user profile details', function() {
    browser.get(shared.profilePageUrl)
    expect(profile.userEmail.getAttribute('value')).toContain(administratorEmail);
    expect(profile.firstNameFormField.getAttribute('value')).toBe('Administrator' + random);
    expect(profile.lastNameFormField.getAttribute('value')).toBe('Role' + random);

    expect(profile.resetPasswordButton.isDisplayed()).toBeTruthy();
    expect(profile.userSkillsSectionHeader.isDisplayed()).toBeTruthy();
    expect(profile.userGroupsSectionHeader.isDisplayed()).toBeTruthy();
  });

  it('should have access to edit user profile details', function() {
    profile.firstNameFormField.sendKeys('Update');
    profile.lastNameFormField.sendKeys('Update');
    profile.resetPasswordButton.click();
    profile.passwordFormField.sendKeys('newpassword');

    profile.updateProfileBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
      expect(profile.firstNameFormField.getAttribute('value')).toBe('Administrator' + random + 'Update');
      expect(profile.lastNameFormField.getAttribute('value')).toBe('Role' + random + 'Update');
      expect(shared.welcomeMessage.getText()).toContain('Administrator' + random + 'Update');
      expect(shared.welcomeMessage.getText()).toContain('Role' + random + 'Update');
    });
  });

  it('should have access to add a new User with equal or lesser Tenant Role', function() {
    browser.get(shared.usersPageUrl);

    shared.createBtn.click();
    users.emailFormField.sendKeys('newUser' + random + '@mailinator.com');

    users.tenantRoleFormDropdown.click();
    expect(users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Administrator')).isDisplayed()).toBeTruthy();
    expect(users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Supervisor')).isDisplayed()).toBeTruthy();
    expect(users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Agent')).isDisplayed()).toBeTruthy();

    users.tenantRoleFormDropdown.element(by.cssContainingText('option', 'Administrator')).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
    });
  });

  it('should have access to edit limited fields for an existing User', function() {
    // Edit user previously created
    expect(users.firstNameFormField.isEnabled()).toBeFalsy();
    expect(users.lastNameFormField.isEnabled()).toBeFalsy();
    expect(users.externalIdFormField.isEnabled()).toBeFalsy();
    expect(users.tenantRoleFormDropdown.isEnabled()).toBeTruthy();
  });

  xit('should have access to add Extensions existing User', function() {
    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();

    extensions.providerDropdown.click();
    extensions.twilioDropdownOption.click();

    extensions.valueFormField.sendKeys('15064561234\t');
    extensions.extFormField.sendKeys('12345');

    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();

      expect(extensions.userExtensions.count()).toBe(2);
      shared.successMessage.click(); // Dismiss message
    });
  });

  it('should have access to add Skills to existing User', function() {
    // Edit user previously created
    users.addSkillSearch.sendKeys('New Skill');
    users.addSkillBtn.click().then(function() {
      shared.waitForSuccess();

      expect(users.userSkills.count()).toBe(1);
      shared.successMessage.click(); // Dismiss message
    });
  });

  it('should have access to add Groups to existing User', function() {
    // Edit user previously created
    users.addGroupSearch.sendKeys('New Group\t');
    users.addGroupBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(users.userGroups.count()).toBe(1);
    });
  });

  it('should have access to view existing User details', function() {
    browser.get(shared.usersPageUrl);
    shared.firstTableRow.click();

    shared.firstTableRow.element(by.css(users.nameColumn)).getText().then(function(firstRowUserName) {
      if (firstRowUserName) {
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.firstNameFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toContain(users.lastNameFormField.getAttribute('value'));
        expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
        expect(shared.firstTableRow.element(by.css(users.nameColumn)).getText()).toBe(users.userNameDetailsHeader.getText());
        expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toContain(users.userSkills.count());
        expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toContain(users.userGroups.count());
      } else {
        expect(users.firstNameFormField.getAttribute('value')).toBe('');
        expect(users.lastNameFormField.getAttribute('value')).toBe('');
        expect(shared.firstTableRow.element(by.css(users.emailColumn)).getText()).toBe(users.emailLabel.getText());
        expect(users.userNameDetailsHeader.getText()).toBe('');
        expect(shared.firstTableRow.element(by.css(users.skillsColumn)).getText()).toContain(users.userSkills.count());
        expect(shared.firstTableRow.element(by.css(users.groupsColumn)).getText()).toContain(users.userGroups.count());
      }
    });
  });

  it('should have access to add a new Role', function() {
    browser.get(shared.rolePageUrl);
    shared.createBtn.click();

    // Edit fields
    role.nameFormField.sendKeys('Role Name ' + random);
    role.descriptionFormField.sendKeys('Role Description');
    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
    });
  });

  it('should have access to edit an existing Role', function() {
    role.nameFormField.sendKeys('Edit');
    role.descriptionFormField.sendKeys('Edit');

    role.permissionsDropdown.click();
    role.dropdownPermissions.get(0).click();
    role.permissionAddBtn.click();

    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(role.nameFormField.getAttribute('value')).toBe('Role Name ' + random + 'Edit');
      expect(role.descriptionFormField.getAttribute('value')).toBe('Role Description' + 'Edit');
      expect(role.rolePermissions.count()).toBe(1);
    });
  });

  it('should have access to view existing Role details', function() {
    shared.firstTableRow.click();

    expect(role.nameHeader.getText()).toContain(shared.firstTableRow.element(by.css(role.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(role.nameColumn)).getText()).toBe(role.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(role.descriptionColumn)).getText()).toBe(role.descriptionFormField.getAttribute('value'));
    expect(role.detailsPermissionCount.getText()).toContain(shared.firstTableRow.element(by.css(role.permissionsColumn)).getText());
  });

  it('should have access to add a new Skill', function() {
    browser.get(shared.skillsPageUrl);
    shared.createBtn.click();

    skills.nameFormField.sendKeys('New Skill ' + random);
    skills.descriptionFormField.sendKeys('Skill Description');
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
    });
  });

  it('should have access to edit an existing Skill', function() {
    skills.nameFormField.sendKeys('Edit');
    skills.descriptionFormField.sendKeys('Edit');
    skills.proficiencyFormCheckbox.click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(skills.nameFormField.getAttribute('value')).toBe('New Skill ' + random + 'Edit');
      expect(skills.descriptionFormField.getAttribute('value')).toBe('Skill DescriptionEdit');
      expect(skills.proficiencySwitch.isSelected()).toBeTruthy();
    });
  });

  it('should have access to add members to an existing Skill', function() {
    skills.addMemberField.click();
    skills.addMemberDropdownOptions.get(0).click();
    skills.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(skills.skillMembersRows.count()).toBe(1);
      expect(skills.detailsMemberCount.getText()).toContain('1');
    });
  });

  it('should have access to view existing Skill details', function() {
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

  it('should have access to add a new Group', function() {
    browser.get(shared.groupsPageUrl);
    shared.createBtn.click();

    groups.nameFormField.sendKeys('New Group ' + random);
    groups.descriptionFormField.sendKeys('Group Description');
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
    });
  });

  it('should have access to edit an existing Group', function() {
    groups.nameFormField.sendKeys('Edit');
    groups.descriptionFormField.sendKeys('Edit');
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(groups.nameFormField.getAttribute('value')).toBe('New Group ' + random + 'Edit');
      expect(groups.descriptionFormField.getAttribute('value')).toBe('Group DescriptionEdit');
    });
  });

  it('should have access to add members to an existing Group', function() {
    groups.addMemberField.click();
    groups.addMemberDropdownOptions.get(0).click();
    groups.addMemberBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      expect(groups.groupMembersRows.count()).toBe(1);
      expect(groups.detailsMemberCount.getText()).toContain('1');
    });
  });

  it('should have access to view existing Group details', function() {
    groups.firstTableRow.click();

    // Verify group details in table matches populated field
    expect(groups.nameHeader.getText()).toContain(groups.firstTableRow.element(by.css(groups.nameColumn)).getText());
    expect(groups.firstTableRow.element(by.css(groups.nameColumn)).getText()).toBe(groups.nameFormField.getAttribute('value'));
    expect(groups.firstTableRow.element(by.css(groups.descriptionColumn)).getText()).toBe(groups.descriptionFormField.getAttribute('value'));
    expect(groups.detailsMemberCount.getText()).toContain(groups.firstTableRow.element(by.css(groups.membersColumn)).getText());
  });

  xit('should have access to edit current Tenant', function() {
    // TODO Cannot edit platform tenant; enable if the test is run with a different tenant
    browser.get(shared.tenantsPageUrl);

    shared.firstTableRow.click();

    // Edit fields
    tenants.nameFormField.sendKeys('Edit');
    tenants.descriptionFormField.sendKeys('Edit');
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
    });
  });

  it('should have access to view current Tenant details only', function() {
    browser.get(shared.tenantsPageUrl);
    expect(shared.tableElements.count()).toBe(1);

    shared.firstTableRow.click();
    expect(tenants.firstTableRow.element(by.css(tenants.nameColumn)).getText()).toContain(tenants.nameFormField.getAttribute('value'));
    expect(tenants.firstTableRow.element(by.css(tenants.descriptionColumn)).getText()).toContain(tenants.descriptionFormField.getAttribute('value'));
    expect(tenants.region.isDisplayed()).toBeTruthy();
  });

  it('should have access to view an existing Integration', function() {
    browser.get(shared.integrationsPageUrl);
    shared.firstTableRow.click();

    expect(integrations.typeHeader.getText()).toContain(shared.firstTableRow.element(by.css(integrations.typeColumn)).getText());
    shared.firstTableRow.element(by.css(integrations.statusColumn)).getText().then(function(integrationStatus) {
      if (integrationStatus == 'Enabled') {
        expect(integrations.statusSwitchToggle.isSelected()).toBeTruthy();
      } else if (integrationStatus == 'Disabled') {
        expect(integrations.statusSwitchToggle.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      }
    });
  });

  it('should have access to edit existing Integration details', function() {
    shared.searchField.sendKeys('twilio');
    shared.firstTableRow.click();
    integrations.accountSIDFormField.getAttribute('value').then(function(originalAccountSID) {

      integrations.accountSIDFormField.sendKeys('Edit');
      integrations.authTokenFormField.sendKeys('Edit');
      integrations.webRTCFormSwitch.click();

      shared.submitFormBtn.click().then(function() {
        shared.waitForSuccess();

        // If fields weren't blank then reset
        if (originalAccountSID) {
          integrations.accountSIDFormField.sendKeys('\u0008\u0008\u0008\u0008');
          integrations.authTokenFormField.sendKeys('\u0008\u0008\u0008\u0008');
          integrations.webRTCFormSwitch.click();

          shared.submitFormBtn.click().then(function() {
            shared.waitForSuccess();
          });
        }
      });
    });
  });

  it('should have access to add a new Flow', function() {
    browser.get(shared.flowsPageUrl);
    shared.createBtn.click();
  });

  // TODO
  xit('should have access to edit an existing Flow', function() {});

  it('should have access to view existing Flow details', function() {
    browser.get(shared.flowsPageUrl);
    expect(shared.firstTableRow.getText()).toContain(flows.nameFormField.getAttribute('value'));
  });

  it('should have access to add a new Queue', function() {
    browser.get(shared.queuesPageUrl);
    shared.createBtn.click();

    queues.nameFormField.sendKeys('Queue ' + random);
    queues.descriptionFormField.sendKeys('This is the queue description for queue ' + random);
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
    });
  });

  it('should have access to edit an existing Queue', function() {
    queues.nameFormField.sendKeys('Edit');
    queues.descriptionFormField.sendKeys('Edit');
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();

      expect(queues.nameFormField.getAttribute('value')).toBe('Queue ' + random + 'Edit');
      expect(queues.descriptionFormField.getAttribute('value')).toBe('This is the queue description for queue ' + random + 'Edit');
    });
  });

  it('should have access to add version to an existing Queue', function() {
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(originalVersionCount) {
      queues.addNewVersionBtn.click()
      newVersion.createVersionBtn.click().then(function() {
        shared.waitForSuccess();
        expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(originalVersionCount);
        expect(queues.activeVersionDropdown.all(by.css('option')).get(0).getText()).toBe('v' + (originalVersionCount + 1));
        expect(queues.queueVersions.get(0).getText()).toContain('v' + (originalVersionCount + 1));
      });
    });
  });

  it('should have access to view existing Queue details', function() {
    shared.firstTableRow.click();

    expect(shared.firstTableRow.getText()).toContain(queues.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.getText()).toContain(queues.descriptionFormField.getAttribute('value'));
    expect(shared.firstTableRow.getText()).toContain(queues.activeVersionDropdown.$('option:checked').getText());
  });

  it('should have access to add a new Media', function() {
    browser.get(shared.mediaPageUrl);
    shared.createBtn.click();

    media.nameFormField.sendKeys('Audio Media ' + random);
    media.audioSourceFormField.sendKeys('http://www.example.com/' + random);
    media.typeFormDropdown.all(by.css('option')).get(1).click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
    });
  });

  it('should have access to edit an existing Media', function() {
    media.nameFormField.sendKeys('Edit');
    media.audioSourceFormField.sendKeys('Edit');
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(media.nameFormField.getAttribute('value')).toBe('Audio Media ' + random + 'Edit');
      expect(media.audioSourceFormField.getAttribute('value')).toBe('http://www.example.com/' + random + 'Edit');
    });
  });

  it('should have access to view existing Media details', function() {
    shared.searchField.sendKeys('Audio');
    shared.firstTableRow.click();

    expect(shared.detailsFormHeader.getText()).toContain(shared.firstTableRow.element(by.css(media.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(media.sourceColumn)).getText()).toBe(media.audioSourceFormField.getAttribute('value'));
  });

  it('should have access to add a new Media Collection', function() {
    browser.get(shared.mediaCollectionsPageUrl);
    shared.createBtn.click();

    mediaCollections.nameFormField.sendKeys('Media Collection ' + random);
    mediaCollections.defaultIdDropdown.click();
    mediaCollections.mediaIdentifiers.get(0).sendKeys('Identifier');
    mediaCollections.mediaDropdowns.get(0).click();
    mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();
    mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();
    mediaCollections.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
    });
  });

  it('should have access to edit an existing Media Collection', function() {
    mediaCollections.nameFormField.sendKeys('Edit');
    mediaCollections.descriptionFormField.sendKeys('Edit');

    mediaCollections.submitFormBtn.click().then(function() {
      shared.waitForSuccess();

      expect(mediaCollections.nameFormField.getAttribute('value')).toBe('Media Collection ' + random + 'Edit');
      expect(mediaCollections.descriptionFormField.getAttribute('value')).toBe('Edit');
    });
  });

  it('should have access to view existing Media Collection details', function() {
    shared.firstTableRow.click();

    expect(shared.firstTableRow.element(by.css(mediaCollections.nameColumn)).getText()).toContain(mediaCollections.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(mediaCollections.descriptionColumn)).getText()).toBe(mediaCollections.descriptionFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(mediaCollections.identifierColumn)).getText()).toContain(mediaCollections.defaultIdDropdown.$('option:checked').getText());
  });

  it('should have access to add a new Dispatch Mapping', function() {
    browser.get(shared.dispatchMappingsPageUrl);
    shared.createBtn.click();

    dispatchMappings.nameFormField.sendKeys('DispatchMapping ' + random);
    dispatchMappings.descriptionFormField.sendKeys('Description for dispatch mapping ' + random);
    // Select Customer Mapping
    dispatchMappings.mappingOptions.get(1).click();
    dispatchMappings.phoneFormField.sendKeys('15062345678');
    dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
    });
  });

  it('should have access to edit an existing Dispatch Mapping', function() {
    dispatchMappings.nameFormField.sendKeys('Edit');
    dispatchMappings.descriptionFormField.sendKeys('Edit');
    shared.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      expect(dispatchMappings.nameFormField.getAttribute('value')).toBe('DispatchMapping ' + random + 'Edit');
      expect(dispatchMappings.descriptionFormField.getAttribute('value')).toBe('Description for dispatch mapping ' + random + 'Edit');
    });
  });

  it('should have access to view existing Dispatch Mapping details', function() {
    shared.firstTableRow.click();

    // Verify dispatch mapping details in table matches populated field
    expect(shared.firstTableRow.element(by.css(dispatchMappings.nameColumn)).getText()).toBe(dispatchMappings.nameHeader.getText());
    dispatchMappings.mappingDropdown.$('option:checked').getText().then(function(value) {
      if (value == 'Contact Point') {
        expect(shared.firstTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe('contact-point');
      } else if (value == 'Integration') {
        expect(shared.firstTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe('source');
      } else {
        expect(shared.firstTableRow.element(by.css(dispatchMappings.interactionFieldColumn)).getText()).toBe(value.toLowerCase());
      }
    });
    dispatchMappings.interactionTypeDropdown.$('option:checked').getText().then(function(value) {
      expect(shared.firstTableRow.element(by.css(dispatchMappings.channelTypeColumn)).getText()).toBe(value.toLowerCase());
    });

    shared.firstTableRow.element(by.css(dispatchMappings.statusColumn)).getText().then(function(dispatchMappingStatus) {
      if (dispatchMappingStatus == 'Enabled') {
        expect(dispatchMappings.statusSwitchInput.isSelected()).toBeTruthy();
      } else if (dispatchMappingStatus == 'Disabled') {
        expect(dispatchMappings.statusSwitchInput.isSelected()).toBeFalsy();
      } else {
        // fail test
        expect(true).toBeFalsy();
      };
    });
  });
});
