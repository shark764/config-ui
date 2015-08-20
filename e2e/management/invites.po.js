'use strict';

var InvitePage = function() {
  this.emailFormField = element(by.name('email'));
  this.tenantFormField = element(by.name('tenantId'));
  this.submitInviteBtn = element(by.css('.btn'));
  this.error = element(by.css('.error'));

  // Mailinator
  this.mailinatorInbox = 'https://mailinator.com/inbox.jsp?to=titantest';
  this.emails = element.all(by.repeater('email in emails'));
  this.firstEmailRow = element(by.css('li.row-fluid:nth-child(1)'));
  this.emailContents = element(by.css('.mailview'));
  this.acceptLink = this.emailContents.element(by.css('a'));
};

module.exports = new InvitePage();
