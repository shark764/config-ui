'use strict';

describe('The table search', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    elementCount;

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  afterAll(function() {
    shared.tearDown();
  });

  /*
   * USER TABLE SEARCH
   * Search on First Name, Last Name, Skills, Groups
   */

  it('should display Users based on the Search on First and Last Name', function() {
    elementCount = shared.tableElements.count();

    shared.searchField.sendKeys('Titan');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('titan');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('tan');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('tan');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('USER');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('user');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('Ti*er');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ti');
          expect(value.toLowerCase()).toContain('er');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display Users based on the Search on Group Name', function() {
    elementCount = shared.tableElements.count();
    // TODO

    shared.searchField.clear();
    shared.searchField.sendKeys('Ti*er');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ti');
          expect(value.toLowerCase()).toContain('er');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });

  it('should display Users based on the Search on Skill Name', function() {
    elementCount = shared.tableElements.count();
    // TODO

    shared.searchField.clear();
    shared.searchField.sendKeys('Ti*er');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('ti');
          expect(value.toLowerCase()).toContain('er');
        });
      };
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
     // TODO

     shared.searchField.clear();
     shared.searchField.sendKeys('Ti*er');
     shared.tableElements.then(function(rows) {
       for (var i = 0; i < rows.length; ++i) {
         rows[i].getText().then(function(value) {
           expect(value.toLowerCase()).toContain('ti');
           expect(value.toLowerCase()).toContain('er');
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
     // TODO

     shared.searchField.clear();
     shared.searchField.sendKeys('Ti*er');
     shared.tableElements.then(function(rows) {
       for (var i = 0; i < rows.length; ++i) {
         rows[i].getText().then(function(value) {
           expect(value.toLowerCase()).toContain('ti');
           expect(value.toLowerCase()).toContain('er');
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
     // TODO

     shared.searchField.clear();
     shared.searchField.sendKeys('Ti*er');
     shared.tableElements.then(function(rows) {
       for (var i = 0; i < rows.length; ++i) {
         rows[i].getText().then(function(value) {
           expect(value.toLowerCase()).toContain('ti');
           expect(value.toLowerCase()).toContain('er');
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
     // TODO

     shared.searchField.clear();
     shared.searchField.sendKeys('Ti*er');
     shared.tableElements.then(function(rows) {
       for (var i = 0; i < rows.length; ++i) {
         rows[i].getText().then(function(value) {
           expect(value.toLowerCase()).toContain('ti');
           expect(value.toLowerCase()).toContain('er');
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

     shared.searchField.clear();
     shared.searchField.sendKeys('Ti*er');
     shared.tableElements.then(function(rows) {
       for (var i = 0; i < rows.length; ++i) {
         rows[i].getText().then(function(value) {
           expect(value.toLowerCase()).toContain('ti');
           expect(value.toLowerCase()).toContain('er');
         });
       };
     });

     shared.searchField.clear();
     expect(shared.tableElements.count()).toBe(elementCount);
   });

  /*
   * MEDIA TABLE SEARCH
   * Search on Name
   */

   it('should display Media based on the Search on Name', function() {
     browser.get(shared.mediaPageUrl);
     elementCount = shared.tableElements.count();
     // TODO

     shared.searchField.clear();
     shared.searchField.sendKeys('Ti*er');
     shared.tableElements.then(function(rows) {
       for (var i = 0; i < rows.length; ++i) {
         rows[i].getText().then(function(value) {
           expect(value.toLowerCase()).toContain('ti');
           expect(value.toLowerCase()).toContain('er');
         });
       };
     });

     shared.searchField.clear();
     expect(shared.tableElements.count()).toBe(elementCount);
   });
});
