'use strict';

var SkillsPage = function() {
  this.skillElements = element.all(by.repeater('item in (filtered = (items | selectedTableOptions:config.fields | search:config.searchOn:searchQuery | orderBy:config.orderBy))'));

  this.creatingSkillHeader = element(by.id('skill-details-create-header'));
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.proficiencyFormCheckbox = element(by.model('resource.hasProficiency'));
  this.proficiencySwitch = this.proficiencyFormCheckbox.element(by.css('.switch-input'));

  this.nameHeader = element(by.id('skill-details-name-header'));
  this.detailsMemberCount = element(by.css('h1.ng-binding > b:nth-child(1)'));

  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.membersColumn = 'td:nth-child(4)';
  this.proficiencyColumn = 'td:nth-child(5)';

  this.nameRequiredError = element.all(by.css('.error'));
};

module.exports = new SkillsPage();
