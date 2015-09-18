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
    shared.tableColumnsDropDownOptions.get(7).click();
    expect(shared.tableColumnsDropDownInputs.get(7).isSelected()).toBeTruthy();
    shared.tableColumnsDropDown.click().then(function() {

      // Select Disabled from Status drop down
      users.statusTableDropDownLabel.click();
      users.dropdownStatuses.get(0).click().then(function() {
        // All input is unselected
        expect(users.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
        // Disabled input is selected
        expect(users.dropdownStatusInputs.get(1).isSelected()).toBeTruthy();

        shared.tableElements.then(function(rows) {
          for (var i = 0; i < rows.length; ++i) {
            expect(rows[i].getText()).toContain('Disabled');
          };
        });
      });
    });
  });

  it('should display users based on the table Status filter with selection changed selected', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownOptions.get(7).click();
    expect(shared.tableColumnsDropDownInputs.get(7).isSelected()).toBeTruthy();
    shared.tableColumnsDropDown.click().then(function() {

      // Select Enabled from Status drop down
      users.statusTableDropDownLabel.click();
      users.dropdownStatuses.get(0).click();
      users.dropdownStatuses.get(0).click(); // Change selection
      users.dropdownStatuses.get(1).click();

      // Enabled input is selected
      expect(users.dropdownStatusInputs.get(2).isSelected()).toBeTruthy();

      // Disabled and All inputs are unselected
      expect(users.dropdownStatusInputs.get(0).isSelected()).toBeFalsy();
      expect(users.dropdownStatusInputs.get(1).isSelected()).toBeFalsy();
      expect(users.dropdownStatusInputs.get(3).isSelected()).toBeFalsy();

      users.statusTableDropDownLabel.click().then(function() {
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
    shared.tableColumnsDropDownOptions.get(7).click();
    expect(shared.tableColumnsDropDownInputs.get(7).isSelected()).toBeTruthy();
    shared.tableColumnsDropDown.click().then(function() {

      // Select Disabled from Status drop down
      users.statusTableDropDownLabel.click();
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

      users.statusTableDropDownLabel.click();
      // Expect all users to be displayed
      expect(shared.tableElements.count()).toBe(userCount);
    });
  });

  it('should display users based on the Search and Status filters', function() {
    // Add Status Column
    shared.tableColumnsDropDown.click();
    shared.tableColumnsDropDownOptions.get(7).click();
    shared.tableColumnsDropDown.click().then(function() {

      // Search
      shared.searchField.sendKeys('a\t');

      // Select Status filter
      users.statusTableDropDownLabel.click(); // Open
      users.dropdownStatuses.get(1).click();
      users.statusTableDropDownLabel.click().then(function() {
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
        users.statusTableDropDownLabel.click(); // Open
        users.dropdownStatuses.get(0).click();
        users.statusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              rows[i].getText().then(function(value) {
                expect(value.toLowerCase()).toContain('se');
              });
              expect(['Enabled', 'Disabled']).toContain(shared.tableElements.get(i).element(by.css('td:nth-child(8)')).getText());
            };
          });
        });
      });
    });
  });

  it('should display all tenant Groups in the user table Group filter', function() {
    // Select Group from Groups drop down
    users.groupsTableDropDownLabel.click();

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
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });
  });

  it('should display users based on the table Group filter', function() {
    // Select Group from Groups drop down
    users.groupsTableDropDownLabel.click();
    users.dropdownGroups.get(0).click();

    users.dropdownGroups.get(0).getText().then(function(selectedGroupName) {
      // All input is unselected
      expect(users.dropdownGroupsInputs.get(1).isSelected()).toBeTruthy();
      expect(users.dropdownGroupsInputs.get(0).isSelected()).toBeFalsy();
      users.groupsTableDropDownLabel.click();

      // Select each user and verify that the user is assigned to the filtered group
      var userHasGroup;
      shared.tableElements.then(function(rows) {
        if (rows.length > 0) {
          for (var i = 0; i < rows.length; ++i) {
            userHasGroup = false;
            // Select row
            shared.tableRows.get(i).click();
            // Verify user has group
            users.userGroups.each(function(groupElement, index) {
              groupElement.getText().then(function(groupName) {
                if (groupName == selectedGroupName) {
                  userHasGroup = true;
                }
              });
            }).then(function() {
              expect(userHasGroup).toBeTruthy();
            });
          }
        }
      }).then(function() {
        // Select All from drop down
        users.groupsTableDropDownLabel.click();
        users.allUserGroups.click();

        // All input is selected
        expect(users.dropdownGroupsInputs.get(0).isSelected()).toBeTruthy();

        // Previous inputs are unselected
        expect(users.dropdownGroupsInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownGroupsInputs.get(2).isSelected()).toBeFalsy();

        users.groupsTableDropDownLabel.click();

        // Expect all users to be displayed
        expect(shared.tableElements.count()).toBe(userCount);
      });
    });
  });

  it('should display users based on the selected Groups on table filter', function() {
    // Select Group from Groups drop down
    users.groupsTableDropDownLabel.click();
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

  it('should display users based on the Search and Group filters', function() {
    // Search
    shared.searchField.sendKeys('a');

    // Select Groups filter
    users.groupsTableDropDownLabel.click(); // Open
    users.dropdownGroups.get(1).click();
    users.dropdownGroups.get(1).getText().then(function(selectedGroupName) {
      users.groupsTableDropDownLabel.click(); // Close

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

  it('should display all tenant Skills in the user table Skill filter', function() {
    // Select Skill from Skills drop down
    users.skillsTableDropDownLabel.click();

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
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });
  });

  it('should display users based on the table Skill filter', function() {
    // Select Skill from Skills drop down
    users.skillsTableDropDownLabel.click();
    users.dropdownSkills.get(0).click();

    users.dropdownSkills.get(0).getText().then(function(selectedSkillName) {
      // All input is unselected
      expect(users.dropdownSkillsInputs.get(1).isSelected()).toBeTruthy();
      expect(users.dropdownSkillsInputs.get(0).isSelected()).toBeFalsy();
      users.skillsTableDropDownLabel.click();

      // Select each user and verify that the user is assigned to the filtered skill
      var userHasSkill;
      shared.tableElements.then(function(rows) {
        if (rows.length > 0) {
          for (var i = 0; i < rows.length; ++i) {
            userHasSkill = false

            // Select row
            shared.tableRows.get(i).click(); // Skip table header row
            // Verify user has skill
            users.userSkillTableRows.each(function(currentUserSkill) {
              currentUserSkill.getText().then(function(currentSkill) {
                if (currentSkill.indexOf(selectedSkillName) > -1) {
                  userHasSkill = true;
                }
              });
            }).then(function() {
              expect(userHasSkill).toBeTruthy();
            });
          }
        }
      });
    }).then(function() {
      // Select a different Skill from drop down
      users.skillsTableDropDownLabel.click();
      users.dropdownSkills.get(0).click();
      users.dropdownSkills.get(1).click();

      users.dropdownSkills.get(1).getText().then(function(selectedSkillName) {
        // New input is selected
        expect(users.dropdownSkillsInputs.get(2).isSelected()).toBeTruthy();

        // Previous and All inputs are unselected
        expect(users.dropdownSkillsInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownSkillsInputs.get(0).isSelected()).toBeFalsy();
        users.skillsTableDropDownLabel.click();

        // Select each user and verify that the user is assigned to the filtered skill
        shared.tableElements.then(function(rows) {
          if (rows > 0) {
            for (var i = 1; i <= rows.length; ++i) {
              userHasSkill = false

              // Select row
              shared.tableRows.get(i).click(); // Skip table header row
              // Verify user has skill
              users.userSkillTableRows.each(function(currentUserSkill) {
                currentUserSkill.getText().then(function(currentSkill) {
                  if (currentSkill.indexOf(selectedSkillName) > -1) {
                    userHasSkill = true;
                  }
                });
              }).then(function() {
                expect(userHasSkill).toBeTruthy();
              });
            }
          }
        });
      }).then(function() {
        // Select All from drop down
        users.skillsTableDropDownLabel.click();
        users.allUserSkills.click();

        // All input is selected
        expect(users.dropdownSkillsInputs.get(0).isSelected()).toBeTruthy();

        // Previous inputs are unselected
        expect(users.dropdownSkillsInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownSkillsInputs.get(2).isSelected()).toBeFalsy();

        users.skillsTableDropDownLabel.click();

        // Expect all users to be displayed
        expect(shared.tableElements.count()).toBe(userCount);
      });
    });
  });

  it('should display users based on the selected Skills on table filter', function() {
    // Select Skill from Skills drop down
    users.skillsTableDropDownLabel.click();
    users.dropdownSkills.get(0).click();
    users.dropdownSkills.get(1).click();

    var selectedSkills = [];
    for (var i = 0; i < 2; i++) {
      users.dropdownSkills.get(i).getText().then(function(selectedSkillName) {
        selectedSkills.push(selectedSkillName);
      });
    }

    var userHasSkill;
    shared.tableElements.then(function(rows) {
      if (rows > 0) {
        for (var i = 1; i <= rows.length; ++i) {
          userHasSkill = false;

          // Select row
          shared.tableRows.get(i).click(); // Skip table header row
          // Verify user has skill
          users.userSkillTableRows.each(function(currentUserSkill) {
            currentUserSkill.getText().then(function(currentSkill) {
              if (currentSkill.indexOf(selectedSkills[0]) > -1 || currentSkill.indexOf(selectedSkills[1]) > -1) {
                userHasSkill = true;
              }
            });
          }).then(function() {
            expect(userHasSkill).toBeTruthy();
          });
        }
      }
    });
  });

  it('should display users based on the Search and Skill filters', function() {
    // Search
    shared.searchField.sendKeys('a');

    // Select Status filter
    users.skillsTableDropDownLabel.click(); // Open
    users.dropdownSkills.get(1).click();
    users.dropdownSkills.get(1).getText().then(function(selectedSkillName) {
      users.skillsTableDropDownLabel.click(); // Close

      shared.tableElements.then(function(rows) {
        if (rows > 0) {
          for (var i = 0; i < rows.length; ++i) {
            userHasSkill = false;

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
            }).then(function() {
              expect(userHasSkill).toBeTruthy();
            });
          }
        }
      });
    });
  });

  it('should display all of the user Role options', function() {
    // Select Roles from drop down
    users.rolesTableDropDownLabel.click();

    // Get list of Roles
    var roleNameList = [];
    users.dropdownRoles.each(function(roleElement, index) {
      roleElement.getText().then(function(roleName) {
        roleNameList.push(roleName);
      });
    }).then(function() {
      browser.get(shared.rolesPageUrl);

      // Role list from Users page filter dropdown should contain each of the same Role records
      for (var i = 0; i < roleNameList.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(roleNameList[i]);
        expect(shared.tableElements.get(0).getText()).toContain(roleNameList[i]);
      }
    });
  });


  it('should display users based on the table Roles filter', function() {
    users.rolesTableDropDownLabel.click();

    // Select Administrator from Role drop down
    users.dropdownRoles.get(0).click().then(function() {
      // All input is unselected
      expect(users.dropdownRolesInputs.get(0).isSelected()).toBeFalsy();
      // Administrator input is selected
      expect(users.dropdownRolesInputs.get(1).isSelected()).toBeTruthy();

      users.rolesTableDropDownLabel.click().then(function() {
        shared.tableElements.then(function(rows) {
          for (var i = 0; i < rows.length; ++i) {
            expect(rows[i].getText()).toContain('Administrator');
          };
        });
      });
    }).then(function() {
      users.rolesTableDropDownLabel.click();

      // Select Supervisor from Role drop down
      users.dropdownRoles.get(2).click().then(function() {

        // All input is unselected
        expect(users.dropdownRolesInputs.get(0).isSelected()).toBeFalsy();
        // Administrator and Supervisor inputs are selected
        expect(users.dropdownRolesInputs.get(1).isSelected()).toBeTruthy();
        expect(users.dropdownRolesInputs.get(3).isSelected()).toBeTruthy();

        users.rolesTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(['Administrator', 'Supervisor']).toContain(rows[i].element(by.css(users.rolesColumn)).getText());
            };
          });
        });
      });
    }).thenFinally(function() {
      users.rolesTableDropDownLabel.click();

      // Select All from drop down
      users.allUserRole.click().then(function() {

        // All input is selected
        expect(users.dropdownRolesInputs.get(0).isSelected()).toBeTruthy();

        // Administrator and Supervisor inputs are unselected
        expect(users.dropdownRolesInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownRolesInputs.get(3).isSelected()).toBeFalsy();

        users.rolesTableDropDownLabel.click().then(function() {
          expect(shared.tableElements.count()).toBe(userCount)
        });
      });
    });
  });

  it('should display all of the Presence options', function() {
    users.presenceTableDropDownLabel.click();

    // All presence listed
    expect(users.dropdownPresence.get(0).getText()).toBe('Busy');
    expect(users.dropdownPresence.get(1).getText()).toBe('Ready');
    expect(users.dropdownPresence.get(2).getText()).toBe('Not Ready');
    expect(users.dropdownPresence.get(3).getText()).toBe('Allocated');
    expect(users.dropdownPresence.get(4).getText()).toBe('Offline');

    // All input is selected by default
    expect(users.dropdownPresenceInputs.get(0).isSelected()).toBeTruthy();
    // Remaining inputs are unselected by default
    expect(users.dropdownPresenceInputs.get(1).isSelected()).toBeFalsy();
    expect(users.dropdownPresenceInputs.get(2).isSelected()).toBeFalsy();
    expect(users.dropdownPresenceInputs.get(3).isSelected()).toBeFalsy();
    expect(users.dropdownPresenceInputs.get(4).isSelected()).toBeFalsy();
    expect(users.dropdownPresenceInputs.get(5).isSelected()).toBeFalsy();
  });

  it('should display users based on the table Presence filter', function() {
    users.presenceTableDropDownLabel.click();

    // Select Busy from drop down
    users.dropdownPresence.get(0).click().then(function() {
      // All input is unselected
      expect(users.dropdownPresenceInputs.get(0).isSelected()).toBeFalsy();
      // Busy input is selected
      expect(users.dropdownPresenceInputs.get(1).isSelected()).toBeTruthy();

      users.presenceTableDropDownLabel.click().then(function() {
        shared.tableElements.then(function(rows) {
          for (var i = 0; i < rows.length; ++i) {
            expect(rows[i].getText()).toContain('Busy');
          };
        });
      });
    }).then(function() {
      users.presenceTableDropDownLabel.click();

      // Select Offline from drop down
      users.dropdownPresence.get(4).click().then(function() {

        // All input is unselected
        expect(users.dropdownPresenceInputs.get(0).isSelected()).toBeFalsy();
        // Busy and Offline inputs are selected
        expect(users.dropdownPresenceInputs.get(1).isSelected()).toBeTruthy();
        expect(users.dropdownPresenceInputs.get(5).isSelected()).toBeTruthy();

        users.presenceTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(['Busy', 'Offline']).toContain(rows[i].element(by.css(users.presenceColumn)).getText());
            };
          });
        });
      });
    }).thenFinally(function() {
      users.presenceTableDropDownLabel.click();

      // Select All from drop down
      users.allUserPresence.click().then(function() {

        // All input is selected
        expect(users.dropdownPresenceInputs.get(0).isSelected()).toBeTruthy();

        // Busy and Offline inputs are unselected
        expect(users.dropdownPresenceInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownPresenceInputs.get(5).isSelected()).toBeFalsy();

        users.presenceTableDropDownLabel.click().then(function() {
          expect(shared.tableElements.count()).toBe(userCount)
        });
      });
    });
  });

  it('should display all of the Tenant Status options', function() {
    users.tenantStatusTableDropDownLabel.click();

    // All tenantStatus listed
    expect(users.dropdownTenantStatuses.get(0).getText()).toBe('Disabled');
    expect(users.dropdownTenantStatuses.get(1).getText()).toBe('Expired Invitation');
    expect(users.dropdownTenantStatuses.get(2).getText()).toBe('Pending Invitation');
    expect(users.dropdownTenantStatuses.get(3).getText()).toBe('Accepted');
    expect(users.dropdownTenantStatuses.get(4).getText()).toBe('Pending Acceptance');
    expect(users.dropdownTenantStatuses.get(5).getText()).toBe('Removed');

    // All input is selected by default
    expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeTruthy();
    // Remaining inputs are unselected by default
    expect(users.dropdownTenantStatusInputs.get(1).isSelected()).toBeFalsy();
    expect(users.dropdownTenantStatusInputs.get(2).isSelected()).toBeFalsy();
    expect(users.dropdownTenantStatusInputs.get(3).isSelected()).toBeFalsy();
    expect(users.dropdownTenantStatusInputs.get(4).isSelected()).toBeFalsy();
    expect(users.dropdownTenantStatusInputs.get(5).isSelected()).toBeFalsy();
    expect(users.dropdownTenantStatusInputs.get(6).isSelected()).toBeFalsy();
  });

  it('should display users based on the table Tenant Status filter', function() {
    users.tenantStatusTableDropDownLabel.click();

    // Select Busy from drop down
    users.dropdownTenantStatuses.get(0).click().then(function() {
      // All input is unselected
      expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeFalsy();
      // Disabled input is selected
      expect(users.dropdownTenantStatusInputs.get(1).isSelected()).toBeTruthy();

      users.tenantStatusTableDropDownLabel.click().then(function() {
        shared.tableElements.then(function(rows) {
          for (var i = 0; i < rows.length; ++i) {
            expect(rows[i].getText()).toContain('Busy');
          };
        });
      });
    }).then(function() {
      users.tenantStatusTableDropDownLabel.click();

      // Select Pending Acceptance from drop down
      users.dropdownTenantStatuses.get(4).click().then(function() {

        // All input is unselected
        expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeFalsy();
        // Disabled and Pending Acceptance inputs are selected
        expect(users.dropdownTenantStatusInputs.get(1).isSelected()).toBeTruthy();
        expect(users.dropdownTenantStatusInputs.get(5).isSelected()).toBeTruthy();

        users.tenantStatusTableDropDownLabel.click().then(function() {
          shared.tableElements.then(function(rows) {
            for (var i = 0; i < rows.length; ++i) {
              expect(['Pending Acceptance', 'Disabled']).toContain(rows[i].element(by.css(users.tenantStatusColumn)).getText());
            };
          });
        });
      });
    }).thenFinally(function() {
      users.tenantStatusTableDropDownLabel.click();

      // Select All from drop down
      users.allUserTenantStatus.click().then(function() {

        // All input is selected
        expect(users.dropdownTenantStatusInputs.get(0).isSelected()).toBeTruthy();

        // Disabled and Pending Acceptance inputs are unselected
        expect(users.dropdownTenantStatusInputs.get(1).isSelected()).toBeFalsy();
        expect(users.dropdownTenantStatusInputs.get(5).isSelected()).toBeFalsy();

        users.tenantStatusTableDropDownLabel.click().then(function() {
          expect(shared.tableElements.count()).toBe(userCount)
        });
      });
    });
  });

});
