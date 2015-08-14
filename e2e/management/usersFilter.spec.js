'use strict';

describe('The users table filter', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    users = require('./users.po.js'),
    params = browser.params,
    userQueryText,
    statusFilterText,
    userCount,
    userHasGroup,
    userHasSkill;

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

  it('should display users based on the table Status filter', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDown.all(by.repeater('option in options | orderBy:orderBy track by option[valuePath]')).get(6).click();
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

  it('should display users based on the table Status filter with selection changed selected', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDown.all(by.repeater('option in options | orderBy:orderBy track by option[valuePath]')).get(6).click();
    shared.tableColumnsDropDown.click().then(function() {
      // Select Enabled from Status drop down
      users.statusTableDropDown.click();
      users.dropdownStatuses.get(0).click();
      users.dropdownStatuses.get(0).click();
      users.dropdownStatuses.get(1).click();

      // Enabled input is selected
      expect(users.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

      // Disabled and All inputs are unselected
      expect(users.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(users.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();

      users.statusTableDropDown.click().then(function() {
        shared.tableElements.then(function(rows) {
          for (var i = 0; i < rows.length; ++i) {
            expect(rows[i].getText()).toContain('Enabled');
          };
        });
      });
    });
  });

  it('should display all users based on the table Status filter when All is selected', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDown.all(by.repeater('option in options | orderBy:orderBy track by option[valuePath]')).get(6).click();
    shared.tableColumnsDropDown.click().then(function() {

      // Select Disabled from Status drop down
      users.statusTableDropDown.click();
      users.dropdownStatuses.get(0).click();
      users.dropdownStatuses.get(1).click();
      // All input is unselected
      expect(users.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
      // Disabled and Enabled inputs are selected
      expect(users.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();
      expect(users.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

      // Select All from Status drop down
      users.allUserStatus.click();

      // All input is selected
      expect(users.dropdownStatusInputs.get(0).isSelected()).toBeTruthy();

      // Disabled and Enabled inputs are unselected
      expect(users.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(users.dropdownStatusInputs.get(2).isSelected()).toBeFalsy();

      users.statusTableDropDown.click();
      // Expect all users to be displayed
      expect(shared.tableElements.count()).toBe(userCount);
    });
  });

  xit('should display users based on the Search and Status filters', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDown.all(by.repeater('option in options | orderBy:orderBy track by option[valuePath]')).get(6).click();
    shared.tableColumnsDropDown.click().then(function() {

      // Search
      shared.searchField.sendKeys('a\t');

      // Select Status filter
      users.statusTableDropDown.click(); // Open
      users.dropdownStatuses.get(1).click();
      users.statusTableDropDown.click().then(function() {
        shared.tableElements.then(function(rows) {
          for (var i = 0; i < rows.length; ++i) {
            rows[i].getText().then(function(value) {
              expect(value.toLowerCase()).toContain('a');
            });
            expect(rows[i].getText()).toContain('Enabled');
          };
        });
      }).then(function() {
        // Update Search & add filter options
        shared.searchField.clear();
        shared.searchField.sendKeys('se\t');

        // Select Status filter
        users.statusTableDropDown.click(); // Open
        users.dropdownStatuses.get(0).click();
        users.statusTableDropDown.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              rows[i].getText().then(function(value) {
                expect(value.toLowerCase()).toContain('se');
              });

              element(by.css('tr.ng-scope:nth-child(' + (i + 1) + ') > td:nth-child(7)')).getText().then(function(value) {
                expect(['Enabled', 'Disabled']).toContain(value);
              });
            };
          });
        });
      });
    });
  });

  xit('should display all tenant Groups in the user table Group filter', function() {
    // Select Group from Groups drop down
    users.groupsTableDropDown.click();

    // Get list of Groups
    var groupNameList = [];
    users.dropdownGroups.each(function(groupElement, index) {
      groupElement.getText().then(function(groupName) {
        groupNameList.push(groupName);
      });
    }).then(function() {
      browser.get(shared.groupsPageUrl);

      // Group list from Users page filter dropdown should contain each of the same Group records
      for (var i = 0; i < groupNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(groupNameList[i]);
        expect(shared.tableElements.get(0).getText()).toContain(groupNameList[i]);
      }
    });
  });

  xit('should display users based on the table Group filter', function() {
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

  xit('should display users based on the selected Groups on table filter', function() {
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

  xit('should display users based on the Search and Group filters', function() {
    // Search
    shared.searchField.sendKeys('a');

    // Select Status filter
    users.groupsTableDropDown.click(); // Open
    users.dropdownGroups.get(1).click();
    users.dropdownGroups.get(1).getText().then(function(selectedGroupName) {
      users.groupsTableDropDown.click(); // Close

      userHasGroup = false;
      shared.tableElements.then(function(rows) {
        if (rows > 0) {
          for (var i = 0; i < rows.length; ++i) {
            rows[i].getText().then(function(value) {
              expect(value.toLowerCase()).toContain('a');
            });
            // Select each user and verify that the user is assigned to the filtered group
            shared.tableRows.get(i + 1).click(); // Skip table header row
            users.userGroups.each(function(groupElement, index) {
              groupElement.getText().then(function(groupName) {
                if (groupName == selectedGroupName) {
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
  });

  xit('should display all tenant Skills in the user table Skill filter', function() {
    // Select Skill from Skills drop down
    users.skillsTableDropDown.click();

    // Get list of Skills
    var skillNameList = [];
    users.dropdownSkills.each(function(skillElement, index) {
      skillElement.getText().then(function(skillName) {
        skillNameList.push(skillName);
      });
    }).then(function() {
      browser.get(shared.skillsPageUrl);

      // Skill list from Users page filter dropdown should contain each of the same Skill records
      for (var i = 0; i < skillNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(skillNameList[i]);
        expect(shared.tableElements.get(0).getText()).toContain(skillNameList[i]);
      }
    });
  });

  xit('should display users based on the table Skill filter', function() {
    // Select Skill from Skills drop down
    users.skillsTableDropDown.click();
    users.dropdownSkills.get(0).click();

    users.dropdownSkills.get(0).getText().then(function(selectedSkillName) {
      // All input is unselected
      expect(users.dropdownSkillsInputs.get(1).isSelected()).toBeTruthy();
      expect(users.dropdownSkillsInputs.get(0).isSelected()).toBeFalsy();
      users.skillsTableDropDown.click();

      // Select each user and verify that the user is assigned to the filtered skill
      var userHasSkill = false;
      shared.tableElements.then(function(rows) {
        if (rows.length > 0) {
          for (var i = 1; i <= rows.length; ++i) {
            // Select row
            shared.tableRows.get(i).click(); // Skip table header row
            // Verify user has skill
            users.userSkillTableRows.each(function(currentUserSkill) {
              currentUserSkill.getText().then(function(currentSkill) {
                if (currentSkill.indexOf(selectedSkillName) > -1) {
                  userHasSkill = true;
                }
              });
            });
          };
        } else {
          userHasSkill = true; // No users to check
        }
      }).then(function() {
        expect(userHasSkill).toBeTruthy();
      });
    }).then(function() {
      // Select a different Skill from drop down
      users.skillsTableDropDown.click();
      users.dropdownSkills.get(0).click();
      users.dropdownSkills.get(1).click();

      users.dropdownSkills.get(1).getText().then(function(selectedSkillName) {
        // New input is selected
        expect(users.dropdownSkillsInputs.get(2).isSelected()).toBeTruthy();

        // Previous and All inputs are unselected
        expect(users.dropdownSkillsInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownSkillsInputs.get(0).isSelected()).toBeFalsy();
        users.skillsTableDropDown.click();

        // Select each user and verify that the user is assigned to the filtered skill
        userHasSkill = false;
        shared.tableElements.then(function(rows) {
          if (rows > 0) {
            for (var i = 1; i <= rows.length; ++i) {
              // Select row
              shared.tableRows.get(i).click(); // Skip table header row
              // Verify user has skill
              users.userSkillTableRows.each(function(currentUserSkill) {
                currentUserSkill.getText().then(function(currentSkill) {
                  if (currentSkill.indexOf(selectedSkillName) > -1) {
                    userHasSkill = true;
                  }
                });
              });
            }
          } else {
            userHasSkill = true; // No users to check
          }
        }).then(function() {
          expect(userHasSkill).toBeTruthy();
        });
      }).then(function() {
        // Select All from drop down
        users.skillsTableDropDown.click();
        users.allUserSkills.click();

        // All input is selected
        expect(users.dropdownSkillsInputs.get(0).isSelected()).toBeTruthy();

        // Previous inputs are unselected
        expect(users.dropdownSkillsInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownSkillsInputs.get(2).isSelected()).toBeFalsy();

        users.skillsTableDropDown.click();

        // Expect all users to be displayed
        expect(shared.tableElements.count()).toBe(userCount);
      });
    });
  });

  xit('should display users based on the selected Skills on table filter', function() {
    // Select Skill from Skills drop down
    users.skillsTableDropDown.click();
    users.dropdownSkills.get(0).click();
    users.dropdownSkills.get(1).click();

    var selectedSkills = [];
    for (var i = 0; i < 2; i++) {
      users.dropdownSkills.get(i).getText().then(function(selectedSkillName) {
        selectedSkills.push(selectedSkillName);
      });
    }

    var userHasSkill = false;
    shared.tableElements.then(function(rows) {
      if (rows > 0) {
        for (var i = 1; i <= rows.length; ++i) {
          // Select row
          shared.tableRows.get(i).click(); // Skip table header row
          // Verify user has skill
          users.userSkillTableRows.each(function(currentUserSkill) {
            currentUserSkill.getText().then(function(currentSkill) {
              if (currentSkill.indexOf(selectedSkills[0]) > -1 || currentSkill.indexOf(selectedSkills[1]) > -1) {
                userHasSkill = true;
              }
            });
          });
        }
      } else {
        userHasSkill = true; // no users to check
      }
    }).then(function() {
      expect(userHasSkill).toBeTruthy();
    });
  });

  xit('should display users based on the Search and Skill filters', function() {
    // Search
    shared.searchField.sendKeys('a');

    // Select Status filter
    users.skillsTableDropDown.click(); // Open
    users.dropdownSkills.get(1).click();
    users.dropdownSkills.get(1).getText().then(function(selectedSkillName) {
      users.skillsTableDropDown.click(); // Close

      userHasSkill = false;
      shared.tableElements.then(function(rows) {
        if (rows > 0) {
          for (var i = 0; i < rows.length; ++i) {
            rows[i].getText().then(function(value) {
              expect(value.toLowerCase()).toContain('a');
            });
            // Select each user and verify that the user is assigned to the filtered skill
            shared.tableRows.get(i + 1).click(); // Skip table header row
            users.userSkillTableRows.each(function(currentUserSkill) {
              currentUserSkill.getText().then(function(currentSkill) {
                if (currentSkill.indexOf(selectedSkillName) > -1) {
                  userHasSkill = true;
                }
              });
            });
          }
        } else {
          userHasSkill = true; // no users to check
        }
      }).then(function() {
        expect(userHasSkill).toBeTruthy();
      });
    });
  });
});
