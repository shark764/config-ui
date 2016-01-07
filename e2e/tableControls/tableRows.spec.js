'use strict';

describe('The table rows', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    search = require('./search.po.js'),
    users = require('../management/users.po.js'),
    skills = require('../management/skills.po.js'),
    roles = require('../management/role.po.js'),
    groups = require('../management/groups.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    integrations = require('../configuration/integrations.po.js'),
    flows = require('../flows/flows.po.js'),
    media = require('../flows/media.po.js'),
    mediaCollections = require('../flows/mediaCollections.po.js'),
    queues = require('../flows/queues.po.js'),
    dispatchMappings = require('../flows/dispatchMappings.po.js'),
    params = browser.params,
    elementCount;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  describe('when right clicked', function() {
    it('should open a new tab with the user selected', function() {
      browser.get(shared.usersPageUrl);
      shared.tableElements.count().then(function(numUsers) {
        if (numUsers > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.usersPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(users.rightPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(users.emailLabel.getText());

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the skill selected', function() {
      browser.get(shared.skillsPageUrl);
      shared.tableElements.count().then(function(numSkills) {
        if (numSkills > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.skillsPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(skills.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the group selected', function() {
      browser.get(shared.groupsPageUrl);
      shared.tableElements.count().then(function(numGroups) {
        if (numGroups > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.groupsPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(groups.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the role selected', function() {
      browser.get(shared.rolesPageUrl);
      shared.tableElements.count().then(function(numRoles) {
        if (numRoles > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.rolesPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(roles.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the tenant selected', function() {
      browser.get(shared.tenantsPageUrl);
      shared.tableElements.count().then(function(numTenants) {
        if (numTenants > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.tenantsPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(tenants.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the integration selected', function() {
      browser.get(shared.integrationsPageUrl);
      shared.tableElements.count().then(function(numIntegrations) {
        if (numIntegrations > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.integrationsPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(integrations.typeHeader.getText());

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the flow selected', function() {
      browser.get(shared.flowsPageUrl);
      shared.tableElements.count().then(function(numFlows) {
        if (numFlows > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.flowsPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(flows.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the queue selected', function() {
      browser.get(shared.queuesPageUrl);
      shared.tableElements.count().then(function(numQueues) {
        if (numQueues > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.queuesPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(queues.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the media selected', function() {
      browser.get(shared.mediaPageUrl);
      shared.tableElements.count().then(function(numMedia) {
        if (numMedia > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.mediaPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(media.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the media collection selected', function() {
      browser.get(shared.mediaCollectionsPageUrl);
      shared.tableElements.count().then(function(numMediaCollections) {
        if (numMediaCollections > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.mediaCollectionsPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(mediaCollections.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });

    it('should open a new tab with the dispatch mapping selected', function() {
      browser.get(shared.dispatchMappingsPageUrl);
      shared.tableElements.count().then(function(numDispatchMappings) {
        if (numDispatchMappings > 0) {
          shared.firstTableRow.getText().then(function(selectedRow) {
            // Select row to open in a new tab
            browser.actions().mouseMove(shared.firstTableRow.element(by.css('td:nth-child(2)'))).keyDown(protractor.Key.CONTROL).click().keyUp(protractor.Key.CONTROL).perform().then(function() {
              // Wait for new tab to open
              browser.driver.wait(function() {
                return browser.getAllWindowHandles().then(function(handles) {
                  return handles.length === 2;
                });
              }, 5000);

              browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                  expect(browser.getCurrentUrl()).toContain(shared.dispatchMappingsPageUrl);

                  // Expect details panel in new tab to be opened with selected row
                  expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
                  expect(selectedRow).toContain(dispatchMappings.nameFormField.getAttribute('value'));

                  // CLose new tab and swtich back to original
                  browser.driver.close();
                  browser.driver.switchTo().window(handles[0]);
                });
              });
            });
          });
        }
      });
    });
  });

});
