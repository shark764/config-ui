'use strict';

var ProfilePage = function() {
  this.profileGreeting = element(by.css('h2'));

  this.firstNameFormField = element(by.model('user.firstName'));
  this.lastNameFormField = element(by.model('user.lastName'));
  this.displayNameFormField = element(by.model('user.displayName'));
  this.userEmail = element(by.id('user-profile-email'));
  this.userProfilePic = element(by.id('user-profile-pic'));

  this.errors = element.all(by.css('.error'));

  this.updateProfileBtn = element(by.buttonText('Update'));
};

module.exports = new ProfilePage();
