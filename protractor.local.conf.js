'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

exports.config = {

  capabilities: {
    'browserName': 'chrome',
    'version': '35'
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
      userDisplayName: 'titan',
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
      paths.e2e + '/login/**/*.spec.js',
      paths.e2e + '/navigation/**/*.spec.js',
      paths.e2e + '/search.spec.js',
      paths.e2e + '/userProfile/**/*.spec.js'
    ],
    regression: [paths.e2e + '/**/*.spec.js'],
    navigation: [paths.e2e + '/navigation/navigation.spec.js'],
    management: [paths.e2e + '/management/*.spec.js'],
    configuration: [paths.e2e + '/configuration/*.spec.js'],
    flows: [paths.e2e + '/flows/*.spec.js'],
    login: [paths.e2e + '/login/*.spec.js'],
    navigation: [paths.e2e + '/navigation/*.spec.js'],
    tableControls: [paths.e2e + '/tableControls/*.spec.js'],
    userProfile: [paths.e2e + '/userProfile/*.spec.js']
  },

  framework: 'jasmine2',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
