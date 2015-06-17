'use strict';

var SkillsPage = function() {
  this.skillElements = element.all(by.repeater('item in (filtered = (items | selectedTableOptions:config.fields | search:config.searchOn:searchQuery | orderBy:config.orderBy))'));

  this.creatingSkillHeader = element(by.css('h3.ng-scope'));
  this.nameFormField = element(by.model('resource.name'));
  this.descriptionFormField = element(by.model('resource.description'));
  this.proficiencyFormCheckbox = element(by.model('resource.hasProficiency'));

  this.nameHeader = element(by.css('h1.ng-binding'));
  this.detailsMemberCount = element(by.css('h1.ng-binding > b:nth-child(1)'));

  this.firstTableRow = element(by.css('tr.ng-scope:nth-child(1)'));
  this.secondTableRow = element(by.css('tr.ng-scope:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.descriptionColumn = 'td:nth-child(3)';
  this.membersColumn = 'td:nth-child(4)';
  this.proficiencyColumn = 'td:nth-child(5)';

  this.nameRequiredError = element(by.css('form-error'));
};

module.exports = new SkillsPage();
