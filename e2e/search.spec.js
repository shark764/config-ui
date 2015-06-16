'use strict';

describe('The table search', function () {
  var loginPage = require('./login.po.js'),
    shared = require('./shared.po.js');

    beforeAll(function() {
      loginPage.login(loginPage.emailLoginCreds, loginPage.passwordLoginCreds);
    });

    afterAll(function(){
      shared.tearDown();
    });

  xit('should filter queue table based on search', function() {
    // TODO
  });

    //TODO Add search tests for all pages with table search 

});
