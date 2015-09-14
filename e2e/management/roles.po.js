'use strict';

var RolesPage = function() {
  this.creatingRoleHeader = element(by.css('h1.ng-binding:nth-child(2)'));
  this.nameFormField = element(by.model('selectedTenantRole.name'));
  this.descriptionFormField = element(by.model('selectedTenantRole.description'));

  this.submitFormBtn = element(by.id('submit-details-btn'));
  this.cancelFormBtn = element(by.id('cancel-details-btn'));

  this.nameHeader = element(by.id('role-details-name-header'));
  this.detailsPermissionCount = element(by.css('.count'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.permissionsColumn = 'td:nth-child(4)';

  this.nameRequiredError = element.all(by.css('.lo-error'));

  this.permissionsSection = element(by.css('role-permissions'));
  this.noPermissions = this.permissionsSection.element(by.css('p'));
  this.permissions = this.permissionsSection.all(by.repeater('permission in rolePermissions'));
};

module.exports = new RolesPage();
