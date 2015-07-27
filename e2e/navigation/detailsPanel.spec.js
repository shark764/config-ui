'use strict';

describe('The details panel', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    detailsPanel = require('../navigation/detailsPanel.po.js'),
    params = browser.params,
    rightPanelWidthRatio;

  beforeAll(function() {
    shared.tearDown();
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should default to ~ 1/4 of the screen size', function() {
    browser.get(shared.usersPageUrl);

    shared.firstTableRow.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeTruthy();

    browser.driver.manage().window().getSize().then(function(browserSize) {
      shared.rightPanel.getSize().then(function(rightPanelSize) {
        rightPanelWidthRatio = browserSize.width / rightPanelSize.width;
        expect(rightPanelWidthRatio).toBeGreaterThan(3);
        expect(rightPanelWidthRatio).toBeLessThan(5);
      });
    });
  });

  it('should adjust to ~ 1/4 of the screen size after resizing browser width', function() {
    browser.driver.manage().window().getSize().then(function(browserSize) {
      // resize browser width
      browser.driver.manage().window().setSize(1000, browserSize.height);

      browser.get(shared.usersPageUrl);
      shared.firstTableRow.click();

      expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
      expect(shared.rightPanel.isDisplayed()).toBeTruthy();

      shared.rightPanel.getSize().then(function(rightPanelSize) {
        rightPanelWidthRatio = 800 / rightPanelSize.width;
        expect(rightPanelWidthRatio).toBeGreaterThan(3);
        expect(rightPanelWidthRatio).toBeLessThan(5);
      });
    }).then(function () {
      // reset browser width
      browser.driver.manage().window().maximize();
    });
  });

  xit('should be allow the user to close the details panel when viewing details', function() {
    browser.get(shared.usersPageUrl);

    shared.firstTableRow.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeTruthy();

    detailsPanel.closePanelButton.click();

    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });

  xit('should allow the user to close the bulk actions panel', function() {
    browser.get(shared.usersPageUrl);

    shared.actionsBtn.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeTruthy();

    detailsPanel.closeBulkPanelButton.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeFalsy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });
});
