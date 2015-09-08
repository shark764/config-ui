'use strict';

describe('The table filters', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    columns = require('../columns.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    elementCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should display users based on the table Status filter', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownOptions.get(6).click();
    shared.tableColumnsDropDown.click().then(function() {

      // Select Disabled from Status drop down
      users.statusTableDropDown.click();
      users.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(users.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Disabled input is selected
        expect(users.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        users.statusTableDropDown.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(rows[i].getText()).toContain('Disabled');
            };
          });
        });
      });
    });
  });

  it('should display users based on the table Group filter', function() {
    // Select Group from Groups drop down
    users.groupsTableDropDown.click();
    users.dropdownGroups.get(0).click();

    users.dropdownGroups.get(0).getText().then(function(selectedGroupName) {
      // All input is unselected
      expect(users.dropdownGroupsInputs.get(1).isSelected()).toBeTruthy();
      expect(users.dropdownGroupsInputs.get(0).isSelected()).toBeFalsy();
      users.groupsTableDropDown.click();

      // Select each user and verify that the user is assigned to the filtered group
      var userHasGroup = false;
      shared.tableElements.then(function(rows) {
        if (rows.length > 0) {
          for (var i = 1; i <= rows.length; ++i) {
            // Select row
            shared.tableRows.get(i).click();
            // Verify user has group
            users.userGroups.each(function(groupElement, index) {
              groupElement.getText().then(function(groupName) {
                if (groupName == selectedGroupName) {
                  userHasGroup = true;
                }
              });
            });
          };
        } else {
          userHasGroup = true; // No users to check
        }
      }).then(function() {
        expect(userHasGroup).toBeTruthy();
      });
    }).then(function() {
      // Select a different Group from drop down
      users.groupsTableDropDown.click();
      users.dropdownGroups.get(0).click();
      users.dropdownGroups.get(1).click();

      users.dropdownGroups.get(1).getText().then(function(selectedGroupName) {
        // New input is selected
        expect(users.dropdownGroupsInputs.get(2).isSelected()).toBeTruthy();

        // Previous and All inputs are unselected
        expect(users.dropdownGroupsInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownGroupsInputs.get(0).isSelected()).toBeFalsy();
        users.groupsTableDropDown.click();

        // Select each user and verify that the user is assigned to the filtered group
        userHasGroup = false;
        shared.tableElements.then(function(rows) {
          if (rows > 0) {
            for (var i = 1; i <= rows.length; ++i) {
              // Select row
              shared.tableRows.get(i).click(); // Skip table header row
              // Verify user has group
              users.dropdownGroups.each(function(groupElement, index) {
                groupElement.getText().then(function(groupName) {
                  if (groupName == selectedGroupName) {
                    userHasGroup = true;
                  }
                });
              });
            }
          } else {
            userHasGroup = true; // No users to check
          }
        }).then(function() {
          expect(userHasGroup).toBeTruthy();
        });
      }).then(function() {
        // Select All from drop down
        users.groupsTableDropDown.click();
        users.allUserGroups.click();

        // All input is selected
        expect(users.dropdownGroupsInputs.get(0).isSelected()).toBeTruthy();

        // Previous inputs are unselected
        expect(users.dropdownGroupsInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownGroupsInputs.get(2).isSelected()).toBeFalsy();

        users.groupsTableDropDown.click();

        // Expect all users to be displayed
        expect(shared.tableElements.count()).toBe(userCount);
      });
    });
  });

  it('should display users based on the selected Groups on table filter', function() {
    // Select Group from Groups drop down
    users.groupsTableDropDown.click();
    users.dropdownGroups.get(0).click();
    users.dropdownGroups.get(1).click();

    var selectedGroups = [];
    for (var i = 0; i < 2; i++) {
      users.dropdownGroups.get(i).getText().then(function(selectedGroupName) {
        selectedGroups.push(selectedGroupName);
      });
    }

    var userHasGroup = false;
    shared.tableElements.then(function(rows) {
      if (rows > 0) {
        for (var i = 1; i <= rows.length; ++i) {
          // Select row
          shared.tableRows.get(i).click(); // Skip table header row
          // Verify user has group
          users.userGroups.each(function(groupElement, index) {
            groupElement.getText().then(function(groupName) {
              if (groupName == selectedGroups[0] || groupName == selectedGroups[1]) {
                userHasGroup = true;
              }
            });
          });
        }
      } else {
        userHasGroup = true; // no users to check
      }
    }).then(function() {
      expect(userHasGroup).toBeTruthy();
    });
  });

  it('should display Users based on the Search on First and Last Name', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('Titan');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('tan');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('tan');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('USER');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('user');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('Ti*er');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ti');
          expect(value.toLowerCase()).toContain('er');
          expect(value.toLowerCase()).toMatch(/.*ti.*er.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('Titan User');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan user');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('n u');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('n u');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  /*
   * REMAINING PAGES
   */

  describe('when exact element name is input', function() {
    it('should result in at least one element in the User table', function() {
      browser.get(shared.usersPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstUserName) {
        shared.searchField.sendKeys(firstUserName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstUserName);
      });
    });
    it('should result in at least one element in the Skills table', function() {
      browser.get(shared.skillsPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstSkillName) {
        shared.searchField.sendKeys(firstSkillName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstSkillName);
      });
    });

    it('should result in at least one element in the Groups table', function() {
      browser.get(shared.groupsPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstGroupName) {
        shared.searchField.sendKeys(firstGroupName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstGroupName);
      });
    });

    it('should result in at least one element in the Tenants table', function() {
      browser.get(shared.tenantsPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstTenantName) {
        shared.searchField.sendKeys(firstTenantName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstTenantName);
      });
    });

    it('should result in at least one element in the Integrations table', function() {
      browser.get(shared.integrationsPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstIntegrationName) {
        shared.searchField.sendKeys(firstIntegrationName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstIntegrationName);
      });
    });

    it('should result in at least one element in the Flow table', function() {
      browser.get(shared.flowsPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstFlowName) {
        shared.searchField.sendKeys(firstFlowName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstFlowName);
      });
    });

    it('should result in at least one element in the Queue table', function() {
      browser.get(shared.queuesPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstQueueName) {
        shared.searchField.sendKeys(firstQueueName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstQueueName);
      });
    });

    it('should result in at least one element in the Dispatch Mappings table', function() {
      browser.get(shared.dispatchMappingsPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstDispatchMappingName) {
        shared.searchField.sendKeys(firstDispatchMappingName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstDispatchMappingName);
      });
    });

    it('should result in at least one element in the Media Collections table', function() {
      browser.get(shared.mediaCollectionsPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstMediaCollectionName) {
        shared.searchField.sendKeys(firstMediaCollectionName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstMediaCollectionName);
      });
    });

    it('should result in at least one element in the Media table', function() {
      browser.get(shared.mediaPageUrl);
      elementCount = shared.tableElements.count();

      shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstMediaName) {
        shared.searchField.sendKeys(firstMediaName);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
        expect(shared.firstTableRow.getText()).toContain(firstMediaName);
      });
    });

  });
});
