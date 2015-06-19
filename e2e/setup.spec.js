'use strict';

describe('The initial setup', function() {
  var loginPage = require('./login/login.po.js'),
    shared = require('./shared.po.js'),
    tenants = require('./configuration/tenants.po.js'),
    invites = require('./management/invites.po.js'),
    users = require('./management/users.po.js'),
    params = browser.params,
    elementCount;

  beforeAll(function() {
    loginPage.login(params.liveops.user, params.liveops.password);
  });

  afterAll(function() {
    shared.tearDown();
  });

/*  it('should get response', function() {
    browser.get('http://localhost:3000/v1/invites')
    browser.executeAsyncScript((callback) - >
        $http = angular.injector(["ng"]).get("$http") $http(
          url: "http://localhost:9080/v1/tenants/6b147bb0-15d5-11e5-9ca7-b1d420920055/invites"
          method: "post"
          Authorization: 'Basic dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw=='
          data: '{"roleId":"10f15d80-0052-11e5-b68b-fb65b1fe22e1","tenantId":"6b147bb0-15d5-11e5-9ca7-b1d420920055","email":"gsfdghdfh@mailinator.com"}'
        )
        .success(- >
          callback([true])
        ).error((data, status) - >
          callback([false, data, status])
        )
      )
      .then((data) - > [success, response] = data
        if success console.log("Browser async finished without errors", response)
        else
          console.log("Browser async finished with errors", response)
      )
  });
*/

  xit('should add new tenant', function() {
    //if tenant & user do not exist
/*    browser.get(shared.tenantsPageUrl);
    // Complete tenant form and submit
    shared.createBtn.click();
    tenants.nameFormField.sendKeys('LiveOps');
    tenants.descriptionFormField.sendKeys('Tenant added for E2E testing');
    shared.submitFormBtn.click().then(function() {
      console.log('tenant added');
      shared.invitesNavButton.click();
      invites.emailFormField.sendKeys(params.login.user);
      invites.submitInviteBtn.click();
    }).then(function() {
      console.log('invite added');

      shared.usersNavButton.click();
      users.firstNameFormField.sendKeys('E2E');
      users.lastNameFormField.sendKeys('User');
      users.displayNameFormField.sendKeys('E2E User');
      users.passwordEditFormBtn.click();
      users.passwordFormField.sendKeys(params.login.password);
      shared.submitFormBtn.click();
      shared.closeMessageBtn.click();
      shared.welcomeMessage.click();
      shared.logoutButton.click();
    }).then(function() {
      console.log('after request');*/
      browser.get(shared.loginPageUrl);
      loginPage.login(params.login.user, params.login.password);
  //  }).then(function() {
      browser.get('http://localhost:9080/v1/tenants/6b147bb0-15d5-11e5-9ca7-b1d420920055/invites');
      element(by.css('body > pre:nth-child(1)')).getAttribute('invitationToken').getText().then(function (invitationToken) {
        console.log(invitationToken);
      });
  //  });
  });


  // A Protracterized httpGet() promise
function httpGet(siteUrl) {
    var http = require('http');
    var defer = protractor.promise.defer();

    http.get(siteUrl, function(response) {

        var bodyString = '';

        response.setEncoding('utf8');

        response.on("data", function(chunk) {
            bodyString += chunk;
        });

        response.on('end', function() {
            defer.fulfill({
                statusCode: response.statusCode,
                bodyString: bodyString
            });
        });

    }).on('error', function(e) {
        defer.reject("Got http.get error: " + e.message);
    });

    return defer.promise;
}

it('should return 200 and contain proper body', function() {
    httpGet("http://localhost:3000").then(function(result) {
        expect(result.statusCode).toBe(200);
        expect(result.bodyString).toContain('Apache');
    });
});



});
