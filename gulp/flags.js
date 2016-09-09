'use strict';

var gulp = require('gulp');
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
            OUTBOUND_PAGES: argv.outboundPages || false,
            SHOW_ZENDESK: argv.showZendesk || false
          }
        }
      }))
      .pipe(gulp.dest(options.src + '/app'));
  });
};
