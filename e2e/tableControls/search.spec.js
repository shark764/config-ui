'use strict';

describe('The table search', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    search = require('./search.po.js'),
    users = require('../management/users.po.js'),
    params = browser.params,
    elementCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should display accept letters, numbers and symbols', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('abc');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('abc', rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('123');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('123', rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('!@#$%^&()_+`-=');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('!@#$%^&()_+`-=', rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('[]\\{}|;\':\",./<>?');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('[]\\{}|;\':\",./<>?', rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('éëèẽê');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('éëèẽê', rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should user * as a wildcard character', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('*');
    expect(shared.tableElements.count()).toBe(elementCount);

    shared.searchField.clear();
    shared.searchField.sendKeys('**********');
    expect(shared.tableElements.count()).toBe(elementCount);

    shared.searchField.clear();
    shared.searchField.sendKeys('* *');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(' ', rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should user * as a wildcard character with other letters', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('T*r');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('t', rows);
      search.verifyUserSearch('r', rows);
      search.verifyUserSearchRegex(/.*t.*r.*/, rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('*t*');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('t', rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should be case insensitive', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('TITAN USER');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('titan user', rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('titan user');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('titan user', rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('tItAn uSeR');
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch('titan user', rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display results message and Clear Filters link', function() {
    expect(shared.filteredResultsMessage.isDisplayed()).toBeFalsy();
    expect(shared.clearAllResultsLink.isDisplayed()).toBeFalsy();

    shared.searchField.sendKeys('sta\t').then(function() {
      expect(shared.filteredResultsMessage.isDisplayed()).toBeTruthy();
      expect(shared.clearAllResultsLink.isDisplayed()).toBeTruthy();

      shared.filteredResultsMessage.getText().then(function(resultsMessage) {
        var messageWords = resultsMessage.split(' ');
        expect(messageWords[0]).toBe('Showing');
        expect(parseInt(messageWords[1])).toBe(shared.tableElements.count());
        expect(messageWords[2]).toBe('of');
        expect(parseInt(messageWords[3])).toBe(elementCount);
        expect(messageWords[4]).toBe('items');
      });

      expect(shared.clearAllResultsLink.getText()).toBe('(Clear all filters)');

      shared.clearAllResultsLink.click().then(function() {
        expect(shared.filteredResultsMessage.isDisplayed()).toBeFalsy();
        expect(shared.clearAllResultsLink.isDisplayed()).toBeFalsy();

        // Search field is cleared
        expect(shared.searchField.getAttribute('value')).toBe('');

        expect(shared.tableElements.count()).toBe(elementCount);
      });
    });
  });

  /*
   * USER TABLE SEARCH
   * Search on First Name, Last Name, Email
   */

  it('should display Users based on the Search on First Name', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys(params.login.firstName);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.firstName, rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.firstName.substr(0, 4));
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.firstName.substr(0, 4), rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display Users based on the Search on Last Name', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.lastName);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.lastName, rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display Users based on the Search on First and Last Name', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys(params.login.firstName.substr(0, 4) + '*' + params.login.lastName.split(-4));
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    var regexpSearchTerm = new RegExp('.*' + params.login.firstName.substr(0, 4) + '.*' + params.login.lastName.split(-4) + '.*')
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.firstName.substr(0, 4), rows);
      search.verifyUserSearch(params.login.lastName.split(-4), rows);
      //search.verifyUserSearchRegex(regexpSearchTerm, rows); TODO Can fail from match being combination of names, skills and groups
    });

    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.firstName + ' ' + params.login.lastName, rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.firstName.split(-1) + ' ' + params.login.lastName.substr(0, 1));
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.firstName.split(-1) + ' ' + params.login.lastName.substr(0, 1), rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display current User based on the Search on Email', function() {
    // Email
    shared.searchField.sendKeys(params.login.user);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.user, rows);
    });

    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.user.substr(0, 5));
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.user.substr(0, 5), rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display current User based on the Search on First Name, Last Name and Email', function() {
    // First, Last, Email
    shared.searchField.sendKeys(params.login.firstName + ' ' + params.login.lastName + ' ' + params.login.user);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.firstName + ' ' + params.login.lastName + ' ' + params.login.user, rows);
    });

    // Last, Email
    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.lastName + ' ' + params.login.user);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      search.verifyUserSearch(params.login.lastName + ' ' + params.login.user, rows);
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display current User based on the Search on Users Skill Name', function() {
    // Get current user's Skills
    var userSkillNames = []
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();

    users.userSkills.then(function(userSkillElements) {
      for (var i = 0; i < userSkillElements.length; i++) {
        userSkillElements[i].getText().then(function(skillName) {
          userSkillNames.push(skillName);
        });
      }
    }).then(function() {
      // Search by Skill name
      for (var i = 0; i < userSkillNames.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(userSkillNames[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    }).then(function() {
      if (userSkillNames.length > 0) {
        // Search by skill name case insensitive
        shared.searchField.clear();
        shared.searchField.sendKeys(userSkillNames[0].toLowerCase());
        expect(shared.tableElements.count()).toBeGreaterThan(0);

        shared.searchField.clear();
        shared.searchField.sendKeys(userSkillNames[0].toUpperCase());
        expect(shared.tableElements.count()).toBeGreaterThan(0);

        // Search by partial skill name
        shared.searchField.clear();
        shared.searchField.sendKeys(userSkillNames[0].substr(0, 3));
        expect(shared.tableElements.count()).toBeGreaterThan(0);

        shared.searchField.clear();
        shared.searchField.sendKeys(userSkillNames[0].slice(-3));
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display current User based on the Search on Users Group Name', function() {
    // Get current user's Groups
    var userGroupNames = []
    shared.searchField.sendKeys(params.login.user);
    shared.firstTableRow.click();

    users.userGroups.then(function(userGroupElements) {
      for (var i = 0; i < userGroupElements.length; i++) {
        userGroupElements[i].getText().then(function(groupName) {
          userGroupNames.push(groupName);
        });
      }
    }).then(function() {
      // Search by Group name
      for (var i = 0; i < userGroupNames.length; i++) {
        shared.searchField.clear();
        shared.searchField.sendKeys(userGroupNames[i]);
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    }).then(function() {
      if (userGroupNames.length > 0) {
        // Search by group name case insensitive
        shared.searchField.clear();
        shared.searchField.sendKeys(userGroupNames[0].toLowerCase());
        expect(shared.tableElements.count()).toBeGreaterThan(0);

        shared.searchField.clear();
        shared.searchField.sendKeys(userGroupNames[0].toUpperCase());
        expect(shared.tableElements.count()).toBeGreaterThan(0);

        // Search by partial group name
        shared.searchField.clear();
        shared.searchField.sendKeys(userGroupNames[0].substr(0, 3));
        expect(shared.tableElements.count()).toBeGreaterThan(0);

        shared.searchField.clear();
        shared.searchField.sendKeys(userGroupNames[0].slice(-3));
        expect(shared.tableElements.count()).toBeGreaterThan(0);
      }
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  /*
   * GROUP TABLE SEARCH
   * Search on Name
   */

  it('should display Groups based on the Search on Name', function() {
    browser.get(shared.groupsPageUrl);
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('Gr*p');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('gr');
          expect(value.toLowerCase()).toContain('p');
          expect(value.toLowerCase()).toMatch(/.*gr.*p.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('OU');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ou');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('group');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('group');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('2');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('2');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  /*
   * SKILL TABLE SEARCH
   * Search on Name
   */

  it('should display Skills based on the Search on Name', function() {
    browser.get(shared.skillsPageUrl);
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('Sk*ll');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('sk');
          expect(value.toLowerCase()).toContain('ll');
          expect(value.toLowerCase()).toMatch(/.*sk.*ll.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('ill');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ill');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('french');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('french');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  /*
   * TENANT TABLE SEARCH
   * Search on Name
   */

  it('should display Tenants based on the Search on Name', function() {
    browser.get(shared.tenantsPageUrl);
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('T*ent');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('t');
          expect(value.toLowerCase()).toContain('ent');
          expect(value.toLowerCase()).toMatch(/.*t.*ent.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('Live Ops');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('live ops');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('nent ');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('nent ');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('5');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('5');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  /*
   * FLOW TABLE SEARCH
   * Search on Name
   */

  it('should display Flows based on the Search on Name', function() {
    browser.get(shared.flowsPageUrl);
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('fl*w');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('fl');
          expect(value.toLowerCase()).toContain('w');
          expect(value.toLowerCase()).toMatch(/.*fl.*w.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('new');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('new');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('are');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('are');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('low');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('low');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  /*
   * QUEUE TABLE SEARCH
   * Search on Name
   */

  it('should display Queues based on the Search on Name', function() {
    browser.get(shared.queuesPageUrl);
    elementCount = shared.tableElements.count();
    // TODO

    shared.searchField.sendKeys('Qu*ue');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('qu');
          expect(value.toLowerCase()).toContain('ue');
          expect(value.toLowerCase()).toMatch(/.*qu.*ue.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('ueue');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ueue');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('New Queue');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('new queue');
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

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstUserName) {
            shared.searchField.sendKeys(firstUserName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstUserName);
          });
        }
      });
    });

    it('should result in at least one element in the Skills table', function() {
      browser.get(shared.skillsPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstSkillName) {
            shared.searchField.sendKeys(firstSkillName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstSkillName);
          });
        }
      });
    });

    it('should result in at least one element in the Groups table', function() {
      browser.get(shared.groupsPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstGroupName) {
            shared.searchField.sendKeys(firstGroupName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstGroupName);
          });
        }
      });
    });

    it('should result in at least one element in the Tenants table', function() {
      browser.get(shared.tenantsPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstTenantName) {
            shared.searchField.sendKeys(firstTenantName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstTenantName);
          });
        }
      });
    });

    it('should result in at least one element in the Integrations table', function() {
      browser.get(shared.integrationsPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstIntegrationName) {
            shared.searchField.sendKeys(firstIntegrationName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstIntegrationName);
          });
        }
      });
    });

    it('should result in at least one element in the Flow table', function() {
      browser.get(shared.flowsPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstFlowName) {
            shared.searchField.sendKeys(firstFlowName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstFlowName);
          });
        }
      });
    });

    it('should result in at least one element in the Queue table', function() {
      browser.get(shared.queuesPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstQueueName) {
            shared.searchField.sendKeys(firstQueueName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstQueueName);
          });
        }
      });
    });

    it('should result in at least one element in the Dispatch Mappings table', function() {
      browser.get(shared.dispatchMappingsPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstDispatchMappingName) {
            shared.searchField.sendKeys(firstDispatchMappingName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstDispatchMappingName);
          });
        }
      });
    });

    it('should result in at least one element in the Media Collections table', function() {
      browser.get(shared.mediaCollectionsPageUrl);

      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstMediaCollectionName) {
            shared.searchField.sendKeys(firstMediaCollectionName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstMediaCollectionName);
          });
        }
      });
    });

    it('should result in at least one element in the Media table', function() {
      browser.get(shared.mediaPageUrl);
      shared.tableElements.count().then(function(elementCount) {
        if (elementCount > 0) {
          shared.firstTableRow.element(by.css('td:nth-child(2)')).getText().then(function(firstMediaName) {
            shared.searchField.sendKeys(firstMediaName);
            expect(shared.tableElements.count()).toBeGreaterThan(0);
            expect(shared.firstTableRow.getText()).toContain(firstMediaName);
          });
        }
      });
    });

  });
});
