'use strict';

describe('The details panel', function() {
  var loginPage = require('../login/login.po.js'),
    shared = require('../shared.po.js'),
    detailsPanel = require('../navigation/detailsPanel.po.js'),
    params = browser.params;

  beforeAll(function() {
    shared.tearDown();
    loginPage.login(params.login.user, params.login.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should be allow the user to close the details panel when viewing details', function() {
    browser.get(shared.usersPageUrl);

    shared.firstTableRow.click();

    expect(shared.detailsPanel.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeTruthy();

    detailsPanel.closePanelButton.click();

    expect(shared.detailsPanel.isDisplayed()).toBeFalsy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });

  it('should allow the user to close the bulk actions panel', function() {
    browser.get(shared.usersPageUrl);

    shared.actionsBtn.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeTruthy();
    expect(shared.rightPanel.isDisplayed()).toBeTruthy();

    detailsPanel.closeBulkPanelButton.click();

    expect(shared.bulkActionsPanel.isDisplayed()).toBeFalsy();
    expect(shared.rightPanel.isDisplayed()).toBeFalsy();
  });
});
