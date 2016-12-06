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
            SHOW_ZENDESK: argv.showZendesk || false,
            APPDOCK: argv.showAppdock || true,
            API_KEYS: argv.showApiKeys || false,
            TEMPLATES: argv.showTemplates || false
          }
        }
      }))
      .pipe(replace('angular.module', '\'use strict\';\r\nangular.module'))
      .pipe(replace(/"/g, '\''))
      .pipe(gulp.dest(options.src + '/app'));
  });
};
