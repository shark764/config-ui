'use strict';

describe('The bulk actions', function() {
  var loginPage = require('../login/login.po.js'),
    bulkActions = require('../bulkActions.po.js'),
    columns = require('./columns.po.js'),
    shared = require('../shared.po.js'),
    params = browser.params;

  beforeAll(function() {
    loginPage.login(params.login.user, params.login.password);
  });

  beforeEach(function() {
    // Ignore unsaved changes warnings
    browser.executeScript("window.onbeforeunload = function(){};");
    browser.get(shared.usersPageUrl);
  });

  afterAll(function() {
    shared.tearDown();
  });

  it('should be displayed including checboxes on supported pages', function() {
    expect(shared.actionsBtn.isDisplayed()).toBeTruthy();

  });

  it('should not be displayed and not have checkboxes on non-supported pages', function() {

  });

  it('should be displayed when Actions is selected', function() {

  });

  it('should be closed when Cancel or X is selected', function() {

  });

  it('should close details pane when Actions is selected', function() {
// include unsaved changes warning
  });

  it('should be closed when table item or Create is selected', function() {


    // include unsaved changes warning
  });


  it('should display Unsaved Changes after changes when Cancel or X is selected', function() {

  });

  it('should show number and names of selected items', function() {

  });









  it('should toggle selecting all elements when the \'Select All\' checkbox is selected', function() {
    // Select all
    columns.selectAll.click();

    // Confirm all are selected
    expect(columns.selectAll.getAttribute('checked')).toBeTruthy();
    // Confirm all checkboxes are unselected
    shared.tableElements.then(function(allUsers) {
      for (var i = 1; i <= allUsers.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();
      };
    });

    // Unselect all
    columns.selectAll.click();

    // Confirm all are unselected
    expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
    // Confirm all checkboxes are unselected
    shared.tableElements.then(function(allUsers) {
      for (var i = 1; i <= allUsers.length; ++i) {
        expect(element(by.css('tr.ng-scope:nth-child(' + i + ') > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
      };
    });
  });

  it('should toggle selecting an elements when the \'Select\' checkbox is selected', function() {
    // Confirm checkboxes are able to be selected
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
    expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
    element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();
    expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();
    shared.tableElements.then(function(allUsers) {
      if (allUsers.length > 1) {
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
        element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();

        // Unselect both
        element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeTruthy();
        element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(2) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
      } else {
        // Unselect
        element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).click();
        expect(columns.selectAll.getAttribute('checked')).toBeFalsy();
        expect(element(by.css('tr.ng-scope:nth-child(1) > td:nth-child(1) > input:nth-child(1)')).getAttribute('checked')).toBeFalsy();
      };
    });
  });








  it('should update number and names of selected items', function() {
  });

  it('should enable and disable bulk action fields when selected', function() {

  });

  it('should ignore disabled bulk action fields when unselected', function() {

  });


});
