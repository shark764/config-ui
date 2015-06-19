'use strict';

var QueuePage = function() {
  this.queueTable = element(by.css('.queue-table'));
  this.queueDetails = element(by.id('queue-details-container'));

  this.queueElements = element.all(by.repeater('queue in queues'));

  this.nameFormField = element(by.model('queue.name'));
  this.descriptionFormField = element(by.model('queue.description'));
  this.submitQueueFormBtn = element(by.css('.btn'));

  this.errors = element.all(by.css('.error'));

};

module.exports = new QueuePage();
