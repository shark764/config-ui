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

  /*
   * USER TABLE SEARCH
   * Search on First Name, Last Name
   */

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
   * MEDIA TABLE SEARCH
   * Search on Name
   */

  it('should display Media based on the Search on Name', function() {
    browser.get(shared.mediaPageUrl);
    elementCount = shared.tableElements.count();
    // TODO

    shared.searchField.sendKeys('car');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('car');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('test');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('test');
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('New*ia');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('new');
          expect(value.toLowerCase()).toContain('ia');
          expect(value.toLowerCase()).toMatch(/.*new.*ia.*/);
        });
      };
    });

    shared.searchField.clear();
    shared.searchField.sendKeys('edia');
    shared.tableElements.then(function(rows) {
      for (var i = 0; i < rows.length; ++i) {
        rows[i].getText().then(function(value) {
          expect(value.toLowerCase()).toContain('edia');
        });
      };
    });

    shared.searchField.clear();
    expect(shared.tableElements.count()).toBe(elementCount);
  });
});
