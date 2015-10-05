'use strict';

describe('The integrations view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    integrations = require('./integrations.po.js'),
    params = browser.params,
    integrationCount,
    randomIntegration;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.integrationsPageUrl);
    integrationCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include integration page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.table.isDisplayed()).toBeTruthy();
    expect(shared.searchField.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Integration Management');
  });

  it('should display integraction details when selected from table', function() {
    shared.tableElements.count().then(function(integrationCount) {
      for (var i = 0; i < integrationCount; i++) {
        shared.tableElements.get(i).click()

        expect(integrations.typeHeader.getText()).toContain(shared.tableRows.get(i).element(by.css(integrations.typeColumn)).getText());
        shared.tableRows.get(i).element(by.css(integrations.statusColumn)).getText().then(function(integrationStatus) {
          if (integrationStatus == 'Enabled') {
            expect(integrations.statusSwitchToggle.isSelected()).toBeTruthy();
          } else if (integrationStatus == 'Disabled') {
            expect(integrations.statusSwitchToggle.isSelected()).toBeFalsy();
          } else {
            // fail test
            expect(true).toBeFalsy();
          }
        });
      }
    });
  });

  describe('birst integration', function() {
    beforeEach(function() {
      shared.searchField.sendKeys('birst');
    });

    it('should include valid fields when editing', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          expect(integrations.typeHeader.isDisplayed()).toBeTruthy();
          expect(integrations.statusSwitch.isDisplayed()).toBeTruthy();

          expect(integrations.spaceIdFormField.isDisplayed()).toBeTruthy();
          expect(integrations.ssoPasswordFormField.isDisplayed()).toBeTruthy();
          expect(integrations.baseURLFormField.isDisplayed()).toBeTruthy();
          expect(integrations.adminPasswordFormField.isDisplayed()).toBeTruthy();
          expect(integrations.adminUsernameFormField.isDisplayed()).toBeTruthy();

          // should not display other integration type fields
          expect(integrations.accessKeyFormField.isPresent()).toBeFalsy();
          expect(integrations.secretKeyFormField.isPresent()).toBeFalsy();
          expect(integrations.accountSIDFormField.isPresent()).toBeFalsy();
          expect(integrations.authTokenFormField.isPresent()).toBeFalsy();
          expect(integrations.webRTCFormSwitch.isPresent()).toBeFalsy();
        }
      });
    });

    it('should reset fields after editing and selecting Cancel', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          var originalSpaceId = integrations.spaceIdFormField.getAttribute('value');
          var originalSsoPassword = integrations.ssoPasswordFormField.getAttribute('value');
          var originalBaseUrl = integrations.baseURLFormField.getAttribute('value');
          var originalAdminPassword = integrations.adminPasswordFormField.getAttribute('value');
          var originalAdminUsername = integrations.adminUsernameFormField.getAttribute('value');

          // Edit fields
          integrations.spaceIdFormField.sendKeys('Cancel');
          integrations.ssoPasswordFormField.sendKeys('Cancel');
          integrations.baseURLFormField.sendKeys('Cancel');
          integrations.adminPasswordFormField.sendKeys('Cancel');
          integrations.adminUsernameFormField.sendKeys('Cancel');
          shared.cancelFormBtn.click();

          // Warning message is displayed
          shared.dismissChanges();

          expect(shared.successMessage.isPresent()).toBeFalsy();
          expect(shared.tableElements.count()).toBe(integrationCount);

          // Fields reset to original values
          expect(integrations.spaceIdFormField.getAttribute('value')).toBe(originalSpaceId);
          expect(integrations.ssoPasswordFormField.getAttribute('value')).toBe(originalSsoPassword);
          expect(integrations.baseURLFormField.getAttribute('value')).toBe(originalBaseUrl);
          expect(integrations.adminPasswordFormField.getAttribute('value')).toBe(originalAdminPassword);
          expect(integrations.adminUsernameFormField.getAttribute('value')).toBe(originalAdminUsername);
        }
      });
    });

    it('should allow the Integration fields to be updated', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();
          integrations.spaceIdFormField.getAttribute('value').then(function(originalSpaceId) {
            // Edit fields
            integrations.spaceIdFormField.clear();
            integrations.spaceIdFormField.sendKeys('de305d54-75b4-431b-adb2-eb6b9e546014');
            integrations.ssoPasswordFormField.sendKeys('Edit');
            integrations.baseURLFormField.sendKeys('Edit');
            integrations.adminPasswordFormField.sendKeys('Edit');
            integrations.adminUsernameFormField.sendKeys('Edit');

            var editSpaceId = integrations.spaceIdFormField.getAttribute('value');
            var editSsoPassword = integrations.ssoPasswordFormField.getAttribute('value');
            var editBaseUrl = integrations.baseURLFormField.getAttribute('value');
            var editAdminPassword = integrations.adminPasswordFormField.getAttribute('value');
            var editAdminUsername = integrations.adminUsernameFormField.getAttribute('value');

            shared.submitFormBtn.click().then(function() {
              expect(shared.successMessage.isDisplayed()).toBeTruthy();
              expect(shared.tableElements.count()).toBe(integrationCount);

              // Changes persist
              browser.refresh();
              expect(integrations.spaceIdFormField.getAttribute('value')).toBe(editSpaceId);
              expect(integrations.ssoPasswordFormField.getAttribute('value')).toBe(editSsoPassword);
              expect(integrations.baseURLFormField.getAttribute('value')).toBe(editBaseUrl);
              expect(integrations.adminPasswordFormField.getAttribute('value')).toBe(editAdminPassword);
              expect(integrations.adminUsernameFormField.getAttribute('value')).toBe(editAdminUsername);

              // Reset values
              integrations.spaceIdFormField.clear();
              integrations.spaceIdFormField.sendKeys(originalSpaceId);
              integrations.ssoPasswordFormField.sendKeys('\u0008\u0008\u0008\u0008');
              integrations.baseURLFormField.sendKeys('\u0008\u0008\u0008\u0008');
              integrations.adminPasswordFormField.sendKeys('\u0008\u0008\u0008\u0008');
              integrations.adminUsernameFormField.sendKeys('\u0008\u0008\u0008\u0008');

              shared.submitFormBtn.click().then(function() {
                expect(shared.successMessage.isDisplayed()).toBeTruthy();
              });
            });
          });
        }
      });
    });

    it('should require all fields when editing', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          // Clear fields
          integrations.spaceIdFormField.clear();
          integrations.ssoPasswordFormField.clear();
          integrations.baseURLFormField.clear();
          integrations.adminPasswordFormField.clear();
          integrations.adminUsernameFormField.clear();
          integrations.adminUsernameFormField.sendKeys('\t');

          // Submit button is still disabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();

          // Error messages displayed
          expect(integrations.requiredErrors.get(0).getText()).toBe('Please enter the Birst space ID');
          expect(integrations.requiredErrors.get(1).getText()).toBe('Please enter the Birst SSO Password');
          expect(integrations.requiredErrors.get(2).getText()).toBe('Please enter the Birst base URL');
          expect(integrations.requiredErrors.get(3).getText()).toBe('Please enter the Birst admin password');
          expect(integrations.requiredErrors.get(4).getText()).toBe('Please enter the Birst admin username');
          expect(shared.successMessage.isPresent()).toBeFalsy();
        }
      });
    });

    it('should require valid UUID input for Space Id', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          // Complete field with invalid UUID
          integrations.spaceIdFormField.clear();
          integrations.spaceIdFormField.sendKeys('not a valid uuid\t');

          // Submit button is still disabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();

          // Error message displayed
          expect(integrations.requiredErrors.get(0).getText()).toBe('Space ID must be a valid UUID');
          expect(shared.successMessage.isPresent()).toBeFalsy();

          // Complete field with valid UUID
          integrations.spaceIdFormField.clear();
          integrations.spaceIdFormField.sendKeys('de305d54-75b4-431b-adb2-eb6b9e546014\t');

          // Submit button is enabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeNull();
        }
      });
    });
  });

  describe('client integration', function() {
    beforeEach(function() {
      shared.searchField.sendKeys('client');
    });

    it('should include valid fields when editing', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          expect(integrations.typeHeader.isDisplayed()).toBeTruthy();
          expect(integrations.statusSwitch.isDisplayed()).toBeTruthy();

          expect(integrations.accessKeyFormField.isDisplayed()).toBeTruthy();
          expect(integrations.secretKeyFormField.isDisplayed()).toBeTruthy();

          // should not display other integration type fields
          expect(integrations.spaceIdFormField.isPresent()).toBeFalsy();
          expect(integrations.ssoPasswordFormField.isPresent()).toBeFalsy();
          expect(integrations.baseURLFormField.isPresent()).toBeFalsy();
          expect(integrations.adminPasswordFormField.isPresent()).toBeFalsy();
          expect(integrations.adminUsernameFormField.isPresent()).toBeFalsy();
          expect(integrations.accountSIDFormField.isPresent()).toBeFalsy();
          expect(integrations.authTokenFormField.isPresent()).toBeFalsy();
          expect(integrations.webRTCFormSwitch.isPresent()).toBeFalsy();
        }
      });
    });

    it('should reset fields after editing and selecting Cancel', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          var originalAccessKey = integrations.accessKeyFormField.getAttribute('value');
          var originalSecretKey = integrations.secretKeyFormField.getAttribute('value');

          // Edit fields
          integrations.accessKeyFormField.sendKeys('Cancel');
          integrations.secretKeyFormField.sendKeys('Cancel');
          shared.cancelFormBtn.click();

          // Warning message is displayed
          shared.dismissChanges();

          expect(shared.successMessage.isPresent()).toBeFalsy();
          expect(shared.tableElements.count()).toBe(integrationCount);

          // Fields reset to original values
          expect(integrations.accessKeyFormField.getAttribute('value')).toBe(originalAccessKey);
          expect(integrations.secretKeyFormField.getAttribute('value')).toBe(originalSecretKey);
        }
      });
    });

    xit('should allow the Integration fields to be updated', function() {
      // TODO Bug TITAN2-3733
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          // Edit fields
          integrations.accessKeyFormField.sendKeys('Edit');
          integrations.secretKeyFormField.sendKeys('Edit');

          var editAccessKey = integrations.accessKeyFormField.getAttribute('value');
          var editSecretKey = integrations.secretKeyFormField.getAttribute('value');

          shared.submitFormBtn.click().then(function() {
            expect(shared.successMessage.isDisplayed()).toBeTruthy();
            expect(shared.tableElements.count()).toBe(integrationCount);

            // Changes persist
            browser.refresh();
            expect(integrations.accessKeyFormField.getAttribute('value')).toBe(editAccessKey);
            expect(integrations.secretKeyFormField.getAttribute('value')).toBe(editSecretKey);

            // Reset values
            integrations.accessKeyFormField.sendKeys('\u0008\u0008\u0008\u0008');
            integrations.secretKeyFormField.sendKeys('\u0008\u0008\u0008\u0008');

            shared.submitFormBtn.click().then(function() {
              expect(shared.successMessage.isDisplayed()).toBeTruthy();
            });
          });
        }
      });
    });

    it('should require all fields when editing', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          // Clear fields
          integrations.accessKeyFormField.clear();
          integrations.secretKeyFormField.clear();
          integrations.secretKeyFormField.sendKeys('\t');

          // Submit button is still disabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();

          // Error messages displayed
          expect(integrations.requiredErrors.get(0).getText()).toBe('Please enter your access key');
          expect(integrations.requiredErrors.get(1).getText()).toBe('Please enter your secret key');
          expect(shared.successMessage.isPresent()).toBeFalsy();
        }
      });
    });
  });

  describe('twilio integration', function() {
    beforeEach(function() {
      shared.searchField.sendKeys('twilio');
    });

    it('should include valid fields when editing', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          expect(integrations.typeHeader.isDisplayed()).toBeTruthy();
          expect(integrations.statusSwitch.isDisplayed()).toBeTruthy();

          expect(integrations.accountSIDFormField.isDisplayed()).toBeTruthy();
          expect(integrations.authTokenFormField.isDisplayed()).toBeTruthy();
          expect(integrations.webRTCFormSwitch.isDisplayed()).toBeTruthy();

          // should not display other integration type fields
          expect(integrations.spaceIdFormField.isPresent()).toBeFalsy();
          expect(integrations.ssoPasswordFormField.isPresent()).toBeFalsy();
          expect(integrations.baseURLFormField.isPresent()).toBeFalsy();
          expect(integrations.adminPasswordFormField.isPresent()).toBeFalsy();
          expect(integrations.adminUsernameFormField.isPresent()).toBeFalsy();
          expect(integrations.accessKeyFormField.isPresent()).toBeFalsy();
          expect(integrations.secretKeyFormField.isPresent()).toBeFalsy();
        }
      });
    });

    it('should reset fields after editing and selecting Cancel', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          var originalAccountSID = integrations.accountSIDFormField.getAttribute('value');
          var originalAuthToken = integrations.authTokenFormField.getAttribute('value');
          var originalWebRTC = integrations.webRTCFormSwitchToggle.isSelected();

          // Edit fields
          integrations.accountSIDFormField.sendKeys('Cancel');
          integrations.authTokenFormField.sendKeys('Cancel');
          integrations.webRTCFormSwitch.click();
          shared.cancelFormBtn.click();

          // Warning message is displayed
          shared.dismissChanges();

          expect(shared.successMessage.isPresent()).toBeFalsy();
          expect(shared.tableElements.count()).toBe(integrationCount);

          // Fields reset to original values
          expect(integrations.accountSIDFormField.getAttribute('value')).toBe(originalAccountSID);
          expect(integrations.authTokenFormField.getAttribute('value')).toBe(originalAuthToken);
          expect(integrations.webRTCFormSwitchToggle.isSelected()).toBe(originalWebRTC);
        }
      });
    });

    it('should allow the Integration fields to be updated', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();
          integrations.accountSIDFormField.getAttribute('value').then(function(originalAccountSID) {
            // Edit fields
            integrations.accountSIDFormField.sendKeys('Edit');
            integrations.authTokenFormField.sendKeys('Edit');
            integrations.webRTCFormSwitch.click();

            var editAccountSID = integrations.accountSIDFormField.getAttribute('value');
            var editAuthToken = integrations.authTokenFormField.getAttribute('value');
            var editWebRTC = integrations.webRTCFormSwitchToggle.isSelected();

            shared.submitFormBtn.click().then(function() {
              expect(shared.successMessage.isDisplayed()).toBeTruthy();
              expect(shared.tableElements.count()).toBe(integrationCount);

              // Changes persist
              browser.refresh();
              expect(integrations.accountSIDFormField.getAttribute('value')).toBe(editAccountSID);
              expect(integrations.authTokenFormField.getAttribute('value')).toBe(editAuthToken);
              expect(integrations.webRTCFormSwitchToggle.isSelected()).toBe(editWebRTC);

              // If fields weren't blank then reset
              if (originalAccountSID) {
                integrations.accountSIDFormField.sendKeys('\u0008\u0008\u0008\u0008');
                integrations.authTokenFormField.sendKeys('\u0008\u0008\u0008\u0008');
                integrations.webRTCFormSwitch.click();

                shared.submitFormBtn.click().then(function() {
                  expect(shared.successMessage.isDisplayed()).toBeTruthy();
                  expect(integrations.webRTCFormSwitchToggle.isSelected()).not.toBe(editWebRTC);
                });
              }
            });
          });
        }
      });
    });

    it('should require all fields when editing', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 1) {
          shared.firstTableRow.click();

          // Clear fields
          integrations.accountSIDFormField.clear();
          integrations.authTokenFormField.clear();
          integrations.webRTCFormSwitch.click();

          // Submit button is still disabled
          expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
          shared.submitFormBtn.click();

          // Error messages displayed
          expect(integrations.requiredErrors.get(0).getText()).toBe('Please enter the account SID');
          expect(integrations.requiredErrors.get(1).getText()).toBe('Please enter the auth token');
          expect(shared.successMessage.isPresent()).toBeFalsy();
        }
      });
    });
  });

});
