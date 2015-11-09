'use strict';

var RolePage = function() {
  this.creatingRoleHeader = element(by.id('role-details-create-header'));
  this.nameFormField = element(by.model('selectedTenantRole.name'));
  this.descriptionFormField = element(by.model('selectedTenantRole.description'));

  this.rolePane = element(by.id('role-pane'));
  this.submitFormBtn = element(by.id('submit-details-btn'));
  this.cancelFormBtn = element(by.id('cancel-details-btn'));

  this.nameHeader = element(by.id('role-details-name-header'));
  this.detailsPermissionCount = element(by.css('.count'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.permissionsColumn = 'td:nth-child(4)';

  this.nameRequiredError = element.all(by.css('.lo-error'));

  this.permissionsSection = element(by.css('role-permissions'));
  this.noPermissions = this.permissionsSection.element(by.id('no-role-permissions-msg'));
  this.permissionsDropdown = this.permissionsSection.element(by.id('addPermission'));
  this.dropdownPermissions = this.permissionsSection.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.rolePermissions = this.permissionsSection.all(by.repeater('permission in rolePermissions'));
  this.permissionAddBtn = this.permissionsSection.element(by.id('add-permission-btn'));
};

module.exports = new RolePage();
