'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('scripts', function () {
    return gulp.src(options.src + '/app/**/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      // commenting the .pipe() call below b/c it's super-annoying
      // for build to die upon linting error during dev process,
      // but maybe someone will want it later (?)
      //.pipe($.jshint.reporter('fail'))
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size());
  });
};
