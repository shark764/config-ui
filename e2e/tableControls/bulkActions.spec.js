'use strict';

describe('The bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('./bulkActions.po.js'),
    columns = require('./columns.po.js'),
    shared = require('../shared.po.js'),
    users = require('../management/users.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should be displayed including checkboxes on supported Management pages', function() {
    // User Management Page
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    shared.tableElements.count().then(function(numUsers) {
      if (numUsers > 0) {
        expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
        expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
      }
    }).then(function() {
      // Skill Management Page
      browser.get(shared.skillsPageUrl);
      expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
      shared.tableElements.count().then(function(numSkills) {
        if (numSkills > 0) {
          expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
          expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
        }
      });
    }).then(function() {
      // Group Management Page
      browser.get(shared.groupsPageUrl);
      expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
      shared.tableElements.count().then(function(numGroups) {
        if (numGroups > 0) {
          expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
          expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
        }
      });
    });
  });

  it('should be displayed including checkboxes on supported Configuration pages', function() {
    // Tenant Management Page
    browser.get(shared.tenantsPageUrl);
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    shared.tableElements.count().then(function(numTenants) {
      if (numTenants > 0) {
        expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
        expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
      }
    }).then(function() {
      // Integrations Management Page
      browser.get(shared.integrationsPageUrl);
      expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
      shared.tableElements.count().then(function(numIntegrations) {
        if (numIntegrations > 0) {
          expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
          expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
        }
      });
    });
  });

  it('should be displayed including checkboxes on supported Flow pages', function() {
    // Flows Management Page
    browser.get(shared.flowsPageUrl);
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    shared.tableElements.count().then(function(numFlows) {
      if (numFlows > 0) {
        expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
        expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
      }
    }).then(function() {
      // Queue Management Page
      browser.get(shared.queuesPageUrl);
      expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
      shared.tableElements.count().then(function(numQueues) {
        if (numQueues > 0) {
          expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
          expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
        }
      });
    }).then(function() {
      // Dispatch Mappings Management Page
      browser.get(shared.dispatchMappingsPageUrl);
      expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
      shared.tableElements.count().then(function(numDispatchMappings) {
        if (numDispatchMappings > 0) {
          expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeTruthy();
          expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeTruthy();
        }
      });
    });
  });

  it('should not be displayed and not have checkboxes on non-supported pages', function() {
    // Media Collection Management Page
    browser.get(shared.mediaCollectionsPageUrl)
    expect(shared.actionsBtn.isDisplayed()).toBeFalsy();
    shared.tableElements.count().then(function(numMediaCollections) {
      if (numMediaCollections > 0) {
        expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeFalsy();
        expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeFalsy();
      }
    }).then(function() {
      // Media Management Page
      browser.get(shared.mediaPageUrl);
      expect(shared.actionsBtn.isDisplayed()).toBeFalsy();
      shared.tableElements.count().then(function(numMedia) {
        if (numMedia > 0) {
          expect(bulkActions.selectAllTableHeader.isDisplayed()).toBeFalsy();
          expect(bulkActions.selectItemTableCells.get(0).isDisplayed()).toBeFalsy();
        }
      });
    });
  });

  it('should be displayed when Actions is selected', function() {
    // Actions panel closed by default
    expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();

    shared.actionsBtn.click();

    // Actions panel opened and contains expected elements
    expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();
    expect(bulkActions.selectedItemsDropdownHeader.isDisplayed()).toBeTruthy();
    // At least one bulk action is displayed..
    expect(bulkActions.bulkActionDivs.get(0).isDisplayed()).toBeTruthy();

    // Generic Cancel, Submit and Close buttons are displayed
    expect(bulkActions.submitFormBtn.isDisplayed()).toBeTruthy();
    expect(bulkActions.cancelFormBtn.isDisplayed()).toBeTruthy();
    expect(bulkActions.closeFormBtn.isDisplayed()).toBeTruthy();
    expect(bulkActions.submitFormBtn.getAttribute('class')).toBe('btn btn-primary');
    expect(bulkActions.cancelFormBtn.getAttribute('class')).toBe('btn');
  });

  it('should be closed when Cancel or X is selected', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();

    // Closes on Cancel
    bulkActions.cancelFormBtn.click();
    //BUG TODO Not consistent with other flows
    //expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();

    // Closes on X
    shared.actionsBtn.click();
    bulkActions.closeFormBtn.click();
    expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();
  });

  it('should close details pane when Actions is selected and vise versa', function() {
    shared.tableElements.count().then(function(tableCount) {
      if (tableCount > 0) {
        shared.actionsBtn.click();
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();

        shared.firstTableRow.click();
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();
        expect(shared.detailsForm.isDisplayed()).toBeTruthy();

        shared.actionsBtn.click();
        expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();
        expect(shared.detailsForm.isDisplayed()).toBeFalsy();
      }
    });
  });

  it('should Create details pane when Actions is selected and vise versa', function() {
    shared.actionsBtn.click();
    expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();

    shared.createBtn.click();
    expect(bulkActions.bulkActionsForm.isDisplayed()).toBeFalsy();
    expect(shared.detailsForm.isDisplayed()).toBeTruthy();

    shared.actionsBtn.click();
    expect(bulkActions.bulkActionsForm.isDisplayed()).toBeTruthy();
    expect(shared.detailsForm.isDisplayed()).toBeFalsy();
  });

  it('should show number and names of selected items', function() {
    // Selected items is 0 be default
    shared.actionsBtn.click();
    expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (0)');
    bulkActions.selectedItemsDropdownHeader.click();
    expect(bulkActions.selectedItemsDropdown.isDisplayed()).toBeFalsy();

    shared.tableElements.count().then(function(tableCount) {
      for (var i = 0; i < tableCount; i++) {
        bulkActions.selectItemTableCells.get(i).click();
        expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (' + (i + 1) + ')');

        // Dropdown contains newly selected user name
        bulkActions.selectedItemsDropdownHeader.click();
        expect(bulkActions.selectedItemsDropdown.isDisplayed()).toBeTruthy();
        expect(bulkActions.selectedItemsDropdownElements.count()).toBe(i + 1);

        // BUG: Ordering should be the same as the table
        // Adds newly selected item to the top of the list
        //expect(shared.tableElements.get(i).getText()).toContain(bulkActions.selectedItemsDropdownElements.get(i).getText());
      }
      expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (' + tableCount + ')');
    });
  });

  it('should show number of selected items when All checkbox is selected', function() {
    // Selected items is 0 be default
    shared.actionsBtn.click();
    expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (0)');
    bulkActions.selectedItemsDropdownHeader.click();
    expect(bulkActions.selectedItemsDropdown.isDisplayed()).toBeFalsy();

    shared.tableElements.count().then(function(tableCount) {
      if (tableCount > 0) {
        bulkActions.selectAllTableHeader.click();
        expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (' + tableCount + ')');
      }
    });
  });

  it('should update number and names of selected items when unselected', function() {
    shared.actionsBtn.click();

    shared.tableElements.count().then(function(tableCount) {
      bulkActions.selectAllTableHeader.click();
      expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (' + tableCount + ')');

      for (var i = 0; i < tableCount; i++) {
        bulkActions.selectItemTableCells.get(i).click();
        expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (' + (tableCount - (i + 1)) + ')');

        bulkActions.selectedItemsDropdownHeader.click();
        expect(bulkActions.selectedItemsDropdownElements.count()).toBe(tableCount - (i + 1));
      }
      expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (0)');
    });
  });

  it('should maintain number of selected items when Bulk Actions selction is opened and closed', function() {
    // Select items
    shared.tableElements.count().then(function(tableCount) {
      shared.tableElements.count().then(function(tableCount) {
        var numSelected = 0;
        for (var i = 0; i < tableCount; i++) {
          if ((i % 2) > 0) {
            // Select some but not all items
            bulkActions.selectItemTableCells.get(i).click();
            numSelected++;
          }
        }
        // Expect selected number of items to persist
        shared.actionsBtn.click();
        expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (' + numSelected + ')');

        bulkActions.closeFormBtn.click();
        shared.actionsBtn.click();
        expect(bulkActions.selectedItemsDropdownHeaderLabel.getAttribute('label')).toBe('Selected (' + numSelected + ')');
      });
    });
  });

  it('should enable and disable bulk action fields when selected', function() {
    shared.actionsBtn.click();

    // User's enable field is disabled by default
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();

    bulkActions.userSelectEnable.click();
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeFalsy();

    bulkActions.userSelectEnable.click();
    expect(bulkActions.enableToggle.getAttribute('disabled')).toBeTruthy();
  });

});
