'use strict';

describe('The role view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    role = require('./role.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    roleCount,
    randomRole,
    newRoleName,
    addedMember;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.rolePageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });


  it('should include role page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(role.rolePane.isDisplayed()).toBeFalsy(); //hide right panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy(); // no bulk actions
    expect(shared.createBtn.isDisplayed()).toBeTruthy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Role Management');
  });

  it('should display default roles', function() {
    expect(shared.tableElements.count()).not.toBeLessThan(3);

    shared.searchField.sendKeys('Administrator');
    expect(shared.tableElements.count()).toBe(1);
    expect(shared.firstTableRow.getText()).toContain('Administrator');
    expect(shared.firstTableRow.getText()).toContain('tenant administrator');
    expect(shared.firstTableRow.getText()).toContain('42');

    shared.searchField.clear();
    shared.searchField.sendKeys('Agent');
    expect(shared.tableElements.count()).toBe(1);
    expect(shared.firstTableRow.getText()).toContain('Agent');
    expect(shared.firstTableRow.getText()).toContain('tenant agent');
    expect(shared.firstTableRow.getText()).toContain('6');

    shared.searchField.clear();
    shared.searchField.sendKeys('Supervisor');
    expect(shared.tableElements.count()).toBe(1);
    expect(shared.firstTableRow.getText()).toContain('Supervisor');
    expect(shared.firstTableRow.getText()).toContain('tenant supervisor');
    expect(shared.firstTableRow.getText()).toContain('13');
  });

  it('should include valid Role fields when creating a new Role', function() {
    shared.createBtn.click();
    expect(role.creatingRoleHeader.getText()).toBe('Creating new role');
    expect(role.nameFormField.isDisplayed()).toBeTruthy();
    expect(role.descriptionFormField.isDisplayed()).toBeTruthy();

    // No permissions selected by default
    expect(role.detailsPermissionCount.getText()).toBe('(0)');
    expect(role.noPermissions.isDisplayed()).toBeTruthy();
    expect(role.noPermissions.getText()).toBe('This role has no permissions assigned to it.');

    expect(role.permissionsDropdown.isDisplayed()).toBeTruthy();
    expect(role.permissionAddBtn.isDisplayed()).toBeTruthy();
  });

  it('should successfully create new Role without permissions', function() {
    randomRole = Math.floor((Math.random() * 1000) + 1);
    newRoleName = 'Role Name ' + randomRole;
    shared.createBtn.click();

    // Edit fields
    role.nameFormField.sendKeys(newRoleName);
    role.descriptionFormField.sendKeys('Role Description');
    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
      expect(role.noPermissions.isDisplayed()).toBeTruthy();

      // Confirm role is displayed in role list
      shared.searchField.sendKeys(newRoleName);
      expect(shared.tableElements.count()).not.toBeLessThan(1);

      // No permissions
      expect(role.detailsPermissionCount.getText()).toBe('(0)');
      expect(role.noPermissions.getText()).toBe('This role has no permissions assigned to it.');
    });
  });

  it('should successfully create new Role with permissions', function() {
    randomRole = Math.floor((Math.random() * 1000) + 1);
    newRoleName = 'Role Name ' + randomRole;
    shared.createBtn.click();

    // Edit fields
    role.nameFormField.sendKeys(newRoleName);
    role.descriptionFormField.sendKeys('Role Description');
    role.permissionsDropdown.click();
    role.dropdownPermissions.get(0).click();
    role.permissionAddBtn.click();

    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      // Confirm role is displayed in role list
      shared.searchField.sendKeys(newRoleName);
      expect(shared.tableElements.count()).not.toBeLessThan(1);

      expect(role.detailsPermissionCount.getText()).toBe('(1)');
      expect(role.noPermissions.isDisplayed()).toBeFalsy();
      expect(role.rolePermissions.count()).toBe(1);
    });
  });

  it('should require field input when creating a new Role', function() {
    roleCount = shared.tableElements.count();
    shared.createBtn.click();

    // Submit button is disabled
    expect(role.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    role.submitFormBtn.click();

    // New Role is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(roleCount);
  });

  it('should require name when creating a new Role', function() {
    roleCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    role.descriptionFormField.sendKeys('Role Description');

    // Submit button is still disabled
    expect(role.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    role.submitFormBtn.click();

    // New Role is not saved
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(roleCount);

    // Touch name input field
    role.nameFormField.click();
    role.descriptionFormField.click();

    // Submit button is still disabled
    expect(role.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    // Error messages displayed
    expect(role.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(role.nameRequiredError.get(0).getText()).toBe('Please enter a name');

    // New Role is not saved
    expect(shared.tableElements.count()).toBe(roleCount);
  });

  it('should require unique name when creating a new Role', function() {
    roleCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    role.nameFormField.sendKeys('Agent');

    role.submitFormBtn.click().then(function() {
      shared.waitForError();

      // New Role is not saved
      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(shared.tableElements.count()).toBe(roleCount);

      // Error messages displayed
      expect(role.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
      expect(role.nameRequiredError.get(0).getText()).toBe('resource with the same value already exists in the system');
    });
  });

  it('should successfully create new Role without description', function() {
    roleCount = shared.tableElements.count();
    randomRole = Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();

    // Edit fields
    role.nameFormField.sendKeys('Role Name ' + randomRole);

    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
      expect(shared.tableElements.count()).toBeGreaterThan(roleCount);
    });
  });

  it('should clear fields on Cancel', function() {
    roleCount = shared.tableElements.count();
    shared.createBtn.click();

    // Edit fields
    role.nameFormField.sendKeys('Role Name');
    role.descriptionFormField.sendKeys('Role Description');
    role.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    // New role is not created
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(shared.tableElements.count()).toBe(roleCount);

    // Form fields are cleared and reset to default
    expect(role.nameFormField.getAttribute('value')).toBe('');
    expect(role.descriptionFormField.getAttribute('value')).toBe('');
  });

  it('should display role details when selected from table', function() {
    // Select first role from table
    shared.firstTableRow.click();

    // Verify role details in table matches populated field
    expect(role.nameHeader.getText()).toContain(shared.firstTableRow.element(by.css(role.nameColumn)).getText());
    expect(shared.firstTableRow.element(by.css(role.nameColumn)).getText()).toBe(role.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.element(by.css(role.descriptionColumn)).getText()).toBe(role.descriptionFormField.getAttribute('value'));
    expect(role.detailsPermissionCount.getText()).toContain(shared.firstTableRow.element(by.css(role.permissionsColumn)).getText());

    // Change selected role and ensure details are updated
    shared.tableElements.count().then(function(curRoleCount) {
      if (curRoleCount > 1) {
        shared.secondTableRow.click();
        expect(role.nameHeader.getText()).toContain(shared.secondTableRow.element(by.css(role.nameColumn)).getText());
        expect(shared.secondTableRow.element(by.css(role.nameColumn)).getText()).toBe(role.nameFormField.getAttribute('value'));
        expect(shared.secondTableRow.element(by.css(role.descriptionColumn)).getText()).toBe(role.descriptionFormField.getAttribute('value'));
        expect(role.detailsPermissionCount.getText()).toContain(shared.secondTableRow.element(by.css(role.permissionsColumn)).getText());
      };
    });
  });

  it('should include valid Role fields when editing an existing Role', function() {
    shared.searchField.sendKeys('Role'); // prevent uneditable Roles from being selected
    shared.firstTableRow.click();
    expect(role.nameHeader.isDisplayed()).toBeTruthy();
    expect(role.nameFormField.isDisplayed()).toBeTruthy();
    expect(role.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(role.detailsPermissionCount.isDisplayed()).toBeTruthy();

    // Permission fields
    expect(role.permissionsDropdown.isDisplayed()).toBeTruthy();
    expect(role.permissionAddBtn.isDisplayed()).toBeTruthy();
    shared.firstTableRow.element(by.css(role.permissionsColumn)).getText().then(function(permissionCount) {
      if (permissionCount > 0) {
        expect(role.rolePermissions.count()).toBe(parseInt(permissionCount));
        expect(role.noPermissions.isDisplayed()).toBeFalsy();
      } else {
        expect(role.noPermissions.isDisplayed()).toBeTruthy();
        expect(role.noPermissions.getText()).toBe('This role has no permissions assigned to it.');
      }
    });
  });

  it('should reset Role fields after editing and selecting Cancel', function() {
    shared.searchField.sendKeys('Role'); // prevent uneditable Roles from being selected
    shared.firstTableRow.click();

    var originalName = role.nameFormField.getAttribute('value');
    var originalDescription = role.descriptionFormField.getAttribute('value');
    var originalPermissionCount = role.rolePermissions.count();

    // Edit fields
    role.nameFormField.sendKeys('Edit');
    role.descriptionFormField.sendKeys('Edit');

    role.cancelFormBtn.click();

    // Warning message is displayed
    shared.waitForAlert();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    expect(alertDialog.dismiss).toBeDefined();
    alertDialog.accept();

    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Fields reset to original values
    expect(role.nameFormField.getAttribute('value')).toBe(originalName);
    expect(role.descriptionFormField.getAttribute('value')).toBe(originalDescription);
  });

  it('should allow the Role fields to be updated', function() {
    shared.searchField.sendKeys('Role'); // prevent uneditable Roles from being selected
    shared.firstTableRow.click();

    // Edit fields
    role.nameFormField.sendKeys('Edit');
    role.descriptionFormField.sendKeys('Edit');

    var editedName = role.nameFormField.getAttribute('value');
    var editedDescription = role.descriptionFormField.getAttribute('value');
    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();

      // Changes persist
      browser.refresh();
      expect(role.nameFormField.getAttribute('value')).toBe(editedName);
      expect(role.descriptionFormField.getAttribute('value')).toBe(editedDescription);
    });
  });

  it('should allow Role permissions to be added', function() {
    shared.searchField.sendKeys('Role'); // prevent uneditable Roles from being selected
    shared.firstTableRow.click();

    role.rolePermissions.count().then(function(originalPermissionCount) {
      role.permissionsDropdown.click();
      role.dropdownPermissions.get(0).click();
      role.permissionAddBtn.click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();
        expect(role.rolePermissions.count()).toBe(originalPermissionCount + 1);
      });
    });
  });

  it('should allow Role permissions to be removed', function() {
    shared.searchField.sendKeys('Role'); // prevent uneditable Roles from being selected
    shared.firstTableRow.click();
    role.rolePermissions.count().then(function(originalPermissionCount) {
      role.rolePermissions.get(0).element(by.css('.fa')).click().then(function() {
        shared.waitForSuccess();
        shared.successMessage.click();
        expect(role.rolePermissions.count()).toBe(originalPermissionCount - 1);
      });
    });
  });

  it('should require name field when editing a Role', function() {
    shared.searchField.sendKeys('Role'); // prevent uneditable Roles from being selected
    shared.firstTableRow.click();

    // Edit fields
    role.nameFormField.clear();
    role.descriptionFormField.click();

    // Submit button is still disabled
    expect(role.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    role.submitFormBtn.click();

    // Error messages displayed
    expect(role.nameRequiredError.get(0).isDisplayed()).toBeTruthy();
    expect(role.nameRequiredError.get(0).getText()).toBe('Please enter a name');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should not require description field when editing a Role', function() {
    shared.searchField.sendKeys('Role'); // prevent uneditable Roles from being selected
    shared.firstTableRow.click();

    // Edit fields
    role.descriptionFormField.sendKeys('not required');
    role.descriptionFormField.clear();

    role.submitFormBtn.click().then(function() {
      shared.waitForSuccess();
      shared.successMessage.click();
      expect(role.descriptionFormField.getAttribute('value')).toBe('');
    });
  });

  it('should not allow updates to Administrator role', function() {
    shared.searchField.sendKeys('Administrator');
    shared.firstTableRow.click();

    expect(role.nameFormField.getAttribute('disabled')).toBeTruthy();
    expect(role.descriptionFormField.getAttribute('disabled')).toBeTruthy();
    expect(role.permissionsDropdown.isDisplayed()).toBeFalsy();
    expect(role.permissionAddBtn.isDisplayed()).toBeFalsy();

    expect(role.nameFormField.getAttribute('value')).toBe('Administrator');
    expect(role.descriptionFormField.getAttribute('value')).toBe('tenant administrator');
    expect(role.rolePermissions.count()).toBe(42);
    expect(role.detailsPermissionCount.getText()).toBe('(42)');
  });

  it('should not allow updates to Agent role', function() {
    shared.searchField.sendKeys('Agent');
    shared.firstTableRow.click();

    expect(role.nameFormField.getAttribute('disabled')).toBeTruthy();
    expect(role.descriptionFormField.getAttribute('disabled')).toBeTruthy();
    expect(role.permissionsDropdown.isDisplayed()).toBeFalsy();
    expect(role.permissionAddBtn.isDisplayed()).toBeFalsy();

    expect(role.nameFormField.getAttribute('value')).toBe('Agent');
    expect(role.descriptionFormField.getAttribute('value')).toBe('tenant agent');
    expect(role.rolePermissions.count()).toBe(6);
    expect(role.detailsPermissionCount.getText()).toBe('(6)');
  });

  it('should not allow updates to Supervisor role', function() {
    shared.searchField.sendKeys('Supervisor');
    shared.firstTableRow.click();

    expect(role.nameFormField.getAttribute('disabled')).toBeTruthy();
    expect(role.descriptionFormField.getAttribute('disabled')).toBeTruthy();
    expect(role.permissionsDropdown.isDisplayed()).toBeFalsy();
    expect(role.permissionAddBtn.isDisplayed()).toBeFalsy();

    expect(role.nameFormField.getAttribute('value')).toBe('Supervisor');
    expect(role.descriptionFormField.getAttribute('value')).toBe('tenant supervisor');
    expect(role.rolePermissions.count()).toBe(13);
    expect(role.detailsPermissionCount.getText()).toBe('(13)');
  });

  it('should list all roles on the User Management page', function() {
    // Get list of Roles
    var roleNameList = [];
    shared.tableElements.each(function(roleElement, index) {
      if (index < 10) {
        roleElement.element(by.css('td:nth-child(2)')).getText().then(function(roleName) {
          if (roleName !== 'Administrator' && roleName !== 'Agent' && roleName !== 'Supervisor') {
            roleNameList.push(roleName);
          }
        });
      }
    }).then(function() {
      browser.get(shared.usersPageUrl);

      shared.createBtn.click();
      users.tenantRoleFormDropdown.click();

      // Defaults are displayed at the top of the list
      expect(users.tenantRoleFormDropdownOptions.get(1).getText()).toBe('Administrator');
      expect(users.tenantRoleFormDropdownOptions.get(2).getText()).toBe('Supervisor');
      expect(users.tenantRoleFormDropdownOptions.get(3).getText()).toBe('Agent');

      // Role list on Users page should contain the same Roles
      for (var i = 0; i < roleNameList.length; i++) {
        expect(users.tenantRoleFormDropdown.element(by.cssContainingText('option', roleNameList[i]))).toBeTruthy();
      }
    });
  });
});
