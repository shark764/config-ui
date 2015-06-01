'use strict';

var TenantsPage = function() {
  this.existingTenantsTable = element(by.css('div.ng-scope:nth-child(1) > table:nth-child(2)'));
  this.createTenantForm = element(by.css('form'));
  this.createTenantBtn = element(by.css('.btn'));

  // TODO Add remaining Tenants page elements as the design is finalized
};

module.exports = new TenantsPage();
