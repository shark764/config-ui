'use strict';

describe('The User Management sidebar', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    userManagement = require('./userManagement.po.js');

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    browser.get(shared.usersPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should be displayed on the User Management main page and be closed by default', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(userManagement.sidebar.isDisplayed()).toBeTruthy();
    expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(userManagement.sidebarOpenArrow.isDisplayed()).toBeTruthy();

    expect(userManagement.sidebarTack.isDisplayed()).toBeFalsy();
    expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeFalsy();
  });

  it('should open on mouse over and close on mouse off', function() {
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();
    expect(userManagement.sidebarMenu.isDisplayed()).toBeTruthy();
    expect(userManagement.sidebarTack.isDisplayed()).toBeTruthy();
    expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar');

    expect(userManagement.sidebarOpenArrow.isDisplayed()).toBeFalsy();
    expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeFalsy();

    // Sidebar closes on mouse off
    browser.actions().mouseMove(shared.navBar).perform();
    expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(userManagement.sidebarOpenArrow.isDisplayed()).toBeTruthy();

    expect(userManagement.sidebarTack.isDisplayed()).toBeFalsy();
    expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeFalsy();
  });

  it('should remain open when tack button is selected', function() {
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();
    userManagement.sidebarTack.click().then(function() {
      expect(userManagement.sidebarMenu.isDisplayed()).toBeTruthy();
      expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar locked');
      expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeTruthy();

      expect(userManagement.sidebarTack.isDisplayed()).toBeFalsy();

      // Sidebar remains open on mouse off
      browser.actions().mouseMove(shared.navBar).perform();
      expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar locked');
      expect(userManagement.sidebarMenu.isDisplayed()).toBeTruthy();
      expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeTruthy();

      expect(userManagement.sidebarTack.isDisplayed()).toBeFalsy(); // body...
    }).then(function() {
      userManagement.sidebarCloseArrow.click();
    });
  });

  it('should close when unlocked', function() {
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();
    userManagement.sidebarTack.click();
    expect(userManagement.sidebarMenu.isDisplayed()).toBeTruthy();
    expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar locked');
    expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeTruthy();

    expect(userManagement.sidebarTack.isDisplayed()).toBeFalsy();

    userManagement.sidebarCloseArrow.click();

    // Unlocked sidebar now closes on mouse off
    browser.actions().mouseMove(shared.navBar).perform();
    expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar collapsed');
    expect(userManagement.sidebarOpenArrow.isDisplayed()).toBeTruthy();

    expect(userManagement.sidebarTack.isDisplayed()).toBeFalsy();
    expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeFalsy();
  });

  it('should remain open when locked after page reload', function() {
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();
    userManagement.sidebarTack.click();

    browser.get(shared.usersPageUrl).then(function() {
      expect(shared.navBar.isDisplayed()).toBeTruthy();
      expect(userManagement.sidebar.isDisplayed()).toBeTruthy();

      // Sidebar remains open after page reload
      expect(userManagement.sidebar.getAttribute('class')).toBe('side-bar locked');
      expect(userManagement.sidebarMenu.isDisplayed()).toBeTruthy();
      expect(userManagement.sidebarCloseArrow.isDisplayed()).toBeTruthy();

      expect(userManagement.sidebarTack.isDisplayed()).toBeFalsy();
      expect(userManagement.sidebarOpenArrow.isDisplayed()).toBeFalsy();
    }).then(function() {
      userManagement.sidebarCloseArrow.click();
    });
  });

  it('overlaps the remaining page components when opened but not locked', function() {
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();

    expect(userManagement.userList.getAttribute('class')).toBe('user-list-container ng-scope');
  });

  it('does not overlap remaining page components when locked', function() {
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();
    userManagement.sidebarTack.click();

    expect(userManagement.userList.getAttribute('class')).toBe('user-list-container ng-scope expanded-menu');

    // Able to select checkbox from User table; not covered by locked sidebar
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();

    userManagement.sidebarCloseArrow.click();
  });

  it('should contain User Management page header and links', function() {
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();
    userManagement.sidebarTack.click().then(function (){
      expect(userManagement.sidebarHeader.getText()).toBe('Management');

      // User Management page links
      expect(userManagement.sidebarUserLink.getText()).toBe('Users');
      expect(userManagement.sidebarGroupsLink.getText()).toBe('Groups');
      expect(userManagement.sidebarSkillsLink.getText()).toBe('Skills');
      expect(userManagement.sidebarRolesLink.getText()).toBe('Roles');
      //expect(userManagement.sidebarLocationsLink.getText()).toBe('Locations');
      //expect(userManagement.sidebarExtensionsLink.getText()).toBe('Extensions');
    }).then(function () {
      userManagement.sidebarCloseArrow.click();
    });
  });

  it('should navigate to respective page when links are selected', function() {
    // Open and lock side bar
    browser.actions().mouseMove(userManagement.sidebarCollapse).perform();
    userManagement.sidebarTack.click();

    // Select each link in turn
    userManagement.sidebarUserLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.usersPageUrl);

    /* TODO Update expected urls once pages are added
    userManagement.sidebarGroupsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.groupsPageUrl);

    userManagement.sidebarSkillsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.skillsPageUrl);

    userManagement.sidebarRolesLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.rolesPageUrl);

    userManagement.sidebarLocationsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.locationsPageUrl);

    userManagement.sidebarExtensionsLink.click();
    expect(browser.getCurrentUrl()).toBe(shared.extensionsPageUrl);
    */

    userManagement.sidebarCloseArrow.click();
  });
});
