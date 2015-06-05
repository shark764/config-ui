'use strict';

var TenantsPage = function() {
  this.tenantsTable = element(by.css('table'));
  this.tenantForm = element(by.css('form'));
  this.createTenantBtn = element(by.css('.btn'));

  this.nameFormField = element(by.model('tenant.name'));
  this.descriptionFormField = element(by.model('tenant.description'));
  this.statusFormToggle = element(by.model('tenant.status'));
  this.regionFormDropDown = element(by.model('tenant.regionId'));
  this.adminFormDropDown = element(by.model('tenant.adminUserId'));
  this.parentFormDropDown = element(by.model('tenant.parentId'));

  this.tenantElements = element.all(by.repeater('curTenant in tenants'));

  this.tenantRegions;
  // TODO Add remaining Tenants page elements as the design is finalized
};

module.exports = new TenantsPage();
