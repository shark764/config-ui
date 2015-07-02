'use strict';

var MediaPage = function() {
  this.creatingMediaHeader = element(by.css('.details-header'));
  this.sourceFormField = element(by.model('resource.source'));
  this.typeFormDropdown = element(by.model('resource.type'));
  this.audioUrlFormField = element(by.model('resource.properties.url'));
  this.textFormField = element(by.model('resource.properties.text'));

  this.sourceHeader = element(by.css('h1.ng-binding'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));
  this.sourceColumn = 'td:nth-child(2)';
  this.typeColumn = 'td:nth-child(3)';
  this.propertiesColumn = 'td:nth-child(4)';

  this.requiredError = element.all(by.css('.error'));
};

module.exports = new MediaPage();
