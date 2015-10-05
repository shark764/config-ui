'use strict';
var shared = require('../shared.po.js');

var TenantsPage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.statusFormToggle = element(by.model('resource.active'));
  this.adminFormDropDown = element(by.model('resource.adminUserId'));
  this.adminDropDownItems = this.adminFormDropDown.all(by.css('option'));

  this.region = element(by.id('tenant-details-region'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.statusColumn = 'td:nth-child(4)';

  this.nameRequiredError = element.all(by.css('.lo-error'));

  this.createTenant = function() {
    var newTenantName = 'Tenant ' + Math.floor((Math.random() * 1000) + 1);
    shared.createBtn.click();
    this.nameFormField.sendKeys(newTenantName);
    shared.submitFormBtn.click();
    return newTenantName;
  };

  this.selectTenant = function(tenantName) {
    shared.tenantsNavDropdown.click();
    var tenantLink = shared.tenantsNavDropdown.element(by.cssContainingText('li', tenantName));
    tenantLink.click();
  };
};

module.exports = new TenantsPage();
