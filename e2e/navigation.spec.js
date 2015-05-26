'use strict';

describe('The view navigation', function () {

  beforeEach(function () {
  });

  it('should redirect as login page when not logged in', function() {
    browser.get('http://localhost:3000/#/users');
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#/login');
  });

  // TODO: Complete remaining expected redirects as new pages are added
});
