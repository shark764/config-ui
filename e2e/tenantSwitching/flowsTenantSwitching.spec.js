'use strict';

describe('When switching tenants', function() {
  var loginPage = require('../login/login.po.js'),
    tenants = require('../configuration/tenants.po.js'),
    shared = require('../shared.po.js'),
    flows = require('../flows/flows.po.js'),
    mediaCollections = require('../flows/mediaCollections.po.js'),
    media = require('../flows/media.po.js'),
    dispatchMappings = require('../flows/dispatchMappings.po.js'),
    queues = require('../flows/queues.po.js'),
    params = browser.params,
    elementCount,
    defaultTenantName,
    defaultTenantDropdownItem,
    defaultTenantElementList = [],
    newTenantName;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);

    browser.get(shared.tenantsPageUrl);
    shared.tenantsNavDropdown.getText().then(function(selectTenantNav) {
      defaultTenantName = selectTenantNav;
    });

    // Create new Tenant that all tests will use; admin defaults to current user
    newTenantName = tenants.createTenant();
    tenants.selectTenant(newTenantName);
  });

  afterAll(function() {
    shared.tearDown();
  });

  // TODO TITAN2-7078
  describe('Flow Management page', function() {
    beforeAll(function() {
      browser.get(shared.flowsPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should create a new Flow in one and not the previous', function() {
      // Create Flow in new tenant
      var randomFlow = Math.floor((Math.random() * 1000) + 1);
      var newTenantFlow = 'New Tenant Flow ' + randomFlow;
      shared.createBtn.click();

      flows.modalNameField.clear();
      flows.modalNameField.sendKeys(newTenantFlow);
      flows.modalTypeDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
      flows.submitModalBtn.click();
      expect(flows.createModal.isPresent()).toBeFalsy();

      // Redirects to flow designer
      flows.waitForFlowDesignerRedirect();
      expect(browser.getCurrentUrl()).toContain('/flows/editor');

      // Confirm flow is displayed in flow list with correct details
      browser.get(shared.flowsPageUrl);
      expect(shared.tableElements.count()).toBe(1);

      // Verify flow is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if flow name in table matches newly added flow
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantFlow);
        }
      });

      // Create flow in previous tenant
      randomFlow = Math.floor((Math.random() * 1000) + 1);
      var previousTenantFlow = 'Previous Tenant Flow ' + randomFlow;
      shared.createBtn.click();

      flows.modalNameField.clear();
      flows.modalNameField.sendKeys(previousTenantFlow);
      flows.modalTypeDropdown.all(by.css('option')).get((randomFlow % 3) + 1).click();
      flows.submitModalBtn.click();
      expect(flows.createModal.isPresent()).toBeFalsy();

      // Redirects to flow designer
      flows.waitForFlowDesignerRedirect();
      expect(browser.getCurrentUrl()).toContain('/flows/editor');

      // Confirm flow is displayed in flow list with correct details
      browser.get(shared.flowsPageUrl);

      // Verify flow is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(1);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if flow name in table matches newly added flow
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantFlow);
        }
      });
    });
  });

  describe('Media Management page', function() {
    beforeAll(function() {
      browser.get(shared.mediaPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should display the correct Media for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    xit('should create a new Media in one and not the previous', function() {
      // Create Media in new tenant
      var newTenantMedia = 'New Tenant Media ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      media.nameFormField.sendKeys(newTenantMedia);
      media.typeFormDropdown.all(by.css('option')).get(1).click();
      media.audioSourceFormField.sendKeys('http://www.example.com/');
      media.submitFormBtn.click().then(function() {
        shared.waitForSuccess();
        expect(shared.tableElements.count()).toBe(1);

        // Verify media is not added in previous tenant
        tenants.selectTenant(defaultTenantName);
        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            // Check if media name in table matches newly added media
            expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantMedia);
          }
        });

        // Create media in previous tenant
        var previousTenantMedia = 'Previous Tenant Media ' + Math.floor((Math.random() * 1000) + 1);
        shared.createBtn.click();
        media.nameFormField.sendKeys(previousTenantMedia);
        media.typeFormDropdown.all(by.css('option')).get(1).click();
        media.audioSourceFormField.sendKeys('http://www.example.com/');
        media.submitFormBtn.click().then(function() {
          shared.waitForSuccess();

          // Verify media is not added in new tenant
          tenants.selectTenant(newTenantName);
          expect(shared.tableElements.count()).toBe(1);
          shared.tableElements.then(function(rows) {
            for (var i = 1; i <= rows.length; ++i) {
              // Check if media name in table matches newly added media
              expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantMedia);
            }
          });
        });
      });
    });
  });

  describe('Media Collection Management page', function() {
    beforeAll(function() {
      browser.get(shared.mediaCollectionsPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should display the correct Media Collections for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    xit('should create a new Media Collection in one and not the previous', function() {
      // Create MediaCollection in new tenant
      var newTenantMediaCollection = 'New Tenant MediaCollection ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      mediaCollections.nameFormField.sendKeys(newTenantMediaCollection);
      mediaCollections.mediaIdentifiers.get(0).sendKeys('Identifier');
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();
      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();
      mediaCollections.submitFormBtn.click();

      shared.waitForSuccess();
      expect(shared.tableElements.count()).toBe(1);

      // Verify mediaCollection is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if mediaCollection name in table matches newly added mediaCollection
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantMediaCollection);
        }
      });

      // Create mediaCollection in previous tenant
      var previousTenantMediaCollection = 'Previous Tenant MediaCollection ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      mediaCollections.nameFormField.sendKeys(previousTenantMediaCollection);
      mediaCollections.mediaIdentifiers.get(0).sendKeys('Identifier');
      mediaCollections.mediaDropdowns.get(0).click();
      mediaCollections.mediaDropdownBoxes.get(0).all(by.repeater(mediaCollections.mediaElementsSelector)).get(0).click();
      mediaCollections.defaultIdDropdown.all(by.css('option')).get(1).click();
      mediaCollections.submitFormBtn.click();

      shared.waitForSuccess();

      // Verify mediaCollection is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(1);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if mediaCollection name in table matches newly added mediaCollection
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantMediaCollection);
        }
      });
    });
  });

  describe('Dispatch Mapping page', function() {
    beforeAll(function() {
      browser.get(shared.dispatchMappingsPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should display the correct Dispatch Mappings for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    xit('should create a new Dispatch Mapping in one and not the previous', function() {
      // Create DispatchMapping in new tenant
      var newTenantDispatchMapping = 'New Tenant DispatchMapping ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      dispatchMappings.nameFormField.sendKeys(newTenantDispatchMapping);
      dispatchMappings.mappingOptions.get(1).click();
      dispatchMappings.phoneFormField.sendKeys('15062345678');
      dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();
      expect(shared.tableElements.count()).toBe(1);

      // Verify dispatchMapping is not added in previous tenant
      tenants.selectTenant(defaultTenantName);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if dispatchMapping name in table matches newly added dispatchMapping
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantDispatchMapping);
        }
      });

      // Create dispatchMapping in previous tenant
      var previousTenantDispatchMapping = 'Previous Tenant DispatchMapping ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      dispatchMappings.nameFormField.sendKeys(previousTenantDispatchMapping);
      dispatchMappings.mappingOptions.get(1).click();
      dispatchMappings.phoneFormField.sendKeys('15062345678');
      dispatchMappings.flowDropdown.all(by.css('option')).get(1).click();
      shared.submitFormBtn.click();

      expect(shared.successMessage.isDisplayed()).toBeTruthy();

      // Verify dispatchMapping is not added in new tenant
      tenants.selectTenant(newTenantName);
      expect(shared.tableElements.count()).toBe(1);
      shared.tableElements.then(function(rows) {
        for (var i = 1; i <= rows.length; ++i) {
          // Check if dispatchMapping name in table matches newly added dispatchMapping
          expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantDispatchMapping);
        }
      });
    });
  });

  describe('Queue page', function() {
    beforeAll(function() {
      browser.get(shared.queuesPageUrl);
      elementCount = shared.tableElements.count();
    });

    xit('should display the correct Queues for the current tenant', function() {
      expect(elementCount).toBe(0);
    });

    xit('should create a new Queue in one and not the previous', function() {
      // Create Queue in new tenant
      var newTenantQueue = 'New Tenant Queue ' + Math.floor((Math.random() * 1000) + 1);
      shared.createBtn.click();
      queues.nameFormField.sendKeys(newTenantQueue);
      shared.submitFormBtn.click().then(function () {
        expect(shared.successMessage.isDisplayed()).toBeTruthy();
        expect(shared.tableElements.count()).toBe(1);

        // Verify queue is not added in previous tenant
        tenants.selectTenant(defaultTenantName);
        shared.tableElements.then(function(rows) {
          for (var i = 1; i <= rows.length; ++i) {
            // Check if queue name in table matches newly added queue
            expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(newTenantQueue);
          }
        });

        // Create queue in previous tenant
        var previousTenantQueue = 'Previous Tenant Queue ' + Math.floor((Math.random() * 1000) + 1);
        shared.createBtn.click();
        queues.nameFormField.sendKeys(previousTenantQueue);
        shared.submitFormBtn.click().then(function () {
          expect(shared.successMessage.isDisplayed()).toBeTruthy();

          // Verify queue is not added in new tenant
          tenants.selectTenant(newTenantName);
          expect(shared.tableElements.count()).toBe(1);
          shared.tableElements.then(function(rows) {
            for (var i = 1; i <= rows.length; ++i) {
              // Check if queue name in table matches newly added queue
              expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(2)')).getText()).not.toBe(previousTenantQueue);
            }
          });
        });
      });
    });
  });

});
