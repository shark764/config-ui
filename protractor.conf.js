'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

exports.config = {

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'platform': 'Windows 8.1',
    'browserName': 'chrome',
    'version': '45',
    'screenResolution': '1280x1024',
    'tunnelIdentifier': process.env.SAUCE_TUNNEL,
    // Test Identifiers - For easier grouping and reference in Sauce Labs
    'name': process.env.SAUCE_SUITE_NAME,
    'build': process.env.SAUCE_BUILD,
    'tags': [process.env.SAUCE_TAG],
    // Max duration of entire suite in seconds; defaults to 30m
    'max-duration': '5400' // 1h 30m
  },

  // Timeout time in milliseconds; prevents Protractor waiting to synchronize timeouts
  // Defaults to 11 seconds
  allScriptsTimeout: 100000,

  // This can be changed via the command line as:
  // --params.login.user 'ngrocks'
  params: {
    login: {
      firstName: 'titan',
      lastName: 'user',
      user: 'titan@liveops.com',
      password: 'gKVnfF9wrs6XPSYs'
    },

    mailinator: {
      inbox: 'titantest',
      token: '358b00e30aa94f62be812de7e4a66ee2',
      subject: 'Welcome to Titan',
      from: 'titan.noreply@liveops.com'
    }
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
    regression: [paths.e2e + '/**/*.spec.js'],
    management: [paths.e2e + '/management/*.spec.js'],
    configuration: [paths.e2e + '/configuration/*.spec.js'],
    invitations: [paths.e2e + '/invitations/*.spec.js'],
    flows: [paths.e2e + '/flows/*.spec.js'],
    login: [paths.e2e + '/login/*.spec.js'],
    navigation: [paths.e2e + '/navigation/*.spec.js'],
    tableControls: [paths.e2e + '/tableControls/*.spec.js'],
    tenantSwitching: [paths.e2e + '/tenantSwitching/*.spec.js'],
    userProfile: [paths.e2e + '/userProfile/*.spec.js']
  },

  framework: 'jasmine2',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  }
};
