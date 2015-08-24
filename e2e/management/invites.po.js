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

  this.checkMailinator = function() {
    $http = angular.injector(["ng"]).get("$http")
    return $http({
      url: 'https://api.mailinator.com/api/inbox',
      data: {
        to: 'titantest',
        token: '358b00e30aa94f62be812de7e4a66ee2'
      },
      type: 'POST',
      dataType: 'json'
    });
  };
};

module.exports = new InvitePage();
