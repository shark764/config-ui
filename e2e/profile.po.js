'use strict';

var ProfilePage = function() {
  this.profileGreeting = element(by.css('h3'));

  this.firstNameFormField = element(by.model('user.firstName'));
  this.lastNameFormField = element(by.model('user.lastName'));
  this.displayNameFormField = element(by.model('user.displayName'));
  this.userEmail = element(by.css('div.ng-binding'));

  this.errors = element.all(by.css('.error'));

  this.updateProfileBtn = element(by.css('.btn'));
};

module.exports = new ProfilePage();
