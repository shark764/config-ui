'use strict';

var TenantsPage = function() {
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.statusFormToggle = element(by.model('resource.status'));
  this.adminFormDropDown = element(by.model('resource.adminUserId'));

  this.region = element(by.id('tenant-details-region'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.statusColumn = 'td:nth-child(4)';

  this.nameRequiredError = element.all(by.css('.error'));
};

module.exports = new TenantsPage();
