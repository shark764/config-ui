'use strict';

describe('The navbar', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    navbar = require('./navbar.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.rootURL);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should contain logo, Tenant drop down, page links, welcome message, etc', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(shared.siteNavLogo.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavDropdown.isDisplayed()).toBeTruthy();
    expect(shared.usersNavButton.isDisplayed()).toBeTruthy();
    expect(shared.tenantsNavButton.isDisplayed()).toBeTruthy();
    expect(shared.flowsNavButton.isDisplayed()).toBeTruthy();
    expect(shared.reportingNavButton.isDisplayed()).toBeTruthy();
    expect(shared.welcomeMessage.isDisplayed()).toBeTruthy();
  });

  it('should open settings dropdown on click and list links', function() {
    shared.welcomeMessage.click();
    expect(shared.settingsDropdown.isDisplayed()).toBeTruthy();

    expect(shared.userProfileButton.isDisplayed()).toBeTruthy();
    expect(shared.logoutButton.isDisplayed()).toBeTruthy();
  });

  it('should navigate to main page logo is selected', function() {
    shared.siteNavLogo.click();
    expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
  });

  it('should change current Tenant when different tenant drop down is selected', function() {
    shared.tenantsNavDropdown.click();
    shared.tenantsNavDropdown.all(by.repeater('item in items')).then(function(tenants) {
      var randomTenant = Math.floor((Math.random() * tenants.length) + 1);
      element(by.css('#tenant-dropdown > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(' + randomTenant + ')')).getText().then(function(value) {
        expect(value).not.toBe(null);

        element(by.css('#tenant-dropdown > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(' + randomTenant + ')')).click();
        expect(shared.tenantsNavDropdown.getAttribute('label')).toBe(value);

        browser.refresh();
        expect(shared.tenantsNavDropdown.getAttribute('label')).toBe(value);
      });
    });
  });

  it('should show dropdowns with downward arrows on hover', function() {
    // Contains hovering attributes
    expect(navbar.userManagementNavDropdown.getAttribute('hover-tracker')).toContain('hoverTracker');
    expect(navbar.userManagementNavDropdown.getAttribute('hovering')).toContain('hovering');

    // Down arrow class
    expect(navbar.userManagementNavDropdown.getAttribute('collapse-icon')).toContain('fa-caret-down');
  });

  it('should show dropdowns with downward arrows on hover', function() {
    // No arrow displayed by default
    expect(shared.usersNavButton.element(by.id(navbar.downArrow)).isDisplayed()).toBeFalsy();

    // Down arrows displayed on hover
    browser.actions().mouseMove(shared.usersNavButton).perform();
    expect(shared.usersNavButton.element(by.id(navbar.downArrow)).isDisplayed()).toBeTruthy();

    browser.actions().mouseMove(shared.siteNavLogo).perform();
    expect(shared.usersNavButton.element(by.id(navbar.downArrow)).isDisplayed()).toBeTruthy();

    // Down arrow class
    expect(shared.usersNavButton.element(by.id(navbar.downArrow)).getAttribute('class')).toContain('fa-caret-down');
  });

  it('should show dropdowns on hover of each button', function() {
    // No dropdowns displayed by default
    expect(navbar.userManagementDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.configurationDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.flowsDropdown.isDisplayed()).toBeFalsy();

    // User dropdown displayed on hover
    browser.actions().mouseMove(shared.usersNavButton).perform();
    expect(navbar.userManagementDropdown.isDisplayed()).toBeTruthy();
    expect(navbar.configurationDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.flowsDropdown.isDisplayed()).toBeFalsy();

    // Configuration dropdown displayed on hover, user dropdown closes
    browser.actions().mouseMove(shared.tenantsNavButton).perform();
    expect(navbar.userManagementDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.configurationDropdown.isDisplayed()).toBeTruthy();
    expect(navbar.flowsDropdown.isDisplayed()).toBeFalsy();

    // Flows dropdown displayed on hover, tenants dropdown closes
    browser.actions().mouseMove(shared.flowsNavButton).perform();
    expect(navbar.userManagementDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.configurationDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.flowsDropdown.isDisplayed()).toBeTruthy();
  });

  it('should leave dropdowns open on hover off', function() {
    // User dropdown displayed on hover
    browser.actions().mouseMove(shared.usersNavButton).perform();
    expect(navbar.userManagementDropdown.isDisplayed()).toBeTruthy();

    // user dropdown remains open when hovering off
    browser.actions().mouseMove(shared.siteNavLogo).perform();
    expect(navbar.userManagementDropdown.isDisplayed()).toBeTruthy();
  });

  it('should close dropdowns on hover then click', function() {
    // No dropdowns displayed by default
    expect(navbar.userManagementDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.configurationDropdown.isDisplayed()).toBeFalsy();
    expect(navbar.flowsDropdown.isDisplayed()).toBeFalsy();

    // User dropdown displayed on hover
    browser.actions().mouseMove(shared.usersNavButton).perform();
    expect(navbar.userManagementDropdown.isDisplayed()).toBeTruthy();

    shared.usersNavButton.click().then(function() {
      expect(navbar.userManagementDropdown.isDisplayed()).toBeFalsy();
      expect(navbar.configurationDropdown.isDisplayed()).toBeFalsy();
      expect(navbar.flowsDropdown.isDisplayed()).toBeFalsy();
    }).then(function() {
      // Hover off and back, dropdowns open again
      browser.actions().mouseMove(shared.siteNavLogo).perform();
      browser.actions().mouseMove(shared.usersNavButton).perform();
      expect(navbar.userManagementDropdown.isDisplayed()).toBeTruthy();
    });
  });

  describe('User management', function() {
    it('should open user management dropdown on hover and list links', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();

      expect(navbar.userManagementDropdown.isDisplayed()).toBeTruthy();

      expect(navbar.userLink.isDisplayed()).toBeTruthy();
      expect(navbar.skillsLink.isDisplayed()).toBeTruthy();
      expect(navbar.groupsLink.isDisplayed()).toBeTruthy();

      expect(navbar.managementOptions.get(0).getText()).toBe('Users');
      expect(navbar.managementOptions.get(1).getText()).toBe('Roles');
      expect(navbar.managementOptions.get(2).getText()).toBe('Skills');
      expect(navbar.managementOptions.get(3).getText()).toBe('Groups');
    });

    it('should navigate to users page when users link is selected', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      navbar.userLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);
    });

    it('should navigate to roles page when groups link is selected', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      navbar.rolesLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.rolesPageUrl);
    });

    it('should navigate to groups page when groups link is selected', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      navbar.groupsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.groupsPageUrl);
    });

    it('should navigate to skills page when skills link is selected', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      navbar.skillsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.skillsPageUrl);
    });

    it('should open users page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      browser.actions().mouseMove(navbar.userLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.usersPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });

    it('should open roles page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      browser.actions().mouseMove(navbar.rolesLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.rolesPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });

    it('should open groups page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      browser.actions().mouseMove(navbar.groupsLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.groupsPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });

    it('should open skills page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.usersNavButton).perform();
      browser.actions().mouseMove(navbar.skillsLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.skillsPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });
  });

  describe('Configuration', function() {
    it('should open configuration dropdown on click and list links', function() {
      browser.actions().mouseMove(shared.tenantsNavButton).perform();
      expect(navbar.configurationDropdown.isDisplayed()).toBeTruthy();

      expect(navbar.tenantsLink.isDisplayed()).toBeTruthy();
      expect(navbar.integrationsLink.isDisplayed()).toBeTruthy();

      expect(navbar.configurationOptions.get(0).getText()).toBe('Tenants');
      expect(navbar.configurationOptions.get(1).getText()).toBe('Integrations');
    });

    it('should navigate to tenants page when tenants link is selected', function() {
      browser.actions().mouseMove(shared.tenantsNavButton).perform();
      navbar.tenantsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);
    });

    it('should navigate to integrations page when integrations link is selected', function() {
      browser.actions().mouseMove(shared.tenantsNavButton).perform();
      navbar.integrationsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.integrationsPageUrl);
    });

    it('should navigate to lists page when lists link is selected', function() {
      browser.actions().mouseMove(shared.tenantsNavButton).perform();
      navbar.listsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.listsPageUrl);
    });

    it('should open tenants page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.tenantsNavButton).perform();
      browser.actions().mouseMove(navbar.tenantsLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.tenantsPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });

    });

    it('should open integrations page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.tenantsNavButton).perform();
      browser.actions().mouseMove(navbar.integrationsLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.integrationsPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });

    it('should open lists page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.tenantsNavButton).perform();
      browser.actions().mouseMove(navbar.listsLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.listsPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });
  });

  describe('Flows', function() {
    it('should open flows dropdown on click and list links', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      expect(navbar.flowsDropdown.isDisplayed()).toBeTruthy();

      expect(navbar.flowsLink.isDisplayed()).toBeTruthy();
      expect(navbar.queuesLink.isDisplayed()).toBeTruthy();
      expect(navbar.mediaLink.isDisplayed()).toBeTruthy();
      expect(navbar.dispatchMappingsLink.isDisplayed()).toBeTruthy();

      expect(navbar.flowsOptions.get(0).getText()).toBe('Flows');
      expect(navbar.flowsOptions.get(1).getText()).toBe('Queues');
      expect(navbar.flowsOptions.get(2).getText()).toBe('Media Collections');
      expect(navbar.flowsOptions.get(3).getText()).toBe('Media');
      expect(navbar.flowsOptions.get(4).getText()).toBe('Dispatch Mappings');
    });

    it('should navigate to flows page when flows link is selected', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      navbar.flowsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.flowsPageUrl);
    });

    it('should navigate to queues page when queues link is selected', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      navbar.queuesLink.click().then(function() {
        expect(browser.getCurrentUrl()).toContain(shared.queuesPageUrl);
      });
    });

    it('should navigate to media page when flows link is selected', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      navbar.mediaLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.mediaPageUrl);
    });

    it('should navigate to dispatch mappings page when dispatch mappings link is selected', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      navbar.dispatchMappingsLink.click();
      expect(browser.getCurrentUrl()).toContain(shared.dispatchMappingsPageUrl);
    });

    it('should open flows page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      browser.actions().mouseMove(navbar.flowsLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.flowsPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });

    it('should open queues page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      browser.actions().mouseMove(navbar.queuesLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.queuesPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });

    it('should open media page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      browser.actions().mouseMove(navbar.mediaLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.mediaPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });

    it('should open dispatch mappings page in new tab when link is right clicked', function() {
      browser.actions().mouseMove(shared.flowsNavButton).perform();
      browser.actions().mouseMove(navbar.dispatchMappingsLink).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
        // Wait for new tab to open
        browser.driver.wait(function() {
          return browser.getAllWindowHandles().then(function(handles) {
            return handles.length === 2;
          });
        }, 5000);

        browser.getAllWindowHandles().then(function(handles) {
          browser.switchTo().window(handles[1]).then(function() {
            expect(browser.getCurrentUrl()).toBe(shared.dispatchMappingsPageUrl);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
          });
        });
      });
    });
  });

  it('should navigate to correct page when settings dropdown buttons are selected', function() {
    shared.welcomeMessage.click();
    shared.userProfileButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.profilePageUrl);

    shared.welcomeMessage.click();
    shared.logoutButton.click();
    expect(browser.getCurrentUrl()).toBe(shared.loginPageUrl);
  });
});
