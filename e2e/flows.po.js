'use strict';

var FlowPage = function() {
  this.flowTable = element(by.css('.flow-table'));
  this.flowDetails = element(by.id('flow-details-container'));

  this.flowElements = element.all(by.repeater('flow in flows'));

  this.nameFormField = element(by.model('flow.name'));
  this.descriptionFormField = element(by.model('flow.description'));
  this.activeFormToggle = element(by.model('flow.active'));
  this.submitFlowFormBtn = element(by.css('.btn'));

  this.errors = element.all(by.css('.error'));

};

module.exports = new FlowPage();
