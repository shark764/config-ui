'use strict';

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
  this.firstNameFormField = this.acceptForm.element(by.model('user.firstName'));
  this.lastNameFormField = this.acceptForm.element(by.model('user.lastName'));
  this.externalIdFormField = this.acceptForm.element(by.model('user.externalId'));
  this.submitFormBtn = this.acceptForm.element(by.id('submit-invite-accept'));

  this.copyrightLabel = this.acceptForm.element(by.css('p.copyright:nth-child(3)'));
  this.signupLegalLabel = this.acceptForm.element(by.css('p.copyright:nth-child(4)'));

  this.copyrightText = 'Copyright © 2015 LiveOps, Inc. All rights reserved.';
  this.legalText = 'Access to this site requires separate permission from LiveOps. This site contains confidential information, and may also contain content and enable interaction with users from third-party sites subject to different terms that are outside of LiveOps control. By using or accessing this site, you have agreed to the Terms of Service as outlined in the Beta Service Agreement ("Agreement"). A copy of this Agreement is available from your LiveOps contact.';
};

module.exports = new InvitePage();
