'use strict';

var ProfilePage = function() {
  this.profileGreeting = element(by.css('h2'));

  this.firstNameFormField = element(by.model('user.firstName'));
  this.lastNameFormField = element(by.model('user.lastName'));
  this.userEmail = element(by.id('user-profile-email'));
  this.userProfilePic = element(by.id('user-profile-pic'));
  this.resetPasswordButton = element(by.id('reset-password-button'));
  this.passwordFormField = element(by.model('user.password'));

  this.errors = element.all(by.css('.lo-error'));

  this.updateProfileBtn = element(by.buttonText('Update'));

  this.userSkillsSectionHeader = element(by.id('user-skills-header'));
  this.userSkills = element.all(by.repeater('userSkill in userSkills | orderBy:\'name\''));
  this.noUserSkillsMessage = element(by.id('no-user-skills'));

  this.userGroupsSectionHeader = element(by.id('user-groups-header'));
  this.userGroups = element.all(by.repeater('userGroup in userGroups'));
  this.noUserGroupsMessage = element(by.id('no-user-groups'));
};

module.exports = new ProfilePage();
