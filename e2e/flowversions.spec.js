'use strict';

describe('The flow versions view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    flowVersions = require('./flows.po.js'),
    flowVersionCount,
    randomFlowVersion;

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.flowsPageUrl);
    if (flows.flowElements.count() > 0) {
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(6) > a:nth-child(1)")).click();
      flowCount = flows.flowElements.count();
    }
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include flow version management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();
    expect(browser.getCurrentUrl()).toContain(shared.flowVersionsPageUrl);

    expect(flowVersions.nameFormField.isDisplayed()).toBeTruthy();
    expect(flowVersions.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(flowVersions.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(flowVersions.submitFlowVersionFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should require all fields when creating a new Flow Version', function() {
    flowVersions.submitFlowVersionFormBtn.click();

    expect(flowVersions.flowVersionElements.count()).toBe(flowVersionCount);
  });

  it('should require name field when creating a new Flow Version', function() {
    flowVersions.descriptionFormField.sendKeys('This is a new flow version description');
    flowVersions.submitFlowVersionFormBtn.click();

    expect(flowVersions.flowVersionElements.count()).toBe(flowVersionCount);

    //TODO Verify error messages
  });

  it('should require description field when creating a new Flow Version', function() {
    flowVersions.nameFormField.sendKeys('Flow Version');
    flowVersions.submitFlowFormBtn.click();

    expect(flowVersions.flowVersionElements.count()).toBe(flowVersionCount);

    //TODO Verify error messages
  });

  it('should add new flow version to table', function() {
    var flowVersionAdded = false;
    randomFlow = Math.floor((Math.random() * 100) + 1);

    flowVersions.nameFormField.sendKeys('Flow Version ' + randomFlow);
    flowVersions.descriptionFormField.sendKeys('This is a new flow Version description');
    flowVersions.submitFlowVersionFormBtn.click();

    expect(flowVersions.flowVersionElements.count()).toBeGreaterThan(flowVersionCount);

    // Confirm user is displayed in user list with correct details
    flowVersions.flowVersionElements.then(function(flowVersionsList) {
      for (var i = 1; i <= flowVersionList.length; ++i) {
        // Check if flow version name in table matches newly added flow version
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText().then(function(value) {
          if (value == 'Flow ' + randomVersionFlow) {
            flowVersionAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new flow version was found in the table
      expect(flowVersionAdded).toBeTruthy();
    });
  });

});
