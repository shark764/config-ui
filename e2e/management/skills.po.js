'use strict';

var SkillsPage = function() {
  this.creatingSkillHeader = element(by.id('skill-details-create-header'));
  this.activeFormToggle = element(by.model('selectedSkill.active'));
  this.nameFormField = element(by.model('selectedSkill.name'));
  this.descriptionFormField = element(by.model('selectedSkill.description'));
  this.proficiencyFormCheckbox = element(by.model('selectedSkill.hasProficiency'));
  this.proficiencySwitch = this.proficiencyFormCheckbox.element(by.css('label:nth-child(2) > input:nth-child(1)'));

  this.nameHeader = element(by.id('skill-details-name-header'));
  this.detailsMemberCount = element(by.css('h1.ng-binding > b:nth-child(1)'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.proficiencyColumn = 'td:nth-child(4)';
  this.statusColumn = 'td:nth-child(5)';

  this.nameRequiredError = element.all(by.css('.lo-error'));
};

module.exports = new SkillsPage();
