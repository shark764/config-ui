'use strict';

var FlowVersionPage = function() {
  this.flowVersionTable = element(by.css('.flowVersion-table'));
  this.flowVersionDetails = element(by.id('flowVersion-details-container'));

  this.flowVersionElements = element.all(by.repeater('version in versions'));

  this.nameFormField = element(by.model('version.name'));
  this.descriptionFormField = element(by.model('version.description'));
  this.flowFormField = element(by.model('version.flow'));
  this.submitFlowVersionFormBtn = element(by.css('.btn'));

  this.errors = element.all(by.css('.error'));

};

module.exports = new FlowVersionPage();
