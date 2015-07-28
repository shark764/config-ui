'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

exports.config = {

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'platform': 'Windows 8',
    'browserName': 'chrome',
    'version': '43',
    'screenResolution': '1280x1024',
    'tunnelIdentifier': process.env.SAUCE_TUNNEL,
    // Test Identifiers - For easier grouping and reference in Sauce Labs
    'name': '',
    'build': '',
    'tags': [''],
    'max-duration': '5400',
  },

  // Timeout time in milliseconds; prevents Protractor waiting to synchronize timeouts
  // Defaults to 11 seconds
  allScriptsTimeout: 30000,

  // This can be changed via the command line as:
  // --params.login.user 'ngrocks'
  params: {
    login: {
      firstName: 'titan',
      lastName: 'user',
      user: 'titan@liveops.com',
      password: 'gKVnfF9wrs6XPSYs'
    },
  },

  onPrepare: function() {
    browser.driver.manage().window().maximize();
  },

  // Test suites are run as follows: protractor protractor.conf.js --suite smoke
  suites: {
    // Smoke test suite - Nothing added or edited
    smoke: [
      paths.e2e + '/login/*.spec.js',
      paths.e2e + '/navigation/*.spec.js',
      paths.e2e + '/tableControls/*.spec.js',
      paths.e2e + '/userProfile/*.spec.js'
    ],
    regression: [paths.e2e + '/**/*.spec.js']
  },

  framework: 'jasmine2',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000
  }
};
