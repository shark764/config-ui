'use strict';

var InvitePage = function() {
  this.emailFormField = element(by.name('email'));
  this.tenantFormField = element(by.name('tenantId'));
  this.submitInviteBtn = element(by.css('.btn'));
  this.errors = element.all(by.css('.error'));

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
};

module.exports = new InvitePage();
