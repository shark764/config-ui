'use strict';

var MediaPage = function() {
  this.creatingMediaHeader = element(by.css('.detail-header-pane'));
  this.nameFormField = element(by.model('resource.name'));
  this.sourceFormField = element(by.model('resource.source'));
  this.typeFormDropdown = element(by.model('resource.type'));
  this.requiredError = element.all(by.css('.error'));
  
  this.sourceHeader = element(by.css('.detail-header-pane h1.ng-binding'));

  this.nameColumn = 'td:nth-child(2)';
  this.sourceColumn = 'td:nth-child(3)';
  this.typeColumn = 'td:nth-child(4)';
  this.propertiesColumn = 'td:nth-child(5)';
};

module.exports = new MediaPage();