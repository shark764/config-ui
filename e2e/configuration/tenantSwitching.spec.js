'use strict';

describe('When switching tenants', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('./tenants.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    skills = require('../management/skills.po.js'),
    groups = require('../management/groups.po.js'),
    roles = require('../management/roles.po.js'),
    flows = require('../flows/flows.po.js'),
    mediaCollections = require('../flows/mediaCollections.po.js'),
    media = require('../flows/media.po.js'),
    dispatchMappings = require('../flows/dispatchMappings.po.js'),
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

    it('should display the correct User Skills and Groups for the current tenant for mutual users', function() {});

    it('should display the correct User Tenant Status and Role for the current tenant for mutual users', function() {});

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

    it('should update details for mutual users', function() {});

    it('should not update Role details for mutual users', function() {});

    it('should not update Skills and Groups for mutual users', function() {});
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
      elementCount = shared.tableElements.count();
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

      // TODO Bug; error message displayed but group is created normally
      //expect(shared.successMessage.isDisplayed()).toBeTruthy();
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

      // TODO Bug; error message displayed but group is created normally
      // expect(shared.successMessage.isDisplayed()).toBeTruthy();

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
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Roles for the current tenant', function() {
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

  describe('Integration Management page', function() {
    beforeEach(function() {
      browser.get(shared.integrationsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Integrations for the current tenant', function() {
      // TODO Determine which Integrations should be added by default
      expect(elementCount).toBe(1);

      expect(shared.tableRows.get(0).getText()).toBe('twilio Disabled');
    });

    it('should edit details for an Integration in one and not the previous', function() {});
  });

  describe('Flow Management page', function() {
    beforeAll(function() {
      browser.get(shared.flowsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Flows for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    it('should create a new Flow in one and not the previous', function() {
      // Create Flow in new tenant
      var randomFlow = Math.floor((Math.random() * 1000) + 1);
      var newTenantFlow = 'New Tenant Flow ' + randomFlow;
      shared.createBtn.click();
      flows.nameFormField.sendKeys(newTenantFlow);
      flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(1);

      // Verify flow is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if flow name in table matches newly added flow
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantFlow);
        }
      });

      // Create flow in previous tenant
      randomFlow = Math.floor((Math.random() * 1000) + 1);
      var previousTenantFlow = 'Previous Tenant Flow ' + randomFlow;
      shared.createBtn.click();
      flows.nameFormField.sendKeys(previousTenantFlow);
      flows.typeFormDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Verify flow is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(1);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if flow name in table matches newly added flow
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantFlow);
        }
      });
    });
  });

  describe('Media Collection Management page', function() {
    beforeAll(function() {
      browser.get(shared.mediaCollectionsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Media Collections for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    it('should create a new Media Collection in one and not the previous', function() {
      // Create MediaCollection in new tenant
      var newTenantMediaCollection = 'New Tenant MediaCollection ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      mediaCollections.nameFormField.sendKeys(newTenantMediaCollection);
      mediaCollections.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(1);

      // Verify mediaCollection is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if mediaCollection name in table matches newly added mediaCollection
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantMediaCollection);
        }
      });

      // Create mediaCollection in previous tenant
      var previousTenantMediaCollection = 'Previous Tenant MediaCollection ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      mediaCollections.nameFormField.sendKeys(previousTenantMediaCollection);
      mediaCollections.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Verify mediaCollection is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(1);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if mediaCollection name in table matches newly added mediaCollection
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantMediaCollection);
        }
      });
    });
  });

  describe('Media Management page', function() {
    beforeAll(function() {
      browser.get(shared.mediaPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Media for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    it('should create a new Media in one and not the previous', function() {
      // Create Media in new tenant
      var newTenantMedia = 'New Tenant Media ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      media.nameFormField.sendKeys(newTenantMedia);
      media.sourceFormField.sendKeys('http://www.example.com/');
      media.typeFormDropdown.all(by.css('option')).get(1).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(1);

      // Verify media is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if media name in table matches newly added media
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantMedia);
        }
      });

      // Create media in previous tenant
      var previousTenantMedia = 'Previous Tenant Media ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      media.nameFormField.sendKeys(previousTenantMedia);
      media.sourceFormField.sendKeys('http://www.example.com/');
      media.typeFormDropdown.all(by.css('option')).get(1).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Verify media is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(1);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if media name in table matches newly added media
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantMedia);
        }
      });
    });
  });

  describe('Dispatch Mapping page', function() {
    beforeAll(function() {
      browser.get(shared.dispatchMappingsPageUrl);
      elementCount = shared.tableElements.count();
    });

    it('should display the correct Dispatch Mappings for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    it('should create a new Dispatch Mapping in one and not the previous', function() {
      // Create DispatchMapping in new tenant
      var newTenantDispatchMapping = 'New Tenant DispatchMapping ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      dispatchMappings.nameFormField.sendKeys(newTenantDispatchMapping);
      dispatchMappings.mappingOptions.get(1).click();
      dispatchMappings.phoneFormField.sendKeys('15062345678');
      dispatchMappings.flowDropdown.all(by.css('option')).get(0).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(1);

      // Verify dispatchMapping is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if dispatchMapping name in table matches newly added dispatchMapping
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantDispatchMapping);
        }
      });

      // Create dispatchMapping in previous tenant
      var previousTenantDispatchMapping = 'Previous Tenant DispatchMapping ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      dispatchMappings.nameFormField.sendKeys(previousTenantDispatchMapping);
      dispatchMappings.mappingOptions.get(1).click();
      dispatchMappings.phoneFormField.sendKeys('15062345678');
      dispatchMappings.flowDropdown.all(by.css('option')).get(0).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Verify dispatchMapping is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(1);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if dispatchMapping name in table matches newly added dispatchMapping
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantDispatchMapping);
        }
      });
    });
  });

});
