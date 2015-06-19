'use strict';

var TenantsPage = function() {
  this.tenantsTable = element(by.css('table'));
  this.tenantForm = element(by.css('form'));
  this.createTenantBtn = element(by.css('input.btn'));

  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.statusFormToggle = element(by.model('tenant.status'));
  this.region = element(by.css('div.ng-binding:nth-child(5)'));
  this.adminFormDropDown = element(by.model('tenant.adminUserId'));

  this.tenantElements = element.all(by.repeater('curTenant in tenants'));

  this.tenantRegions;
  // TODO Add remaining Tenants page elements as the design is finalized
};

module.exports = new TenantsPage();
