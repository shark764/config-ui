'use strict';

describe('The users invitations bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../tableControls/bulkActions.po.js'),
    shared = require('../shared.po.js'),
    columns = require('../tableControls/columns.po.js'),
    users = require('../management/users.po.js'),
    invites = require('./invites.po.js'),
    params = browser.params,
    userCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
    userCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should allow invite to be cancelled', function() {
    // Add Tenant Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownInputs.get(8).isSelected().then(function(tenantStatusSelected) {
      if (!tenantStatusSelected) {
        shared.tableColumnsDropDownOptions.get(8).click();
        expect(shared.tableColumnsDropDownInputs.get(8).isSelected()).toBeTruthy();
      }
    }).then(function() {
      shared.tableColumnsDropDown.click();
      users.tenantStatusTableDropDownLabel.click();

      // Leave Pending Acceptance selected from drop down
      users.dropdownTenantStatuses.get(0).click();
      users.dropdownTenantStatuses.get(1).click();
      users.dropdownTenantStatuses.get(2).click();
      users.dropdownTenantStatuses.get(3).click().then(function() {
        expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeFalsy();
        expect(users.dropdownTenantStatusInputs.get(5).isSelected()).toBeTruthy();

        shared.tableElements.count().then(function(pendingAcceptanceUsers) {
          if (pendingAcceptanceUsers > 0) {
            shared.firstTableRow.element(by.css(users.emailColumn)).getText().then(function(updatedUserEmail) {
              bulkActions.selectItemTableCells.get(0).click();
              shared.actionsBtn.click();
              bulkActions.selectCancelInvite.click();
              bulkActions.submitFormBtn.click();

              shared.waitForConfirm();
              bulkActions.confirmOK.click().then(function() {
                shared.waitForSuccess();

                shared.clearAllResultsLink.click();
                shared.searchField.sendKeys(updatedUserEmail);
                expect(shared.firstTableRow.getText()).toContain('Pending Invitation');
              });
            });
          }
        });
      });
    });
  });

  it('should allow invite to be sent', function() {
    // Add Tenant Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownInputs.get(8).isSelected().then(function(tenantStatusSelected) {
      if (!tenantStatusSelected) {
        shared.tableColumnsDropDownOptions.get(8).click();
        expect(shared.tableColumnsDropDownInputs.get(8).isSelected()).toBeTruthy();
      }
    }).then(function() {
      shared.tableColumnsDropDown.click();
      users.tenantStatusTableDropDownLabel.click();

      // Select Pending Invitation from drop down
      users.dropdownTenantStatuses.get(0).click();
      users.dropdownTenantStatuses.get(1).click();
      users.dropdownTenantStatuses.get(3).click();
      users.dropdownTenantStatuses.get(4).click().then(function() {
        // All input is unselected
        expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeFalsy();
        expect(users.dropdownTenantStatusInputs.get(3).isSelected()).toBeTruthy();

        shared.tableElements.count().then(function(pendingInvitationUsers) {
          if (pendingInvitationUsers > 0) {
            shared.firstTableRow.element(by.css(users.emailColumn)).getText().then(function(updatedUserEmail) {
              bulkActions.selectItemTableCells.get(0).click();
              shared.actionsBtn.click();
              bulkActions.selectInviteNow.click();
              bulkActions.submitFormBtn.click();

              shared.waitForConfirm();
              bulkActions.confirmOK.click().then(function() {
                shared.waitForSuccess();

                shared.clearAllResultsLink.click();
                shared.searchField.sendKeys(updatedUserEmail);
                expect(shared.firstTableRow.getText()).toContain('Pending Acceptance');
              });
            });
          }
        });
      });
    });
  });

  it('should allow invite to be resent after expiring', function() {
    // Add Tenant Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownInputs.get(8).isSelected().then(function(tenantStatusSelected) {
      if (!tenantStatusSelected) {
        shared.tableColumnsDropDownOptions.get(8).click();
        expect(shared.tableColumnsDropDownInputs.get(8).isSelected()).toBeTruthy();
      }
    }).then(function() {
      shared.tableColumnsDropDown.click();
      users.tenantStatusTableDropDownLabel.click();

      // Select Expired from drop down
      users.dropdownTenantStatuses.get(0).click();
      users.dropdownTenantStatuses.get(2).click();
      users.dropdownTenantStatuses.get(3).click();
      users.dropdownTenantStatuses.get(4).click().then(function() {
        // All input is unselected
        expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeFalsy();
        expect(users.dropdownTenantStatusInputs.get(2).isSelected()).toBeTruthy();

        shared.tableElements.count().then(function(expiredInvitationUsers) {
          if (expiredInvitationUsers > 0) {
            shared.firstTableRow.element(by.css(users.emailColumn)).getText().then(function(updatedUserEmail) {
              bulkActions.selectItemTableCells.get(0).click();
              shared.actionsBtn.click();
              bulkActions.selectResendInvite.click();
              bulkActions.submitFormBtn.click();

              shared.waitForConfirm();
              bulkActions.confirmOK.click().then(function() {
                shared.waitForSuccess();

                shared.clearAllResultsLink.click();
                shared.searchField.sendKeys(updatedUserEmail);
                expect(shared.firstTableRow.getText()).toContain('Pending Acceptance');
              });
            });
          }
        });
      });
    });
  });

  it('should do nothing for Accepted users', function() {
    // Add Tenant Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownInputs.get(8).isSelected().then(function(tenantStatusSelected) {
      if (!tenantStatusSelected) {
        shared.tableColumnsDropDownOptions.get(8).click();
        expect(shared.tableColumnsDropDownInputs.get(8).isSelected()).toBeTruthy();
      }
    }).then(function() {
      shared.tableColumnsDropDown.click();
      users.tenantStatusTableDropDownLabel.click();

      // Select Accepted from drop down
      users.dropdownTenantStatuses.get(0).click();
      users.dropdownTenantStatuses.get(1).click();
      users.dropdownTenantStatuses.get(2).click();
      users.dropdownTenantStatuses.get(4).click().then(function() {
        // All input is unselected
        expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeFalsy();
        expect(users.dropdownTenantStatusInputs.get(4).isSelected()).toBeTruthy();

        shared.tableElements.count().then(function(acceptedUsers) {
          if (acceptedUsers > 0) {
            bulkActions.selectAllTableHeader.click();
            shared.actionsBtn.click();

            bulkActions.selectInviteNow.click();
            bulkActions.selectResendInvite.click();
            bulkActions.selectCancelInvite.click();

            expect(bulkActions.submitFormBtn.isEnabled()).toBeFalsy();
            bulkActions.submitFormBtn.click();

            expect(bulkActions.confirmModal.isPresent()).toBeFalsy();
            expect(shared.successMessage.isPresent()).toBeFalsy();
          }
        });
      });
    });
  });

});
