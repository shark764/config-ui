'use strict';

describe('When switching tenants', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    skills = require('../management/skills.po.js'),
    groups = require('../management/groups.po.js'),
    roles = require('../management/roles.po.js'),
    params = browser.params,
    elementCount,
    defaultTenantName,
    defaultTenantDropdownItem,
    defaultTenantElementList = [],
    newTenantName,
    mutualUserFirstName,
    mutualUserEmail;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.tenantsPageUrl);
    shared.tenantsNavDropdown.getText().then(function(selectTenantNav) {
      defaultTenantName = selectTenantNav;
    });

    // Create new Tenant that all tests will use; admin defaults to current user
    newTenantName = tenants.createTenant();
    tenants.selectTenant(newTenantName);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('Users Management page', function() {
    beforeAll(function() {
      browser.get(shared.usersPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct users for the current tenant', function() {
      // New tenant should only have 1 user by default
      expect(elementCount).toBe(1);

      // User should be the current user add as the tenant Admin by default
      expect(shared.firstTableRow.getText()).toContain(params.login.firstName + ' ' + params.login.lastName);
      expect(shared.firstTableRow.getText()).toContain(params.login.user);
    });

    it('should display the correct User Details for the Current user for the new tenant', function() {
      // Current user should default to Administrator role in the new tenant and be Accepted by default
      expect(shared.firstTableRow.getText()).toContain('Administrator');
      expect(shared.firstTableRow.getText()).toContain('Accepted');

      // No Skills or Groups by default
      expect(shared.firstTableRow.getText()).toContain('0 0');
      shared.firstTableRow.click();
      expect(users.userSkills.count()).toBe(0);
      expect(users.noUserSkillsMessage.isDisplayed()).toBeTruthy();

      // TODO Exception for everyone group?
      expect(users.userGroups.count()).toBe(0);
      expect(users.noUserGroupsMessage.isDisplayed()).toBeTruthy();

      // Correct email displayed
      expect(users.emailLabel.getText()).toBe(params.login.user);
    });

    it('should display the correct Skills and Groups available for the current tenant', function() {
      // There should be no Skills or Groups available for the new tenant
      users.addSkillSearch.click();
      expect(users.skillDropdownItems.count()).toBe(0);

      // Only 'everyone' group is added to the tenant by default
      users.addGroupSearch.click();
      expect(users.groupDropdownItems.count()).toBe(1);
      expect(users.groupDropdownItems.get(0).getText()).toBe('everyone');
    });

    it('should display the correct Roles available for the current tenant', function() {
      shared.createBtn.click();

      // Only the default roles are displayed
      users.tenantRoleFormDropdown.click();
      expect(users.tenantRoleFormDropdownOptions.count()).toBe(4);
      expect(users.tenantRoleFormDropdownOptions.get(0).getText()).toContain('Select a role');
      expect(users.tenantRoleFormDropdownOptions.get(1).getText()).toBe('Administrator');
      expect(users.tenantRoleFormDropdownOptions.get(2).getText()).toBe('Supervisor');
      expect(users.tenantRoleFormDropdownOptions.get(3).getText()).toBe('Agent');
    });

    it('should create a new User in one and not the previous', function() {
      // Create User in new tenant
      var randomUser = Math.floor((Math.random() * 1000) + 1);
      var newTenantEmail = 'NewTenantUser' + randomUser + '@mailinator.com';
      shared.createBtn.click();
      users.emailFormField.sendKeys(newTenantEmail + '\t');
      users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
      users.platformRoleFormDropdownOptions.get(1).click();

      users.firstNameFormField.sendKeys('New Tenant');
      users.lastNameFormField.sendKeys('User');
      users.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(2);

      // Verify user is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if user email in table matches newly added user
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(3)')).getText()).not.toBe(newTenantEmail);
        }
      });

      // Create user in previous tenant
      randomUser = Math.floor((Math.random() * 1000) + 1);
      var previousTenantEmail = 'PreviousTenantUser' + randomUser + '@mailinator.com';
      shared.createBtn.click();
      users.emailFormField.sendKeys(previousTenantEmail + '\t');
      users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
      users.platformRoleFormDropdownOptions.get(1).click();

      users.firstNameFormField.sendKeys('Previous Tenant');
      users.lastNameFormField.sendKeys('User');
      users.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Verify user is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(2);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if user email in table matches newly added user
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(3)')).getText()).not.toBe(previousTenantEmail);
        }
      });
    });

    describe('with mutual users', function() {
      beforeAll(function() {
        shared.createBtn.click();

        // Create new user and add to both tenants
        var randomUser = Math.floor((Math.random() * 1000) + 1);
        mutualUserFirstName = 'Mutual ' + randomUser;
        mutualUserEmail = 'MutualUser' + randomUser + '@mailinator.com';

        shared.createBtn.click();
        users.emailFormField.sendKeys(mutualUserEmail + '\t');
        users.tenantRoleFormDropdownOptions.get(1).click();
        users.platformRoleFormDropdownOptions.get(1).click();

        users.firstNameFormField.sendKeys('Mutual ' + randomUser);
        users.lastNameFormField.sendKeys('User ' + randomUser);
        users.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Add new user to Default tenant
          tenants.selectTenant(defaultTenantName);

          shared.createBtn.click();
          users.emailFormField.sendKeys(mutualUserEmail + '\t');
          users.tenantRoleFormDropdownOptions.get(1).click();
          users.submitFormBtn.click().then(function() {
            expect(shared.successMessage.isDisplayed()).toBeTruthy();

            // Switch back to new tenant
            tenants.selectTenant(newTenantName);
          });
        });
      });

      it('should update details for both tenants', function() {
        // Select new user in new tenant
        shared.searchField.sendKeys(mutualUserEmail);
        shared.firstTableRow.click();

        users.firstNameFormField.sendKeys('Edit');
        users.lastNameFormField.sendKeys('Edit');
        users.externalIdFormField.sendKeys('12345');

        users.submitFormBtn.click().then(function() {
          shared.waitForSuccess();
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Verify changes to user in Default tenant
          tenants.selectTenant(defaultTenantName);
          shared.searchField.sendKeys(mutualUserEmail);
          shared.firstTableRow.click();

          expect(users.firstNameFormField.getAttribute('value')).toContain('Edit');
          expect(users.lastNameFormField.getAttribute('value')).toContain('Edit');
          expect(users.externalIdFormField.getAttribute('value')).toBe('12345');

          // Switch back to new tenant
          tenants.selectTenant(newTenantName);
        });
      });

      xit('should not update Role details for both tenants', function() {
        // TODO Bug unable to edit user role before saving invitation

        // Select new user in new tenant
        shared.searchField.sendKeys(mutualUserEmail);
        shared.firstTableRow.click();

        // Change user role
        users.tenantRoleFormDropdownOptions.get(3).click();


        users.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          tenants.selectTenant(defaultTenantName);

          shared.searchField.sendKeys(mutualUserEmail);
          shared.firstTableRow.click();

          expect(users.tenantRoleFormDropdown.getAttribute('value')).not.toBe(3);

          // Switch back to new tenant
          tenants.selectTenant(newTenantName);
        });
      });

      it('should not update Skills and Groups for both tenants', function() {
        // Select new user in default tenant
        tenants.selectTenant(defaultTenantName);
        shared.searchField.sendKeys(mutualUserEmail);
        shared.firstTableRow.click();

        // Add user groups and skills
        users.addGroupSearch.sendKeys('New Default Tenant Group');
        users.addGroupBtn.click();
        users.addSkillSearch.sendKeys('New Default Tenant Skill');
        users.addSkillBtn.click();

        // Verify changes to user role were not made to the new tenant
        tenants.selectTenant(newTenantName);
        shared.searchField.sendKeys(mutualUserEmail);
        shared.firstTableRow.click();

        expect(users.userGroups.count()).toBe(1); // everyone group
        expect(users.userSkills.count()).toBe(0);
        expect(users.noUserSkillsMessage.isDisplayed()).toBeTruthy();
      });
    });
  });

  describe('Skills Management page', function() {
    beforeAll(function() {
      browser.get(shared.skillsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Skills for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    it('should create a new Skill in one and not the previous', function() {
      // Create skill in new tenant
      var newTenantSkill = 'New Tenant Skill ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      skills.nameFormField.sendKeys(newTenantSkill);
      skills.proficiencyFormCheckbox.click();
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(shared.tableElements.count()).toBe(1);

        // Verify skill is not added in previous tenant
        tenants.selectTenant(defaultTenantName);
        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            // Check if skill name in table matches newly added skill
            expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantSkill);
          }
        });

        // Create skill in previous tenant
        var previousTenantSkill = 'Previous Tenant Skill ' + Math.floor((Math.random() * 1000) + 1);
        shared.createBtn.click();
        skills.nameFormField.sendKeys(previousTenantSkill);
        skills.proficiencyFormCheckbox.click();
        shared.submitFormBtn.click().then(function() {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Verify skill is not added in new tenant
          tenants.selectTenant(newTenantName);
          expect(shared.tableElements.count()).toBe(1);
          shared.tableElements.then(function(rows) {
            for (var i = 1; i <= rows.length; ++i) {
              // Check if skill name in table matches newly added skill
              expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantSkill);
            }
          });
        });
      });
    });
  });

  // TODO TITAN2-4505
  describe('Groups Management page', function() {
    beforeAll(function() {
      browser.get(shared.groupsPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should display the correct Groups for the current tenant', function() {
      // everyone group added to the new tenant by default
      expect(elementCount).toBe(1);
      expect(shared.firstTableRow.getText()).toContain('everyone');

      // One member by default
      /* TODO
      expect(shared.firstTableRow.getText()).toContain('1');
      shared.firstTableRow.click();
      expect(groups.groupMembersRows.count()).toBe(1);
      expect(groups.groupMembersRows.get(0).getText()).toBe(params.login.firstName + ' ' + params.login.lastName);
      */
    });

    xit('should create a new Group in one and not the previous', function() {
      // Create Group in new tenant
      var newTenantGroup = 'New Tenant Group ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      groups.nameFormField.sendKeys(newTenantGroup);
      groups.descriptionFormField.sendKeys('Group Description');
      shared.submitFormBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(shared.tableElements.count()).toBe(2);

        // Verify group is not added in previous tenant
        tenants.selectTenant(defaultTenantName);
        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            // Check if group name in table matches newly added group
            expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantGroup);
          }
        });

        // Create group in previous tenant
        var previousTenantGroup = 'Previous Tenant Group ' + Math.floor((Math.random() * 1000) + 1);
        shared.createBtn.click();
        groups.nameFormField.sendKeys(previousTenantGroup);
        groups.descriptionFormField.sendKeys('Group Description');
        shared.submitFormBtn.click();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // Verify group is not added in new tenant
        tenants.selectTenant(newTenantName);
        expect(shared.tableElements.count()).toBe(2);
        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            // Check if group name in table matches newly added group
            expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantGroup);
          }
        });
      });
    });
  });

  describe('Roles Management page', function() {
    beforeAll(function() {
      browser.get(shared.rolesPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should display the correct Roles for the current tenant', function() {
      expect(elementCount).toBe(3);

      expect(shared.tableRows.get(0).getText()).toContain('Administrator tenant administrator 33');
      expect(shared.tableRows.get(1).getText()).toContain('Agent tenant agent 0');
      expect(shared.tableRows.get(2).getText()).toContain('Supervisor tenant supervisor 4');
    });

    it('should create a new Role in one and not the previous', function() {
      // Create Role in new tenant
      var newTenantRole = 'New Tenant Role ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      roles.nameFormField.sendKeys(newTenantRole);
      roles.descriptionFormField.sendKeys('Role Description');
      roles.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(4);

      // Verify role is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if role name in table matches newly added role
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantRole);
        }
      });

      // Create role in previous tenant
      var previousTenantRole = 'Previous Tenant Role ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      roles.nameFormField.sendKeys(previousTenantRole);
      roles.descriptionFormField.sendKeys('Role Description');
      roles.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Verify role is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(4);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if role name in table matches newly added role
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantRole);
        }
      });
    });
  });

});
