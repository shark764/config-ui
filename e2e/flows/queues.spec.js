'use strict';

describe('The queues view', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    queues = require('./queues.po.js'),
    newQueue = require('./newQueue.po.js'),
    newVersion = require('./newQueueVersion.po.js'),
    params = browser.params,
    queueCount,
    queueVersionCount,
    randomQueue;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.queuesPageUrl);
    queueCount = shared.tableElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include queue management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
    expect(newVersion.newQueueVersionPanel.isDisplayed()).toBeFalsy();
    expect(queues.nameFormField.isDisplayed()).toBeFalsy();
    expect(queues.descriptionFormField.isDisplayed()).toBeFalsy();
    expect(shared.submitFormBtn.isDisplayed()).toBeFalsy();
  });

  it('should display queue details when selected from table', function() {
    shared.firstTableRow.click();

    // Verify queue name in table matches populated field
    expect(shared.firstTableRow.getText()).toContain(queues.nameFormField.getAttribute('value'));
    expect(shared.firstTableRow.getText()).toContain(queues.descriptionFormField.getAttribute('value'));
    expect(shared.firstTableRow.getText()).toContain(queues.activeVersionDropdown.$('option:checked').getText());

    shared.tableElements.count().then(function(numQueues) {
      if (numQueues > 1) {
        shared.secondTableRow.click();
        expect(shared.secondTableRow.getText()).toContain(queues.nameFormField.getAttribute('value'));
        expect(shared.secondTableRow.getText()).toContain(queues.descriptionFormField.getAttribute('value'));
        expect(shared.secondTableRow.getText()).toContain(queues.activeVersionDropdown.$('option:checked').getText());
      }
    });
  });

  it('should require name field when editing a Queue', function() {
    shared.firstTableRow.click();

    // Edit fields
    queues.nameFormField.clear();
    queues.nameFormField.sendKeys('\t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();

    shared.submitFormBtn.click();
    expect(shared.successMessage.isPresent()).toBeFalsy();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
  });

  it('should not require description field when editing a Queue', function() {
    shared.firstTableRow.click();

    // Edit fields
    queues.descriptionFormField.sendKeys('not required');
    queues.descriptionFormField.clear();
    queues.descriptionFormField.sendKeys('\t');

    // Submit button is enabled
    expect(shared.submitFormBtn.isEnabled()).toBeTruthy();

    shared.submitFormBtn.click().then(function() {
      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(queueCount);
    });
  });

  it('should not allow the Queue Version fields to be updated', function() {
    shared.firstTableRow.click();

    queues.queueVersions.count().then(function(queueVersionCount) {
      for (var i = 0; i < queueVersionCount; i++) {
        expect(queues.advancedQueryFormField.get(i).isEnabled()).toBeFalsy();

        expect(queues.minPriorityInputField.get(i).isEnabled()).toBeFalsy();
        expect(queues.maxPriorityInputField.get(i).isEnabled()).toBeFalsy();
        expect(queues.priorityValueInputField.get(i).isEnabled()).toBeFalsy();
        expect(queues.priorityRateInputField.get(i).isEnabled()).toBeFalsy();
        expect(queues.priorityRateUnitField.get(i).isEnabled()).toBeFalsy();
      }
    });
  });

  it('should not accept spaces only as valid field input', function() {
    queueCount = shared.tableElements.count();
    shared.firstTableRow.click();

    queues.nameFormField.clear();
    queues.nameFormField.sendKeys(' \t');

    // Submit button is still disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click();

    expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
    expect(queues.requiredErrors.get(0).getText()).toBe('Field \"Name\" is required.');
    expect(shared.successMessage.isPresent()).toBeFalsy();
  });

  it('should reset fields after editing and selecting Cancel', function() {
    shared.firstTableRow.click();

    queues.activeVersionDropdown.all(by.css('option')).count().then(function(curQueueVersionCount) {
      randomQueue = Math.floor((Math.random() * 1000) + 1);

      var originalName = queues.nameFormField.getAttribute('value');
      var originalDescription = queues.descriptionFormField.getAttribute('value');
      var originalActiveVersion = queues.activeVersionDropdown.$('option:checked').getText();

      // Edit fields
      queues.nameFormField.sendKeys('Edit');
      queues.descriptionFormField.sendKeys('Edit');
      queues.activeVersionDropdown.all(by.css('option')).get(randomQueue % curQueueVersionCount).click();

      shared.cancelFormBtn.click();

      // Warning message is displayed
      shared.waitForAlert();
      shared.dismissChanges();

      expect(shared.successMessage.isPresent()).toBeFalsy();

      // Fields reset to original values
      expect(queues.nameFormField.getAttribute('value')).toBe(originalName);
      expect(queues.descriptionFormField.getAttribute('value')).toBe(originalDescription);
      expect(queues.activeVersionDropdown.$('option:checked').getText()).toBe(originalActiveVersion);
    });
  });

  it('should display all queue versions in Active Version dropdown', function() {
    shared.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).then(function(dropdownVersions) {
      for (var i = 1; i <= dropdownVersions.length; ++i) {
        expect(element(by.id('version-row-v' + i)).getText()).toContain(queues.activeVersionDropdown.all(by.css('option')).get(dropdownVersions.length - i).getText());
      }
    });
  });

  it('should show active version details', function() {
    shared.firstTableRow.click();
    queues.activeVersionDropdown.$('option:checked').getText().then(function(activeVersionNumber) {
      var versionNumber = parseInt(activeVersionNumber.split('v')[1]);

      // Active version details are displayed by default
      var activeVersionRow = element(by.id("version-row-v" + versionNumber));
      var activeVersionDetails = element(by.id("view-version-v" + versionNumber));
      expect(activeVersionDetails.isDisplayed()).toBeTruthy();

      // Row shows that the version is selected and expanded
      expect(activeVersionRow.element(by.css('.fa-circle')).isDisplayed()).toBeTruthy();
      expect(activeVersionRow.element(by.css('.fa-caret-up')).isDisplayed()).toBeTruthy();
      expect(activeVersionRow.element(by.css('.fa-caret-down')).isPresent()).toBeFalsy();

      expect(activeVersionDetails.element(by.id('advanced-query-field')).isEnabled()).toBeFalsy();
      expect(activeVersionDetails.element(by.id('version-min-priority')).isEnabled()).toBeFalsy();
      expect(activeVersionDetails.element(by.id('version-max-priority')).isEnabled()).toBeFalsy();
      expect(activeVersionDetails.element(by.id('version-priority-value')).isEnabled()).toBeFalsy();
      expect(activeVersionDetails.element(by.id('version-priority-rate')).isEnabled()).toBeFalsy();
      expect(activeVersionDetails.element(by.id('version-rate-units-input')).isEnabled()).toBeFalsy();

      expect(activeVersionDetails.element(by.id('advanced-query-field')).getAttribute('value')).not.toBeNull();
      expect(activeVersionDetails.element(by.id('version-min-priority')).getAttribute('value')).not.toBeNull();
      expect(activeVersionDetails.element(by.id('version-max-priority')).getAttribute('value')).not.toBeNull();
      expect(activeVersionDetails.element(by.id('version-priority-value')).getAttribute('value')).not.toBeNull();
      expect(activeVersionDetails.element(by.id('version-priority-rate')).getAttribute('value')).not.toBeNull();
      expect(activeVersionDetails.element(by.id('version-rate-units-input')).getAttribute('value')).not.toBeNull();

      // If the advanced query is not the default value, expect the basic query details to be displayed
      activeVersionDetails.element(by.id('advanced-query-field')).getAttribute('value').then(function(advancedQuery) {
        if (advancedQuery == '{}') {
          expect(activeVersionDetails.element(by.id('version-basic-query-details')).all(by.repeater('operand in operands')).count()).toBe(0);
        } else {
          expect(activeVersionDetails.element(by.id('version-basic-query-details')).all(by.repeater('operand in operands')).count()).toBeGreaterThan(0);
        }
      });

      expect(activeVersionDetails.element(by.id('create-version-copy-btn')).isDisplayed()).toBeTruthy();
      expect(activeVersionDetails.element(by.id('create-version-copy-btn')).isEnabled()).toBeTruthy();
    });
  });

  it('should toggle showing version details when selected', function() {
    shared.firstTableRow.click();

    queues.activeVersionDropdown.$('option:checked').getText().then(function(activeVersion) {
      // Close active version
      element(by.id("version-row-" + activeVersion)).click()
    }).then(function() {
      queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
        var currentVersion;

        // Select each version, details are displayed
        for (var i = 2; i < versionCount; i++) {
          currentVersion = element(by.id("version-row-v" + i));

          // Open version details
          currentVersion.click();
          expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeTruthy();
          expect(currentVersion.element(by.css('.fa-caret-up')).isDisplayed()).toBeTruthy();
          expect(currentVersion.element(by.css('.fa-caret-down')).isPresent()).toBeFalsy();

          // Close version details
          currentVersion.click();
          expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeFalsy();
          expect(currentVersion.element(by.css('.fa-caret-up')).isPresent()).toBeFalsy();
          expect(currentVersion.element(by.css('.fa-caret-down')).isDisplayed()).toBeTruthy();
        }
      });
    });
  });

  it('should toggle showing version details when arrow icon is selected', function() {
    shared.firstTableRow.click();

    queues.activeVersionDropdown.$('option:checked').getText().then(function(activeVersion) {
      // Close active version
      element(by.id("version-row-" + activeVersion)).click()
    }).then(function() {
      queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
        var currentVersion;

        // Select each version, details are displayed
        for (var i = 2; i < versionCount; i++) {
          currentVersion = element(by.id("version-row-v" + i));

          // Open version details
          currentVersion.element(by.css('.fa')).click();
          expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeTruthy();
          expect(currentVersion.element(by.css('.fa-caret-up')).isDisplayed()).toBeTruthy();
          expect(currentVersion.element(by.css('.fa-caret-down')).isPresent()).toBeFalsy();

          // Close version details
          currentVersion.element(by.css('.fa')).click();
          expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeFalsy();
          expect(currentVersion.element(by.css('.fa-caret-up')).isPresent()).toBeFalsy();
          expect(currentVersion.element(by.css('.fa-caret-down')).isDisplayed()).toBeTruthy();
        }
      });
    });
  });

  it('should toggle showing one version details at a time when selected', function() {
    shared.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
      var currentVersion;

      queues.activeVersionDropdown.$('option:checked').getText().then(function(activeVersion) {
        // Close active version
        element(by.id("version-row-" + activeVersion)).click()
      }).then(function() {
        // Only one version is displayed at a time
        // Select first version
        element(by.id("version-row-v1")).click();
        for (var i = 2; i <= versionCount; i++) {
          currentVersion = element(by.id("version-row-v" + i));

          // Open version details
          currentVersion.click();
          expect(element(by.id("view-version-v" + i)).isDisplayed()).toBeTruthy();
          expect(currentVersion.element(by.css('.fa-caret-up')).isDisplayed()).toBeTruthy();
          expect(currentVersion.element(by.css('.fa-caret-down')).isPresent()).toBeFalsy();

          // Previous version is closed
          expect(element(by.id("view-version-v" + (i - 1))).isDisplayed()).toBeFalsy();
          expect(element(by.id("version-row-v" + (i - 1))).element(by.css('.fa-caret-down')).isDisplayed()).toBeTruthy();
          expect(element(by.id("version-row-v" + (i - 1))).element(by.css('.fa-caret-up')).isPresent()).toBeFalsy();
        }
      });
    });
  });

  xit('should display new version panel when add new version is selected', function() {
    // TODO TITAN2-4470
    shared.firstTableRow.click();
    queues.addNewVersionBtn.click();

    expect(newVersion.newQueueVersionPanel.isDisplayed()).toBeTruthy();
    expect(newVersion.createVersionHeader.isDisplayed()).toBeTruthy();
    expect(newVersion.createVersionBtn.isDisplayed()).toBeTruthy();
    expect(newVersion.cancelVersionBtn.isDisplayed()).toBeTruthy();

    // Add Groups & Skills filter
    newQueue.addFilterDropdown.click();
    newQueue.groupFilterDropdownOption.click();
    newQueue.addFilterBtn.click();
    newQueue.addFilterDropdown.click();
    newQueue.skillFilterDropdownOption.click();
    newQueue.addFilterBtn.click();

    expect(newVersion.basicQueryDetailsAll.count()).toBe(0);

    expect(newVersion.minPriorityInputField.getAttribute('value')).toBe(queues.minPriorityDefault);
    expect(newVersion.maxPriorityInputField.getAttribute('value')).toBe(queues.maxPriorityDefault);
    expect(newVersion.priorityValueInputField.getAttribute('value')).toBe(queues.priorityValueDefault);
    expect(newVersion.priorityRateInputField.getAttribute('value')).toBe(queues.priorityRateDefault);
    expect(newVersion.priorityRateUnitField.$('option:checked').getText()).toBe(queues.priorityRateUnitDefault);

    newVersion.showAdvancedQueryLink.click();
    expect(newVersion.advancedQueryFormField.getAttribute('value')).toBe('{}');
  });

  xit('should display copy version panel when copy is selected', function() {
    // TODO TITAN2-4470
    shared.firstTableRow.click();
    queues.activeVersionDropdown.$('option:checked').getAttribute('value').then(function(activeVersionValue) {
      queues.copyVersionBtn.get(activeVersionValue).click();

      expect(newVersion.newQueueVersionPanel.isDisplayed()).toBeTruthy();
      expect(newVersion.createVersionHeader.isDisplayed()).toBeTruthy();
      expect(newVersion.createVersionBtn.isDisplayed()).toBeTruthy();
      expect(newVersion.cancelVersionBtn.isDisplayed()).toBeTruthy();

      // All values are copied from selected version
      var copiedBasicQueryDetails = queues.basicQueryDetails.get(activeVersionValue);
      expect(newVersion.basicQueryDetailsAll.count()).toBe(copiedBasicQueryDetails.all(by.repeater('operand in operands')).count());

      // All groups match
      newVersion.allGroupsSelected.count().then(function(allGroupCount) {
        for (var i = 0; i < allGroupCount; i++) {
          expect(newVersion.allGroupsSelected.get(i).getText()).toBe(queues.basicQueryAllGroupDetails.get(activeVersionValue).all(by.repeater('operand in operands')).get(i).getText());
        }
      });

      // Any groups match
      newVersion.anyGroupsSelected.count().then(function(anyGroupCount) {
        for (var i = 0; i < anyGroupCount; i++) {
          expect(newVersion.anyGroupsSelected.get(i).getText()).toBe(queues.basicQueryAnyGroupDetails.get(activeVersionValue).all(by.repeater('operand in operands')).get(i).getText());
        }
      });

      // All skills match
      newVersion.allSkillsSelected.count().then(function(allSkillCount) {
        for (var i = 0; i < allGroupCount; i++) {
          expect(newVersion.allSkillsSelected.get(i).getText()).toBe(queues.basicQueryAllSkillDetails.get(activeVersionValue).all(by.repeater('operand in operands')).get(i).getText());
        }
      });

      // Any skills match
      newVersion.anySkillsSelected.count().then(function(anySkillCount) {
        for (var i = 0; i < anySkillCount; i++) {
          expect(newVersion.anySkillsSelected.get(i).getText()).toBe(queues.basicQueryAnySkillDetails.get(activeVersionValue).all(by.repeater('operand in operands')).get(i).getText());
        }
      });

      newVersion.showAdvancedQueryLink.click();
      expect(newVersion.advancedQueryFormField.getAttribute('value')).toBe(queues.advancedQueryFormField.get(activeVersionValue).getAttribute('value'));

      expect(newVersion.minPriorityInputField.getAttribute('value')).toBe(queues.minPriorityInputField.get(activeVersionValue).getAttribute('value'));
      expect(newVersion.maxPriorityInputField.getAttribute('value')).toBe(queues.maxPriorityInputField.get(activeVersionValue).getAttribute('value'));
      expect(newVersion.priorityValueInputField.getAttribute('value')).toBe(queues.priorityValueInputField.get(activeVersionValue).getAttribute('value'));
      expect(newVersion.priorityRateInputField.getAttribute('value')).toBe(queues.priorityRateInputField.get(activeVersionValue).getAttribute('value'));
      expect(newVersion.priorityRateUnitField.$('option:checked').getText()).toBe(queues.priorityRateUnitField.get(activeVersionValue).$('option:checked').getText());
    });
  });

  it('should increment version number when adding new version', function() {
    shared.firstTableRow.click();
    queues.addNewVersionBtn.click();

    queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
      expect(newVersion.createVersionHeader.getText()).toBe('Creating New Queue version: v' + (versionCount + 1));
    });
  });

  it('should increment version number when creating from copy', function() {
    shared.firstTableRow.click();
    queues.activeVersionDropdown.$('option:checked').getAttribute('value').then(function(activeVersionValue) {
      queues.copyVersionBtn.get(activeVersionValue).click();

      queues.activeVersionDropdown.all(by.css('option')).count().then(function(versionCount) {
        expect(newVersion.createVersionHeader.getText()).toBe('Creating New Queue version: v' + (versionCount + 1));
      });
    });
  });

  it('should add new queue version from copy', function() {
    shared.firstTableRow.click();
    queues.activeVersionDropdown.$('option:checked').getAttribute('value').then(function(activeVersionValue) {
      queues.copyVersionBtn.get(activeVersionValue).click();

      queues.activeVersionDropdown.all(by.css('option')).count().then(function(originalVersionCount) {
        newVersion.createVersionBtn.click().then(function() {
          expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(originalVersionCount);
          expect(queues.activeVersionDropdown.all(by.css('option')).get(0).getText()).toBe('v' + (originalVersionCount + 1));
          expect(queues.queueVersions.get(0).getText()).toContain('v' + (originalVersionCount + 1));
        });
      });
    });
  });

  it('should require advanced query when adding a new queue version', function() {
    shared.firstTableRow.click();
    queues.activeVersionDropdown.$('option:checked').getAttribute('value').then(function(activeVersionValue) {
      queues.copyVersionBtn.get(activeVersionValue).click();

      newVersion.showAdvancedQueryLink.click();
      newVersion.advancedQueryFormField.clear();
      newVersion.advancedQueryFormField.sendKeys('\t');
      expect(newVersion.createVersionBtn.isEnabled()).toBeFalsy();

      newVersion.createVersionBtn.click();
      expect(shared.successMessage.isPresent()).toBeFalsy();
      expect(queues.requiredErrors.get(0).isDisplayed()).toBeTruthy();
      expect(queues.requiredErrors.get(0).getText()).toBe('Field "Query" is required.');
    });
  });

  it('should not require basic query details when adding a new queue version', function() {
    shared.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(originalVersionCount) {
      queues.addNewVersionBtn.click()
      newVersion.createVersionBtn.click().then(function() {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(originalVersionCount);
        expect(queues.activeVersionDropdown.all(by.css('option')).get(0).getText()).toBe('v' + (originalVersionCount + 1));
        expect(queues.queueVersions.get(0).getText()).toContain('v' + (originalVersionCount + 1));
      });
    });
  });

  xit('should not require basic query details when adding a new queue version from copy', function() {
    // TODO TITAN2-4470
    shared.firstTableRow.click();
    queues.activeVersionDropdown.all(by.css('option')).count().then(function(originalVersionCount) {
      queues.activeVersionDropdown.$('option:checked').getAttribute('value').then(function(activeVersionValue) {
        queues.copyVersionBtn.get(activeVersionValue).click();

        // Remove all query details
        newVersion.basicQueryDetailsAll.count().then(function(basicQueryDetailCount) {
          for (var i = 0; i < basicQueryDetailCount; i++) {
            newVersion.basicQueryDetailsAll.get(0).element(by.css('a')).click();
          }
        }).then(function() {
          newVersion.createVersionBtn.click().then(function() {
            expect(shared.successMessage.isDisplayed()).toBeTruthy();
            expect(queues.activeVersionDropdown.all(by.css('option')).count()).toBeGreaterThan(originalVersionCount);
            expect(queues.activeVersionDropdown.all(by.css('option')).get(0).getText()).toBe('v' + (originalVersionCount + 1));
            expect(queues.queueVersions.get(0).getText()).toContain('v' + (originalVersionCount + 1));
          });
        });
      });
    });
  });

  it('should require priority fields when adding a new queue version', function() {
    shared.firstTableRow.click();
    queues.addNewVersionBtn.click();

    newVersion.minPriorityInputField.clear();
    newVersion.maxPriorityInputField.clear();
    newVersion.priorityValueInputField.clear();
    newVersion.priorityRateInputField.clear();
    newVersion.priorityRateInputField.sendKeys('\t');

    // Submit button is disabled
    expect(shared.submitFormBtn.getAttribute('disabled')).toBeTruthy();
    shared.submitFormBtn.click().then(function() {
      expect(queues.requiredErrors.get(0).getText()).toBe('Please enter a minimum priority');
      expect(queues.requiredErrors.get(1).getText()).toBe('Please enter a maximum priority');
      expect(queues.requiredErrors.get(2).getText()).toBe('Please enter a priority value');
      expect(queues.requiredErrors.get(3).getText()).toBe('Please enter a priority rate');

      expect(shared.tableElements.count()).toBe(queueCount);
      expect(shared.successMessage.isPresent()).toBeFalsy();
    });
  });

  it('should allow advanced query field to be edited after submitting new version with invalid input', function() {
    shared.firstTableRow.click();
    var originalVersionCount = queues.queueVersions.count();

    queues.addNewVersionBtn.click();
    newVersion.showAdvancedQueryLink.click();
    newVersion.advancedQueryFormField.clear();
    newVersion.advancedQueryFormField.sendKeys('Not a valid query');

    newVersion.createVersionBtn.click().then(function() {
      expect(shared.errorMessage.isDisplayed()).toBeTruthy();
      expect(shared.errorMessage.getText()).toContain("Record failed to save");

      // New version is not created
      expect(newVersion.newQueueVersionPanel.isDisplayed()).toBeTruthy();
      expect(queues.queueVersions.count()).toBe(originalVersionCount);
      expect(queues.requiredErrors.get(0).getText()).toContain('invalid query, reason: Value does not match schema:');

      // Edit field
      newVersion.advancedQueryFormField.clear();
      newVersion.advancedQueryFormField.sendKeys('{}\t');
      expect(queues.requiredErrors.count()).toBe(0);

      newVersion.createVersionBtn.click().then(function() {
        shared.waitForSuccess();
        expect(shared.successMessage.isDisplayed()).toBeTruthy();

        // New version is created
        expect(queues.queueVersions.count()).toBeGreaterThan(originalVersionCount);
        expect(newVersion.newQueueVersionPanel.isDisplayed()).toBeFalsy();
      });
    });
  });
});
