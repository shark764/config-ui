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
    expect(shared.detailsForm.isDisplayed()).toBeFalsy(); //Hide right panel by default
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();
    expect(shared.createBtn.isDisplayed()).toBeFalsy();
    expect(shared.tableColumnsDropDown.isDisplayed()).toBeTruthy();
    expect(shared.pageHeader.getText()).toBe('Integration Management');
  });

  describe('birst integration', function() {
    beforeEach(function() {
      shared.searchField.sendKeys('birst');
    });

    it('should display details when selected from table', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 0) {
          shared.firstTableRow.click();

          expect(integrations.typeHeader.getText()).toContain(shared.firstTableRow.element(by.css(integrations.typeColumn)).getText());
          shared.firstTableRow.element(by.css(integrations.statusColumn)).getText().then(function(integrationStatus) {
              if (integrationStatus == 'Enabled') {
                expect(integrations.statusSwitchToggle.isSelected()).toBeTruthy();
              } else if (integrationStatus == 'Disabled') {
                expect(integrations.statusSwitchToggle.isSelected()).toBeFalsy();
              } else {
                // fail test
                expect(true).toBeFalsy();
              };
            }
          });
      });
    });

    it('should include valid fields when editing', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 0) {
          shared.firstTableRow.click();

          expect(integrations.typeHeader.isDisplayed()).toBeTruthy();
          expect(integrations.statusSwitch.isDisplayed()).toBeTruthy();

          expect(integrations.spaceIdFormField.isDisplayed()).toBeTruthy();
          expect(integrations.ssoPasswordFormField.isDisplayed()).toBeTruthy();
          expect(integrations.baseURLFormField.isDisplayed()).toBeTruthy();
          expect(integrations.adminPasswordFormField.isDisplayed()).toBeTruthy();
          expect(integrations.adminUsernameFormField.isDisplayed()).toBeTruthy();

          // should not display other integration type fields
          expect(integrations.accessKeyFormField.isDisplayed()).toBeFalsy();
          expect(integrations.secretKeyFormField.isDisplayed()).toBeFalsy();
          expect(integrations.accountSIDFormField.isDisplayed()).toBeFalsy();
          expect(integrations.webRTCFormSwitch.isDisplayed()).toBeFalsy();
        }
      });
    });

    it('should reset fields after editing and selecting Cancel', function() {
      shared.tableElements.count().then(function(integrationCount) {
        if (integrationCount == 0) {
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
        if (integrationCount == 0) {
          shared.firstTableRow.click();

          // Edit fields
          integrations.spaceIdFormField.sendKeys('Edit');
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
            integrations.spaceIdFormField.sendKeys('\u0008\u0008\u0008\u0008');
            integrations.ssoPasswordFormField.sendKeys('\u0008\u0008\u0008\u0008');
            integrations.baseURLFormField.sendKeys('\u0008\u0008\u0008\u0008');
            integrations.adminPasswordFormField.sendKeys('\u0008\u0008\u0008\u0008');
            integrations.adminUsernameFormField.sendKeys('\u0008\u0008\u0008\u0008');

            shared.submitFormBtn.click().then(function() {
              expect(shared.successMessage.isDisplayed()).toBeTruthy();
            });
          });
        }
      });
    });

    it('should require all fields when editing', function() {
      // TODO After TITAN2-3323 All fields or none are required
      shared.firstTableRow.click();

      // Clear fields
      integrations.spaceIdFormField.clear();
      integrations.ssoPasswordFormField.clear();
      integrations.baseURLFormField.clear();
      integrations.adminPasswordFormField.clear();
      integrations.adminUsernameFormField.clear();

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
    });
  });

  describe('client integration', function() {
    beforeEach(function() {
      shared.searchField.sendKeys('client');
    });
  });

  describe('twilio integration', function() {
    beforeEach(function() {
      shared.searchField.sendKeys('twilio');
    });
  });

});
