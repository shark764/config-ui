'use strict';

var ProfilePage = function() {
  this.profileGreeting = element(by.css('h2'));

  this.firstNameFormField = element(by.model('tenantUser.$user.firstName'));
  this.lastNameFormField = element(by.model('tenantUser.$user.lastName'));
  this.userEmail = element(by.model('tenantUser.$user.email'));
  this.userProfilePic = element(by.id('user-profile-pic'));
  this.resetPasswordButton = element(by.id('reset-password-button'));
  this.passwordFormField = element(by.model('tenantUser.$user.password'));

  this.errors = element.all(by.css('.lo-error'));

  this.updateProfileBtn = element(by.buttonText('Update'));

  this.userSkillsSectionHeader = element(by.id('user-skills-header'));
  this.userSkills = element.all(by.repeater('userSkill in tenantUser.$skills | orderBy:\'name\''));
  this.noUserSkillsMessage = element(by.id('no-user-skills'));

  this.userGroupsSectionHeader = element(by.id('user-groups-header'));
  this.userGroups = element.all(by.repeater('userGroup in tenantUser.$groups'));
  this.noUserGroupsMessage = element(by.id('no-user-groups'));

  this.waitForUserSkills = function() {
    browser.driver.wait(function() {
      return element.all(by.repeater('userSkill in tenantUser.$skills | orderBy:\'name\'')).count().then(function(skillsCount) {
        return element(by.id('no-user-skills')).isPresent().then(function(noSkillsMessageDisplayed) {
          return noSkillsMessageDisplayed || skillsCount;
        });
      });
    }, 5000);
  };
};

module.exports = new ProfilePage();
