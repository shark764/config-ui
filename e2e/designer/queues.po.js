'use strict';

var QueuePage = function() {
  this.nameFormField = element(by.model('queue.name'));
  this.descriptionFormField = element(by.model('queue.description'));
  this.submitQueueFormBtn = element(by.css('.btn'));

  this.errors = element.all(by.css('.error'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.displayNameColumn = 'td:nth-child(3)';
  this.emailColumn = 'td:nth-child(4)';
  this.externalIdColumn = 'td:nth-child(5)';
  this.statusColumn = 'td:nth-child(6)';
};

module.exports = new QueuePage();
