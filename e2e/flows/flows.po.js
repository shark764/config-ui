'use strict';

var FlowPage = function() {
  this.nameFormField = element(by.model('selectedFlow.name'));
  this.descriptionFormField = element(by.model('selectedFlow.description'));
  this.typeFormDropdown = element(by.model('selectedFlow.type'));
  this.activeFormToggle = element(by.model('selectedFlow.active'));
  this.activeVersionDropdown = element(by.model('selectedFlow.activeVersion'));
  this.activeVersionDropdownOptions = this.activeVersionDropdown.all(by.css('option'));

  this.versionsTable = element(by.id('flow-details-versions-table'));
  this.versionsTableElements = this.versionsTable.all(by.repeater('version in getVersions() | orderBy:\'created\':\'reverse\''));
  this.versionNameFormField = element(by.model('version.name'));
  this.versionDescriptionFormField = element(by.model('version.description'));
  this.showCreateNewVersionBtn = element(by.id('show-create-new-version'));
  this.cancelVersionFormBtn = element(by.id('cancel-flow-version-btn'));
  this.createVersionFormBtn = element(by.id('create-flow-version-btn'));

  this.draftTable = element(by.id('flow-details-draft-table'));
  this.draftTableElements = this.draftTable.all(by.repeater('draft in drafts | orderBy:\'created\':\'reverse\''));
  this.draftNameFormField = element(by.model('draft.name'));
  this.draftDescriptionFormField = element(by.model('draft.description'));
  this.showCreateNewDraftBtn = element(by.id('show-create-new-draft'));
  this.cancelDraftFormBtn = element(by.id('cancel-flow-draft-btn'));
  this.createDraftFormBtn = element(by.id('create-flow-draft-btn'));

  this.createModal = element(by.id('modal'));
  this.modalHeader = this.createModal.element(by.css('h3'));
  this.modalNameField = this.createModal.element(by.model('flow.name'));
  this.modalTypeDropdown = this.createModal.element(by.model('flow.type'));
  this.customerTypeOption = this.createModal.element(by.css('[label="Customer"]'));
  this.resourceTypeOption = this.createModal.element(by.css('[label="Resource"]'));
  this.reusableTypeOption = this.createModal.element(by.css('[label="Reusable"]'));
  this.submitModalBtn = this.createModal.element(by.id('modal-ok'));
  this.cancelModalBtn = this.createModal.element(by.id('modal-cancel'));

  this.requiredErrors = element.all(by.css('.lo-error'));

  this.firstTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(1)'));
  this.secondTableRow = element(by.css('#items-table > tbody:nth-child(2) > tr:nth-child(2)'));
  this.nameColumn = 'td:nth-child(2)';
  this.activeVersionColumn = 'td:nth-child(3)';

  this.waitForFlowDesignerRedirect = function() {
    browser.driver.wait(function() {
      return browser.getCurrentUrl().then(function(currentUrl) {
        return currentUrl.indexOf('/flows/editor') > 0;
      });
    }, 10000);
  };

  this.waitForDrafts = function() {
    browser.driver.wait(function() {
      return element.all(by.repeater('draft in drafts | orderBy:\'created\':\'reverse\'')).count().then(function(draftCount) {
        return draftCount > 0;
      });
    }, 5000);
  };
};

module.exports = new FlowPage();
