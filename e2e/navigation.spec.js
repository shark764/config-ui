'use strict';

describe('The navigation', function() {

  beforeEach(function() {});

  it('should redirect to home page from login page when logged in', function() {
    browser.get('http://localhost:3000/#/login');
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/');
  });

  it('should redirect to login page when not logged in', function() {
    browser.get('http://localhost:3000');
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');
  });

  it('should redirect user page to login page when not logged in', function() {
    browser.get('http://localhost:3000/#/users');
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');
  });

  it('should redirect tenants page to login page when not logged in', function() {
    browser.get('http://localhost:3000/#/tenants');
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');
  });

  // TODO: Complete remaining expected redirects as new pages are added
});
