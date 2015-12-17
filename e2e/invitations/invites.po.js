'use strict';
var request = require('request'),
  params = browser.params;

var InvitePage = function() {
  this.emailFormField = element(by.name('email'));
  this.tenantFormField = element(by.name('tenantId'));
  this.submitInviteBtn = element(by.css('.btn'));
  this.errors = element.all(by.css('.lo-error'));

  // Accept Page details
  this.acceptForm = element(by.id('invite-accept'));
  this.logo = this.acceptForm.element(by.css('img'));
  this.alertMessage = this.acceptForm.element(by.css('.lo-alert'));
  this.userEmail = this.acceptForm.element(by.id('user-details-email'));
  this.passwordFormField = this.acceptForm.element(by.model('user.password'));
  this.passwordPolicy = element(by.id('password-policy'));
  this.passwordPolicyText = 'Password must have at least 1 alphabetic character, 1 number, and 1 special character (! # $ % - _ = + < > .)';
  this.firstNameFormField = this.acceptForm.element(by.model('user.firstName'));
  this.lastNameFormField = this.acceptForm.element(by.model('user.lastName'));
  this.externalIdFormField = this.acceptForm.element(by.model('user.externalId'));
  this.submitFormBtn = this.acceptForm.element(by.id('submit-invite-accept'));

  this.copyrightLabel = this.acceptForm.element(by.css('p.copyright:nth-child(3)'));
  this.signupLegalLabel = this.acceptForm.element(by.css('p.copyright:nth-child(4)'));

  this.copyrightText = 'Copyright © 2015 LiveOps, Inc. All rights reserved.';
  this.legalText = 'Access to this site requires separate permission from LiveOps. This site contains confidential information, and may also contain content and enable interaction with users from third-party sites subject to different terms that are outside of LiveOps control. By using or accessing this site, you have agreed to the Terms of Service as outlined in the Beta Service Agreement ("Agreement"). A copy of this Agreement is available from your LiveOps contact.';

  // Confirm cancel invitation
  this.confirmModal = element(by.css('.confirm'));
  this.confirmMessage = this.confirmModal.element(by.css('p'));
  this.confirmOK = this.confirmModal.element(by.id('modal-ok'));
  this.confirmCancel = this.confirmModal.element(by.id('modal-cancel'));

  this.goToInvitationAcceptPage = function() {
    var jar = request.jar();
    var req = request.defaults({
      jar: jar
    });

    var newestMessage;
    var newestMessageContents;

    browser.sleep(2000).then(function() {
      req.get('https://api.mailinator.com/api/inbox?to=titantest&token=' + params.mailinator.token, '', function(error, response, body) {
        if (body) {
          newestMessage = JSON.parse(body).messages[JSON.parse(body).messages.length - 1];

          browser.sleep(2000).then(function() {
            req.get('https://api.mailinator.com/api/email?id=' + newestMessage.id + '&token=' + params.mailinator.token, '', function(error, response, body) {
              if (body) {
                newestMessageContents = JSON.parse(body).data.parts[0].body;
                browser.get(newestMessageContents.split('Log in automatically by clicking ')[1].split('\n')[0]);
              } else {
                console.log('Mailinator email error: ' + error);
              }
            });
          });
        } else {
          console.log('Mailinator inbox response: ' + response);
          console.log('Mailinator inbox error: ' + error);
        }
      });
    });
  };
};

module.exports = new InvitePage();
