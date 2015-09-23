'use strict';

describe('The table search', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
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
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('123');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('123');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('!@#$%^&()_+`-=');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('!@#$%^&()_+`-=');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('[]\\{}|;\':\",./<>?');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('[]\\{}|;\':\",./<>?');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('éëèẽê');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('éëèẽê');
        });
      };
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
    shared.searchField.sendKeys('T*r');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('t');
          expect(value.toLowerCase()).toContain('r');
          expect(value.toLowerCase()).toMatch(/.*t.*r.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('*t*');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('t');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('*r*');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('r');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('* *');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain(' ');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('*u*');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('u');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('*t*i*t*a*n* *u*s*e*r*');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan user');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should be case insensitive', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.clear();
    shared.searchField.sendKeys('TITAN USER');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan user');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('titan user');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan user');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('tItAn uSeR');
    //expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan user');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display results message and Clear Filters link', function() {
    expect(shared.filteredResultsMessage.isDisplayed()).toBeFalsy();
    expect(shared.clearAllResultsLink.isDisplayed()).toBeFalsy();

    shared.searchField.sendKeys('t\t').then(function() {
      expect(shared.filteredResultsMessage.isDisplayed()).toBeTruthy();
      expect(shared.clearAllResultsLink.isDisplayed()).toBeTruthy();

      shared.filteredResultsMessage.getText().then(function (resultsMessage) {
        var messageWords = resultsMessage.split(' ');
        expect(messageWords[0]).toBe('Showing');
        expect(parseInt(messageWords[1])).toBe(shared.tableElements.count());
        expect(messageWords[2]).toBe('of');
        expect(parseInt(messageWords[3])).toBe(elementCount);
        expect(messageWords[4]).toBe('items');
      });

      expect(shared.clearAllResultsLink.getText()).toBe('(Clear all filters)');

      shared.clearAllResultsLink.click().then(function () {
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

  it('should display Users based on the Search on First and Last Name', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('Titan');
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('tan');
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('tan');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('USER');
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('user');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('Ti*er');
    expect(shared.tableElements.count()).toBeGreaterThan(0);
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
    expect(shared.tableElements.count()).toBeGreaterThan(0);
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

  it('should display current User based on the Search on First Name, Last Name and Email', function() {
    // First name
    shared.searchField.sendKeys(params.login.firstName);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    expect(shared.firstTableRow.getText()).toContain(params.login.firstName);

    // Last name
    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.lastName);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    expect(shared.firstTableRow.getText()).toContain(params.login.lastName);

    // Email
    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.user);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    expect(shared.firstTableRow.getText()).toContain(params.login.user);

    // First, Last
    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.lastName + ' ' + params.login.lastName);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    expect(shared.firstTableRow.getText()).toContain(params.login.lastName + ' ' + params.login.lastName);

    // First, Last, Email
    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.lastName + ' ' + params.login.lastName + ' ' + params.login.user);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    expect(shared.firstTableRow.getText()).toContain(params.login.lastName + ' ' + params.login.lastName + ' ' + params.login.user);

    // Last, Email
    shared.searchField.clear();
    shared.searchField.sendKeys(params.login.lastName + ' ' + params.login.user);
    expect(shared.tableElements.count()).toBeGreaterThan(0);
    expect(shared.firstTableRow.getText()).toContain(params.login.lastName + ' ' + params.login.user);
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
