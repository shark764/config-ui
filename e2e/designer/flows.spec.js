'use strict';

describe('The flows view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    flows = require('./flows.po.js'),
    flowCount,
    randomFlow;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    browser.get(shared.flowsPageUrl);
    flowCount = flows.flowElements.count();
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should include flow management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(flows.nameFormField.isDisplayed()).toBeTruthy();
    expect(flows.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(flows.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(flows.submitFlowFormBtn.isDisplayed()).toBeTruthy();
  });


  it('should display flow details when selected from table', function() {
    if (flowCount > 0) {
      // Select first flow from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)")).click();

      // Verify flow name in table matches populated field
      expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(nameFormField).getAttribute('value');

      if (flowCount > 1) {
        // Change selected flow and ensure details are updated
        element(by.css("tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)")).click();

        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(2) > a:nth-child(1)')).getText()).toContain(nameFormField).getAttribute('value');
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(4)')).getText()).toContain(nameFormField).getAttribute('value');
      }
    }
  });

  it('should display flow version page when version is selected from table', function() {
    if (flowCount > 0) {
      // Select first flow version from table
      element(by.css("tr.ng-scope:nth-child(1) > td:nth-child(6) > a:nth-child(1)")).click();

      // Verify flow version page is displayed
      expect(browser.getCurrentUrl()).toContain(shared.flowVersionsPageUrl);
    }
  });

  it('should require all fields when creating a new Flow', function() {
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);
  });

  it('should require name field when creating a new Flow', function() {
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);

    //TODO Verify error messages
  });

  it('should require description field when creating a new Flow', function() {
    flows.nameFormField.sendKeys('Flow');
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);

    //TODO Verify error messages
  });

  it('should not require Active toggle change when creating a new Flow', function() {
    randomFlow = Math.floor((Math.random() * 100) + 1);
    flows.nameFormField.sendKeys('Flow' + randomFlow);
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBeGreaterThan(flowCount);
  });

});
