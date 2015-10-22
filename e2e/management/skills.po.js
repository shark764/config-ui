'use strict';

var SkillsPage = function() {
  this.creatingSkillHeader = element(by.id('skill-details-create-header'));
  this.activeFormToggle = element(by.model('selectedSkill.active'));
  this.nameFormField = element(by.model('selectedSkill.name'));
  this.descriptionFormField = element(by.model('selectedSkill.description'));
  this.proficiencyFormCheckbox = element(by.model('selectedSkill.hasProficiency'));
  this.proficiencySwitch = this.proficiencyFormCheckbox.element(by.css('label:nth-child(2) > input:nth-child(1)'));

  this.nameHeader = element(by.id('skill-details-name-header'));
  this.detailsMemberCount = element(by.css('.count'));

  this.headerRow = this.tablePane.element(by.css('.clone-header tr'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.membersColumn = 'td:nth-child(4)';
  this.proficiencyColumn = 'td:nth-child(5)';
  this.statusColumn = 'td:nth-child(6)';

  this.nameRequiredError = element.all(by.css('.lo-error'));

  this.addMemberArea = element(by.id('usersForm'));
  this.addMemberField = this.addMemberArea.element(by.css('.typeahead-container'));
  this.addMemberDropdownOptions = element.all(by.repeater('item in filtered = (items | filter:filterCriteria | orderBy:orderByFunction)'));
  this.addMemberProficiency = this.addMemberArea.element(by.id('new-user-skill-proficiency .input'));
  this.addMemberBtn = this.addMemberArea.element(by.id('add-member-btn'));

  this.skillMembersLoading = element(by.css('#right-panel loading'));
  this.skillMembersEmpty = element(by.css('#right-panel #empty-members-message'));
  this.skillMembersRows = element.all(by.repeater('user in selectedSkill.fetchSkillUsers()'));
};

module.exports = new SkillsPage();
