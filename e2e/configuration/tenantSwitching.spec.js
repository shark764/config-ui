'use strict';

describe('When switching tenants', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    skills = require('../management/skills.po.js'),
    groups = require('../management/groups.po.js'),
    params = browser.params,
    elementCount,
    defaultTenantName,
    defaultTenantDropdownItem,
    defaultTenantElementList = [],
    newTenantName;

  /*
  // Get list of Groups
  var groupNameList = [];
  users.groupDropdownItems.each(function(groupElement, index) {
    groupElement.getText().then(function(groupName) {
      groupNameList.push(groupName);
    });
  })
  */

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.tenantsPageUrl);
    shared.tenantsNavDropdown.getText().then(function (selectTenantNav) {
      defaultTenantName = selectTenantNav;
    });

    // Create new Tenant that all tests will use; admin defaults to current user
    //newTenantName = tenants.createTenant();
    newTenantName = 'Tenant 991';
    tenants.selectTenant(newTenantName);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('the selected tenant should be shown as the current tenant in the navigation Tenant Dropdown', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavDropdown.isDisplayed()).toBeTruthy();

    shared.tenantsNavDropdown.click();
    shared.tenantsNavDropdownContents.count().then(function(tenantCount) {
      for (var i = 0; i < tenantCount.length; i++) {
        // Select each tenant in turn and verify that the tenant dropdown shows the tenant as selected
        shared.tenantsNavDropdownContents.get(i).click();

        // Dropdown closes, so get selected tenant name from corresponding row in tenant table
        expect(shared.tableElements.get(i).getText()).toBe(shared.tenantsNavDropdown.getText());
        shared.tenantsNavDropdown.click();
      }
    });
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

    xit('should display the correct User Details for the Current user for the new tenant', function() {
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

    xit('should display the correct Skills and Groups available for the current tenant', function() {
      // There should be no Skills or Groups available for the new tenant
      users.addSkillSearch.click();
      expect(users.skillDropdownItems.count()).toBe(0);

      // Only 'everyone' group is added to the tenant by default
      users.addGroupSearch.click();
      expect(users.groupDropdownItems.count()).toBe(1);
      expect(users.groupDropdownItems.get(0).getText()).toBe('everyone');
    });

    xit('should display the correct Roles available for the current tenant', function() {
      shared.createBtn.click();

      // Only the default roles are displayed
      users.tenantRoleFormDropdown.click();
      expect(users.tenantRoleFormDropdownOptions.count()).toBe(4);
      expect(users.tenantRoleFormDropdownOptions.get(0).getText()).toContain('Select a role');
      expect(users.tenantRoleFormDropdownOptions.get(1).getText()).toBe('Administrator');
      expect(users.tenantRoleFormDropdownOptions.get(2).getText()).toBe('Supervisor');
      expect(users.tenantRoleFormDropdownOptions.get(3).getText()).toBe('Agent');
    });

    xit('should display the correct User Skills and Groups for the current tenant for mutual users', function() {});

    xit('should display the correct User Tenant Status and Role for the current tenant for mutual users', function() {});

    xit('should create a new User in one and not the previous', function() {});

    xit('should update details for mutual users', function() {});

    xit('should not update Role details for mutual users', function() {});

    xit('should not update Skills and Groups for mutual users', function() {});
  });

  describe('Skills Management page', function() {
    beforeAll(function() {
      browser.get(shared.skillsPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should display the correct Skills for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    xit('should create a new Skill in one and not the previous', function() {
      // Create skill in new tenant
      var newTenantSkill = 'New Tenant Skill ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      skills.nameFormField.sendKeys(newTenantSkill);
      skills.proficiencyFormCheckbox.click();
      shared.submitFormBtn.click();

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
      shared.submitFormBtn.click();

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

  describe('Groups Management page', function() {
    beforeAll(function() {
      browser.get(shared.groupsPageUrl);
    });

    it('should display the correct Groups for the current tenant', function() {
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

    it('should create a new Group in one and not the previous', function() {
      // Create Group in new tenant
      var newTenantGroup = 'New Tenant Group ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      groups.nameFormField.sendKeys(newTenantGroup);
      groups.descriptionFormField.sendKeys('Group Description');
      shared.submitFormBtn.click();

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

  describe('Roles Management page', function() {
    beforeAll(function() {
      browser.get(shared.rolesPageUrl);
    });

    it('should display the correct Roles for the current tenant', function() {
      expect(elementCount).toBe(3);

      expect(shared.tableRow.get(0).getText()).toContain('everyone');
      expect(shared.tableRow.get(1).getText()).toContain('everyone');
      expect(shared.tableRow.get(2).getText()).toContain('everyone');

      // One member by default
      /* TODO
      expect(shared.firstTableRow.getText()).toContain('1');
      shared.firstTableRow.click();
      expect(groups.groupMembersRows.count()).toBe(1);
      expect(groups.groupMembersRows.get(0).getText()).toBe(params.login.firstName + ' ' + params.login.lastName);
      */
    });

    xit('should create a new Role in one and not the previous', function() {});
  });

  describe('Integration Management page', function() {
    beforeEach(function() {
      browser.get(shared.integrationsPageUrl);
    });

    xit('should display the correct Integrations for the current tenant', function() {});

    xit('should edit details for an Integration in one and not the previous', function() {});
  });

  describe('Flow Management page', function() {
    beforeEach(function() {
      browser.get(shared.flowsPageUrl);
    });

    xit('should display the correct Flows for the current tenant', function() {});

    xit('should create a new Flow in one and not the previous', function() {});
  });

  describe('Media Collection Management page', function() {
    beforeEach(function() {
      browser.get(shared.mediaCollectionsPageUrl);
    });

    xit('should display the correct Media Collections for the current tenant', function() {});

    xit('should create a new Media Collection in one and not the previous', function() {});
  });

  describe('Media Management page', function() {
    beforeEach(function() {
      browser.get(shared.mediaPageUrl);
    });

    xit('should display the correct Media for the current tenant', function() {});

    xit('should create a new Media in one and not the previous', function() {});
  });

  describe('Dispatch Mapping page', function() {
    beforeEach(function() {
      browser.get(shared.dispatchMappingsPageUrl);
    });

    xit('should display the correct Dispatch Mappings for the current tenant', function() {});

    xit('should create a new Dispatch Mapping in one and not the previous', function() {});
  });

});
