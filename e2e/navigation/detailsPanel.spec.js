'use strict';

describe('The details panel', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    detailsPanel = require('../navigation/detailsPanel.po.js'),
    params = browser.params,
    detailsPanelWidthRatio;

  beforeAll(function() {
    shared.tearDown();
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should default to 1/4 - 1/3 of the screen size', function() {
    browser.get(shared.usersPageUrl);

    shared.firstTableRow.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();

    browser.driver.manage().window().getSize().then(function(browserSize) {
      shared.detailsPanel.getSize().then(function(detailsPanelSize) {
        detailsPanelWidthRatio = browserSize.width / detailsPanelSize.width;
        expect(detailsPanelWidthRatio).toBeGreaterThan(2);
        expect(detailsPanelWidthRatio).toBeLessThan(5);
      });
    });
  });

  it('should adjust to ~ 1/4 of the screen size after resizing browser width', function() {
    browser.driver.manage().window().getSize().then(function(browserSize) {
      // resize browser width
      browser.driver.manage().window().setSize(1200, browserSize.height);

      browser.get(shared.usersPageUrl);
      shared.firstTableRow.click();

      expect(shared.detailsPanel.isDisplayed()).toBeTruthy();

      shared.detailsPanel.getSize().then(function(detailsPanelSize) {
        detailsPanelWidthRatio = 1200 / detailsPanelSize.width;
        expect(detailsPanelWidthRatio).toBeGreaterThan(2);
        expect(detailsPanelWidthRatio).toBeLessThan(5);
      });
    }).then(function () {
      // reset browser width
      browser.driver.manage().window().maximize();
    });
  });

  it('should be allow the user to close the details panel when viewing details', function() {
    browser.get(shared.usersPageUrl);

    shared.firstTableRow.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();

    detailsPanel.closePanelButton.click();

    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
  });

  it('should allow the user to close the bulk actions panel', function() {
    browser.get(shared.usersPageUrl);

    shared.actionsBtn.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeTruthy();
    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();

    detailsPanel.closeBulkPanelButton.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeFalsy();
    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
  });
});
