'use strict';

describe('The flows view', function() {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js'),
    flows = require('./flows.po.js'),
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

  it('should include flow management page components', function() {
    expect(shared.navBar.isDisplayed()).toBeTruthy();

    expect(flows.nameFormField.isDisplayed()).toBeTruthy();
    expect(flows.descriptionFormField.isDisplayed()).toBeTruthy();
    expect(flows.activeFormToggle.isDisplayed()).toBeTruthy();
    expect(flows.submitFlowFormBtn.isDisplayed()).toBeTruthy();
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

  it('should add new flow to table', function() {
    var flowAdded = false;
    randomFlow = Math.floor((Math.random() * 100) + 1);

    flows.nameFormField.sendKeys('Flow ' + randomFlow);
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBeGreaterThan(flowCount);

    // Confirm user is displayed in user list with correct details
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

  it('should not require Active toggle change when creating a new Flow', function() {
    randomFlow = Math.floor((Math.random() * 100) + 1);
    flows.nameFormField.sendKeys('Flow' + randomFlow);
    flows.descriptionFormField.sendKeys('This is a new flow description');
    flows.submitFlowFormBtn.click();

    expect(flows.flowElements.count()).toBeGreaterThan(flowCount);
  });

});
