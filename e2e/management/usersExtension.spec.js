'use strict';

describe('The users extensions', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    extensions = require('./extensions.po.js'),
    params = browser.params,
    newUserEmail,
    userCount,
    newExtension,
    extensionCount;

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

  it('should not be displayed when creating user', function() {
    shared.createBtn.click();

    expect(extensions.extensionsSection.isPresent()).toBeFalsy();
    expect(extensions.table.isPresent()).toBeFalsy();
  });

  it('should be displayed after creating user', function() {
    // Add randomness to user details
    var randomUser = Math.floor((Math.random() * 1000) + 100);
    newUserEmail = 'titanuserext' + randomUser + '@mailinator.com';

    // Add new user
    shared.createBtn.click();

    users.emailFormField.sendKeys(newUserEmail + '\t');
    users.tenantRoleFormDropdownOptions.get((randomUser % 3) + 1).click();
    users.platformRoleFormDropdownOptions.get(1).click();

    users.firstNameFormField.sendKeys('First' + randomUser);
    users.lastNameFormField.sendKeys('Last' + randomUser);
    users.externalIdFormField.sendKeys(randomUser);

    users.submitFormBtn.click().then(function() {
      shared.waitForSuccess();

      expect(extensions.extensionsSection.isDisplayed()).toBeTruthy();
      expect(extensions.typeDropdown.isDisplayed()).toBeTruthy();
      expect(extensions.providerDropdown.isDisplayed()).toBeTruthy();
      expect(extensions.addBtn.isDisplayed()).toBeTruthy();
      expect(extensions.addBtn.isEnabled()).toBeFalsy();

      expect(extensions.table.isDisplayed()).toBeTruthy();
    });
  });

  it('should add WebRTC Twilio by default', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    expect(extensions.userExtensions.count()).toBe(1);
    expect(extensions.webRtcTwilio.isDisplayed()).toBeTruthy();
    expect(extensions.webRtcTwilioValue.getText()).toBe('(primary)');
    expect(extensions.webRtcTwilioRemove.isDisplayed()).toBeFalsy();
  });

  it('should be displayed when editing a user', function() {
    shared.firstTableRow.click();

    expect(extensions.extensionsSection.isDisplayed()).toBeTruthy();
    expect(extensions.typeDropdown.isDisplayed()).toBeTruthy();
    expect(extensions.providerDropdown.isDisplayed()).toBeTruthy();
    expect(extensions.pstnValueFormField.isDisplayed()).toBeFalsy(); // Hidden by default when WebRTC is selected
    expect(extensions.extFormField.isDisplayed()).toBeFalsy(); // Hidden by default when WebRTC is selected
    expect(extensions.sipValueFormField.isDisplayed()).toBeFalsy(); // Hidden by default when WebRTC is selected
    expect(extensions.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(extensions.addBtn.isDisplayed()).toBeTruthy();

    expect(extensions.table.isDisplayed()).toBeTruthy();
  });

  it('should add to table with correct Type, Provider and Value when creating', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();

    extensions.pstnValueFormField.sendKeys('15064561234\t');
    extensions.extFormField.sendKeys('12345');

    extensions.descriptionFormField.sendKeys('PSTN Extension description\t');

    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();

      expect(extensions.userExtensions.count()).toBe(2);
      newExtension = extensions.userExtensions.get(1);
      expect(newExtension.element(by.css('.type-col')).getText()).toContain('PSTN');
      expect(newExtension.element(by.css('.provider-col')).getText()).toBe('');
      expect(newExtension.element(by.css('.phone-number-col')).getText()).toBe('+15064561234x12345');
      expect(newExtension.element(by.css('.description-col')).getText()).toBe('PSTN Extension description');
      expect(newExtension.element(by.css('.remove')).isDisplayed()).toBeTruthy();

      // Fields are reset
      expect(extensions.typeDropdown.$('option:checked').getText()).toContain('WebRTC');
      expect(extensions.providerDropdown.$('option:checked').getText()).toContain('Provider');
      expect(extensions.pstnValueFormField.isDisplayed()).toBeFalsy();
      expect(extensions.extFormField.isDisplayed()).toBeFalsy();
      expect(extensions.descriptionFormField.getAttribute('value')).toBe('');
    });
  });

  it('should require input', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    // Add btn diabled by default
    expect(extensions.addBtn.isEnabled()).toBeFalsy();

    // Click each field
    extensions.typeDropdown.click();
    extensions.providerDropdown.click();
    extensions.descriptionFormField.click();

    // Add btn remains disabled
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
    extensions.addBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Required field messages displayed
    expect(extensions.errors.get(0).getText()).toBe('Provider required');
    expect(extensions.errors.get(1).getText()).toBe('Please provide a description');
    expect(extensions.errors.count()).toBe(2);
  });

  it('should require description', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    // Description required for WebRTC
    extensions.providerDropdown.click();
    extensions.twilioDropdownOption.click();
    extensions.descriptionFormField.click();
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
    extensions.addBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(extensions.errors.get(0).getText()).toBe('Please provide a description');
    expect(extensions.errors.count()).toBe(1);

    // Description required for PSTN
    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();
    extensions.pstnValueFormField.sendKeys('15064564567\t');
    extensions.extFormField.sendKeys('12345');
    extensions.descriptionFormField.click();
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
    extensions.addBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(extensions.errors.get(0).getText()).toBe('Please provide a description');
    expect(extensions.errors.count()).toBe(1);

    // Description required for SIP
    extensions.typeDropdown.click();
    extensions.sipDropdownOption.click();
    extensions.sipValueFormField.sendKeys('sip:test@mailinator.com\t');
    extensions.descriptionFormField.click();
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
    extensions.addBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();
    expect(extensions.errors.get(0).getText()).toBe('Please provide a description');
    expect(extensions.errors.count()).toBe(1);
  });

  it('should not require Ext. field input', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();

    extensions.pstnValueFormField.sendKeys('15064564567\t');

    extensions.descriptionFormField.sendKeys('PSTN Extension description\t');

    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();

      expect(extensions.userExtensions.count()).toBe(3);
      newExtension = extensions.userExtensions.get(2);
      expect(newExtension.element(by.css('.type-col')).getText()).toContain('PSTN');
      expect(newExtension.element(by.css('.provider-col')).getText()).toBe('');
      expect(newExtension.element(by.css('.phone-number-col')).getText()).toBe('+15064564567');
      expect(newExtension.element(by.css('.description-col')).getText()).toBe('PSTN Extension description');
      expect(newExtension.element(by.css('.remove')).isDisplayed()).toBeTruthy();
    });
  });

  it('should require valid E.164 format phone number input', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();
    extensions.pstnValueFormField.sendKeys('not a valid phone number\t');
    extensions.descriptionFormField.sendKeys('PSTN Extension description\t');

    // Add button is still disabled
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
    extensions.addBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Error messages displayed
    expect(extensions.errors.get(0).getText()).toBe('Phone number should be in E.164 format.');
    expect(extensions.errors.count()).toBe(1);
  });

  it('should format phone number value input', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();
    extensions.pstnValueFormField.sendKeys('15062345678\t');

    // Error messages are not displayed
    expect(extensions.errors.count()).toBe(0);

    // Phone input is reformatted
    expect(extensions.pstnValueFormField.getAttribute('value')).toBe('+1 506-234-5678');
  });

  it('should accept Euro phone number input', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();
    extensions.pstnValueFormField.sendKeys('442071828750\t');

    // Error messages are not displayed
    expect(extensions.errors.count()).toBe(0);

    // Phone input is reformatted
    expect(extensions.pstnValueFormField.getAttribute('value')).toBe('+44 20 7182 8750');
  });

  it('should require SIP value field', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.sipDropdownOption.click();
    extensions.sipValueFormField.click();
    extensions.descriptionFormField.sendKeys('SIP Extension description\t');

    // Add btn remains disabled
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
    extensions.addBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Required field messages displayed
    expect(extensions.errors.get(0).getText()).toBe('Value required');
    expect(extensions.errors.count()).toBe(1);
  });

  // TODO TITAN2-6679 SIP Extension errors from api not shown
  xit('should validate SIP value field', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.sipDropdownOption.click();
    extensions.sipValueFormField.sendKeys('Not valid SIP value');
    extensions.descriptionFormField.sendKeys('SIP Extension description\t');

    // Add btn remains disabled
    expect(extensions.addBtn.isEnabled()).toBeFalsy();
    extensions.addBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    // Required field messages displayed
    expect(extensions.errors.get(0).getText()).toBe('Extensions must start with \'sip:\'.');
    expect(extensions.errors.count()).toBe(1);

    extensions.sipValueFormField.clear();
    extensions.sipValueFormField.sendKeys('sip:\t');
    extensions.addBtn.click().then(function() {
      shared.waitForError();
      expect(extensions.errors.get(0).getText()).toBe('must be a valid sip address');
      expect(extensions.errors.count()).toBe(1);

      // Error removed after editing field
      extensions.sipValueFormField.sendKeys('still not valid');
      expect(extensions.errors.count()).toBe(0);
      extensions.addBtn.click().then(function() {
        shared.waitForError();
        expect(extensions.errors.get(0).getText()).toBe('must be a valid sip address');
        expect(extensions.errors.count()).toBe(1);
      });
    });
  });

  it('should require valid SIP value containing sip:', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.typeDropdown.click();
    extensions.sipDropdownOption.click();
    extensions.sipValueFormField.sendKeys('sip:test@mailinator.com');
    extensions.descriptionFormField.sendKeys('SIP Extension description\t');

    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();

      expect(extensions.userExtensions.count()).toBe(4);
      newExtension = extensions.userExtensions.get(3);
      expect(newExtension.element(by.css('.type-col')).getText()).toContain('SIP');
      expect(newExtension.element(by.css('.provider-col')).getText()).toBe('');
      expect(newExtension.element(by.css('.phone-number-col')).getText()).toBe('sip:test@mailinator.com');
      expect(newExtension.element(by.css('.description-col')).getText()).toBe('SIP Extension description');
      expect(newExtension.element(by.css('.remove')).isDisplayed()).toBeTruthy();
    });
  });

  xit('should only allow one WebRTC-Twilio', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();
    extensionCount = extensions.userExtensions.count();

    extensions.typeDropdown.click();
    extensions.webRtcDropdownOption.click();
    extensions.providerDropdown.click();
    extensions.twilioDropdownOption.click();
    extensions.descriptionFormField.sendKeys('WebRTC Extension description\t');

    extensions.addBtn.click().then(function() {
      shared.waitForError();
      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Error messages displayed
      expect(extensions.errors.get(0).getText()).toBe('Only one Twilio WebRTC extension is allowed.');
      expect(extensions.errors.count()).toBe(1);

      // Fields are not reset
      expect(extensions.typeDropdown.$('option:checked').getText()).toBe('WebRTC');
      expect(extensions.providerDropdown.$('option:checked').getText()).toBe('Twilio');
      expect(extensions.descriptionFormField.getAttribute('value')).toBe('WebRTC Extension description');

      // New extension is no added
      expect(extensions.userExtensions.count()).toBe(extensionCount);
    });
  });

  xit('should allow duplicates of WebRTC-Plivo combination', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();
    extensionCount = extensions.userExtensions.count();

    extensions.typeDropdown.click();
    extensions.webRtcDropdownOption.click();
    extensions.providerDropdown.click();
    extensions.plivoDropdownOption.click();
    extensions.descriptionFormField.sendKeys('WebRTC Plivo Extension description\t');

    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();
      expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
      extensionCount = extensions.userExtensions.count();

      // Add another with same type-provider combination
      extensions.typeDropdown.click();
      extensions.webRtcDropdownOption.click();
      extensions.providerDropdown.click();
      extensions.plivoDropdownOption.click();
      extensions.descriptionFormField.sendKeys('WebRTC Plivo Extension 2 description\t');

      extensions.addBtn.click().then(function() {
        shared.waitForSuccess();
        expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
      });
    });
  });

  // TODO Fails when integration is disabled
  xit('should allow duplicate PSTN extensions', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();
    extensionCount = extensions.userExtensions.count();

    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();

    extensions.pstnValueFormField.sendKeys('15062345678\t');
    extensions.descriptionFormField.sendKeys('PSTN Extension description\t');
    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();
      expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
      extensionCount = extensions.userExtensions.count();

      // Add another PSTN Extension
      extensions.typeDropdown.click();
      extensions.pstnDropdownOption.click();
      extensions.pstnValueFormField.sendKeys('15062345678\t');
      extensions.descriptionFormField.sendKeys('PSTN Extension 2 description\t');
      extensions.addBtn.click().then(function() {
        shared.waitForSuccess();
        expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
      });
    });
  });

  // TODO Fails when integration is disabled
  xit('should allow duplicate SIP extenations', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();
    extensionCount = extensions.userExtensions.count();

    extensions.typeDropdown.click();
    extensions.sipDropdownOption.click();
    extensions.sipValueFormField.sendKeys('sip:test@mailinator.com\t');
    extensions.descriptionFormField.sendKeys('SIP Extension description\t');
    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();
      expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
      extensionCount = extensions.userExtensions.count();

      // Add another SIP extension
      extensions.typeDropdown.click();
      extensions.sipDropdownOption.click();
      extensions.sipValueFormField.sendKeys('sip:test@mailinator.com\t');
      extensions.descriptionFormField.sendKeys('SIP Extension 2 description\t');
      extensions.addBtn.click().then(function() {
        shared.waitForSuccess();
        expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
      });
    });
  });

  // TODO Drag and drop
  xit('should allow order to be altered', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    var originalUserExtensionOrder = [];
    extensions.userExtensions.each().then(function(extensionRow) {
      extensionRow.getText().then(function(extensionRowText) {
        originalUserExtensionOrder.push(extensionRowText);
      });
    }).then(function() {
      // Drag second extension to the bottom
      browser.actions().dragAndDrop(extensions.sortingHandles.get(1), extensions.sortingHandles.get(originalUserExtensionOrder.length - 1)).perform();

      // All other extensions are moved up in order
      expect(extensions.userExtensions.get(0).getText()).toBe(originalUserExtensionOrder[0]);
      for (var i = 1; i < originalUserExtensionOrder.length - 1; i++) {
        expect(extensions.userExtensions.get(i).getText()).toBe(originalUserExtensionOrder[i + 1]);
      }
      expect(extensions.userExtensions.get(originalUserExtensionOrder.length - 1).getText()).toBe(originalUserExtensionOrder[1]);
    });
  });

  xit('should show first in table as primary', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    var firstExtension = extensions.userExtensions.get(0).getText();
    var secondExtension = extensions.userExtensions.get(1).getText();

    // Move second extension to top of table
    browser.actions().dragAndDrop(extensions.sortingHandles.get(1), extensions.sortingHandles.get(0)).perform();

    // The first and second extensions are swapped
    expect(extensions.userExtensions.get(0).getText()).toContain(secondExtension);
    expect(extensions.userExtensions.get(0).getText()).toContain('(primary)');
    expect(firstExtension).toContain(extensions.userExtensions.get(1).getText());
    expect(extensions.userExtensions.get(1).getText()).not.toContain('(primary)');
  });

  xit('should update second extension to primary when the first is removed', function() {
    // TODO After drag and drop; requires order change
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();

    extensions.userExtensions.get(1).getText().then(function(secondExtension) {
      extensions.removeBtns.get(0).click().then(function() {
        shared.waitForSuccess();
        expect(extensions.userExtensions.get(0).getText()).toBe(secondExtension + ' (primary)');
      });
    });
  });

  // TODO Fails when integration is disabled
  xit('should allow all except default WebRTC-Twilio to be removed', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(newUserEmail);
    shared.firstTableRow.click();
    extensions.removeBtns.count().then(function(removableExtensionsCount) {
      expect(extensions.userExtensions.count()).toBe(removableExtensionsCount + 1);

      for (var i = 0; i < removableExtensionsCount; i++) {
        extensions.removeBtns.get(0).click();
        shared.waitForSuccess();
      }
    }).then(function() {
      expect(extensions.removeBtns.count()).toBe(0);
      expect(extensions.userExtensions.count()).toBe(1);
      expect(extensions.webRtcTwilio.isDisplayed()).toBeTruthy();
    })
  });

  it('should allow its own user to add an extension and update profile page', function() {
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();
    extensionCount = extensions.userExtensions.count();

    extensions.typeDropdown.click();
    extensions.pstnDropdownOption.click();

    extensions.pstnValueFormField.sendKeys('15064657894\t');
    extensions.extFormField.sendKeys('12345');

    extensions.descriptionFormField.sendKeys('PSTN Extension description\t');

    extensions.addBtn.click().then(function() {
      shared.waitForSuccess();

      expect(extensions.userExtensions.count()).toBeGreaterThan(extensionCount);
      extensionCount = extensions.userExtensions.count();
      browser.get(shared.profilePageUrl);
      expect(extensions.userExtensions.count()).toBe(extensionCount);
    });
  });

  // TODO Fails when integration is disabled
  xit('should allow its own user to remove an extension and update profile page', function() {
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();
    extensionCount = extensions.userExtensions.count();

    extensions.removeBtns.get(0).click().then(function() {
      shared.waitForSuccess();

      expect(extensions.userExtensions.count()).toBeLessThan(extensionCount);
      extensionCount = extensions.userExtensions.count();
      browser.get(shared.profilePageUrl);
      expect(extensions.userExtensions.count()).toBe(extensionCount);
    });
  });

  xit('should update order on user profile page', function() {
    // Use new user from previous test
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();

    var originalUserExtensionOrder = [];
    extensions.userExtensions.each().then(function(extensionRow) {
      extensionRow.getText().then(function(extensionRowText) {
        originalUserExtensionOrder.push(extensionRowText);
      });
    }).then(function() {
      // Drag second extension to the bottom
      browser.actions().dragAndDrop(extensions.sortingHandles.get(1), extensions.sortingHandles.get(originalUserExtensionOrder.length - 1)).perform();

      // All other extensions are moved up in order
      expect(extensions.userExtensions.get(0).getText()).toBe(originalUserExtensionOrder[0]);
      for (var i = 1; i < originalUserExtensionOrder.length - 1; i++) {
        expect(extensions.userExtensions.get(i).getText()).toBe(originalUserExtensionOrder[i + 1]);
      }
      expect(extensions.userExtensions.get(originalUserExtensionOrder.length - 1).getText()).toBe(originalUserExtensionOrder[1]);
    });
  });
});
