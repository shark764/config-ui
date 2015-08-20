'use strict';

var InvitePage = function() {
  this.mailinatorInbox = 'https://mailinator.com/inbox.jsp?to=titantest';

  this.emailFormField = element(by.name('email'));
  this.tenantFormField = element(by.name('tenantId'));
  this.submitInviteBtn = element(by.css('.btn'));
  this.error = element(by.css('.error'));
};

module.exports = new InvitePage();
