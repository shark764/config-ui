'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var browserSync = require('browser-sync');
var yargs = require('yargs');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {

  var argv = yargs.boolean([]).argv;

  gulp.task('flags', function () {
    return gulp.src('conf/flags.json')
      .pipe($.ngConstant({
        name: 'liveopsConfigPanel.flags',
        constants: {
          appFlags: {
            OUTBOUND_PAGES: argv.outboundPages || true,
            SHOW_ZENDESK: argv.showZendesk || true,
            APPDOCK: argv.showAppdock || true,
            API_KEYS: argv.showApiKeys || false,
            CONTACT_MANAGEMENT: argv.contactManagement || true,
            PLATFORM_REPORTING: argv.platformReporting || true,
            EMAIL_PERMS: argv.emailPerms || false,
            VERINT_INTEGRATION: argv.verintIntegration || false,
            LOGI: argv.logi || false
          }
        }
      }))
      .pipe(replace('angular.module', '\'use strict\';\r\nangular.module'))
      .pipe(replace(/"/g, '\''))
      .pipe(gulp.dest(options.src + '/app'));
  });
};
