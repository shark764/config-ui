'use strict';

describe('The generic sidebar', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    sidebar = require('./sidebar.po.js');

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should be displayed on the User Management main page and be closed by default', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(sidebar.openArrow.isDisplayed()).toBeTruthy();

    expect(sidebar.tack.isDisplayed()).toBeFalsy();
    expect(sidebar.closeArrow.isDisplayed()).toBeFalsy();
  });

  it('should open on mouse over and close on mouse off', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    expect(sidebar.sidebarMenu.isDisplayed()).toBeTruthy();
    expect(sidebar.tack.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar');

    expect(sidebar.openArrow.isDisplayed()).toBeFalsy();
    expect(sidebar.closeArrow.isDisplayed()).toBeFalsy();

    // Sidebar closes on mouse off
    browser.actions().mouseMove(shared.navBar).perform();
    expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(sidebar.openArrow.isDisplayed()).toBeTruthy();

    expect(sidebar.tack.isDisplayed()).toBeFalsy();
    expect(sidebar.closeArrow.isDisplayed()).toBeFalsy();
  });

  it('should remain open when tack button is selected', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click().then(function() {
      expect(sidebar.sidebarMenu.isDisplayed()).toBeTruthy();
      expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar locked');
      expect(sidebar.closeArrow.isDisplayed()).toBeTruthy();

      expect(sidebar.tack.isDisplayed()).toBeFalsy();

      // Sidebar remains open on mouse off
      browser.actions().mouseMove(shared.navBar).perform();
      expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar locked');
      expect(sidebar.sidebarMenu.isDisplayed()).toBeTruthy();
      expect(sidebar.closeArrow.isDisplayed()).toBeTruthy();

      expect(sidebar.tack.isDisplayed()).toBeFalsy();
    }).then(function() {
      sidebar.closeArrow.click();
    });
  });

  it('should close when unlocked', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click();
    expect(sidebar.sidebarMenu.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar locked');
    expect(sidebar.closeArrow.isDisplayed()).toBeTruthy();

    expect(sidebar.tack.isDisplayed()).toBeFalsy();

    sidebar.closeArrow.click();

    // Unlocked sidebar now closes on mouse off
    browser.actions().mouseMove(shared.navBar).perform();
    expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(sidebar.openArrow.isDisplayed()).toBeTruthy();

    expect(sidebar.tack.isDisplayed()).toBeFalsy();
    expect(sidebar.closeArrow.isDisplayed()).toBeFalsy();
  });

  it('should remain open when locked after page reload', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click();

    sidebar.userLink.click().then(function() {
      expect(shared.navBar.isDisplayed()).toBeTruthy();
      expect(sidebar.sidebar.isDisplayed()).toBeTruthy();

      // Sidebar remains open after page reload
      expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar locked');
      expect(sidebar.sidebarMenu.isDisplayed()).toBeTruthy();
      expect(sidebar.closeArrow.isDisplayed()).toBeTruthy();

      expect(sidebar.tack.isDisplayed()).toBeFalsy();
      expect(sidebar.openArrow.isDisplayed()).toBeFalsy();
    }).then(function() {
      sidebar.closeArrow.click();
    });

  });

  it('overlaps the remaining page components when opened but not locked', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();

    expect(sidebar.mainContent.getAttribute('class')).toBe('ng-scope');
  });

  it('does not overlap remaining page components when locked', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click();

    expect(sidebar.mainContent.getAttribute('class')).toBe('ng-scope expanded-menu');

    // Able to select checkbox from User table; not covered by locked sidebar
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();

    sidebar.closeArrow.click();
  });

  it('should contain User Management page header and links', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click().then(function() {
      expect(sidebar.header.getText()).toBe('Management');

      // User Management page links
      expect(sidebar.userLink.getText()).toBe('Users');
      expect(sidebar.groupsLink.getText()).toBe('Groups');
      expect(sidebar.skillsLink.getText()).toBe('Skills');

    }).then(function() {
      sidebar.closeArrow.click();
    });
  });

  it('should navigate to respective User Management pages when links are selected', function() {
    // Open and lock side bar
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click();

    // Select each link in turn
    sidebar.userLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.usersPageUrl);

    sidebar.groupsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.groupsPageUrl);

    sidebar.skillsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.skillsPageUrl);

    sidebar.closeArrow.click();
  });

  it('should be displayed on the Configuration main page and be closed by default', function() {
    browser.get(shared.tenantsPageUrl);
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(sidebar.openArrow.isDisplayed()).toBeTruthy();

    expect(sidebar.tack.isDisplayed()).toBeFalsy();
    expect(sidebar.closeArrow.isDisplayed()).toBeFalsy();
  });

  it('should contain Configuration page header and links', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click().then(function() {
      expect(sidebar.header.getText()).toBe('Configuration');

      // Configuration page links
      expect(sidebar.tenantsLink.getText()).toBe('Tenants');

    }).then(function() {
      sidebar.closeArrow.click();
    });
  });

  it('should navigate to respective Configuration pages when links are selected', function() {
    // Open and lock side bar
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click();

    // Select each link in turn
    sidebar.tenantsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.tenantsPageUrl);

    sidebar.closeArrow.click();
  });

  it('should be displayed on the Flow Management main page and be closed by default', function() {
    browser.get(shared.flowsPageUrl);

    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.isDisplayed()).toBeTruthy();
    expect(sidebar.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(sidebar.openArrow.isDisplayed()).toBeTruthy();

    expect(sidebar.tack.isDisplayed()).toBeFalsy();
    expect(sidebar.closeArrow.isDisplayed()).toBeFalsy();
  });

  it('should contain Flow Management page header and links', function() {
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click().then(function() {
      expect(sidebar.header.getText()).toBe('Management');

      // Flow Management page links
      expect(sidebar.flowsLink.getText()).toBe('Flows');
      expect(sidebar.queuesLink.getText()).toBe('Queues');
      expect(sidebar.mediaLink.getText()).toBe('Media');

    }).then(function() {
      sidebar.closeArrow.click();
    });
  });

  it('should navigate to respective Flow Management pages when links are selected', function() {
    // Open and lock side bar
    browser.actions().mouseMove(sidebar.sidebarCollapse).perform();
    sidebar.tack.click();

    // Select each link in turn
    sidebar.flowsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.flowsPageUrl);

    sidebar.queuesLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.queuesPageUrl);

    sidebar.mediaLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.mediaPageUrl);

    sidebar.closeArrow.click();
  });
});
