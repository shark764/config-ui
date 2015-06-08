'use strict';

describe('The create new flows view', function() {
  var loginPage = require('./login.po.js'),
    flows = require('./flows.po.js'),
    shared = require('./shared.po.js'),
    flowCount,
    randomFlow;

  beforeAll(function() {
    loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
  });

  beforeEach(function() {
    browser.get(shared.flowsPageUrl);
    flowCount = flows.flowElements.count();
  });

  afterAll(function(){
    shared.tearDown();
  });

  it('should include supported flow fields only', function() {
    expect(flows.nameFormField.isDisplayed()).toBeTruthy();
    expect(flows.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(flows.submitFlowFormBtn.isDisplayed()).toBeTruthy();
  });

  it('should add new flow to table', function() {
    var flowAdded = false;
    randomFlow = Math.floor((Math.random() * 100) + 1);

    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBeGreaterThan(flowCount);

    // Confirm flow is displayed in flow list with correct details
    flows.flowElements.then(function(flowsList) {
      for (var i = 1; i <= flowsList.length; ++i) {
        // Check if flow name in table matches newly added flow
        element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2) > a:nth-child(1)')).getText().then(function(value) {
          if (value == 'Flow ' + randomFlow) {
            flowAdded = true;
          }
        });
      }
    }).thenFinally(function() {
      // Verify new flow was found in the table
      expect(flowAdded).toBeTruthy();
    });
  });

  it('should require field inputs when creating a new flow', function() {
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);
  });

  it('should require name when creating a new flow', function() {
    randomFlow = Math.floor((Math.random() * 100) + 1);

    // Complete flow form and submit without flow name
    flows.descriptionFormField.sendKeys('This is the flow description for flow ' + randomFlow);
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);
  });

  it('should require description when creating a new flow', function() {
    randomFlow = Math.floor((Math.random() * 100) + 1);

    // Complete flow form and submit without flow description
    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);
  });

  it('should not require Active toggle change when creating a new Flow', function() {
    randomFlow = Math.floor((Math.random() * 100) + 1);
    flows.nameFormField.sendKeys('Flow' + randomFlow);
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBeGreaterThan(flowCount);
  });

  it('should validate field input when creating a new flow', function() {
    // TODO
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);
  });

  it('should not accept spaces only as valid field input when creating a new flow', function() {
    // TODO
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBe(flowCount);
  });

  it('should require unique flow name when creating a new flow', function() {
    if (flowCount > 0) {
      // Attempt to create a new Flow with the name of an existing Flow
      flows.flowElements.then(function(existingFlows) {
        flows.nameFormField.sendKeys(existingFlows.get(0).name);
        flows.descriptionFormField.sendKeys('This is the flow description for flow');
        flows.submitFlowFormBtn.click();

        // Verify flow is not created
        expect(flows.flowElements.count()).toBe(flowCount);
        // TODO Error message displayed
      });
    }
  });

});
