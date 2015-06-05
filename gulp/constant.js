'use strict';

var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');

module.exports = function (options) {
  gulp.task('config', function () {
    return gulp.src(options.src + '/app/env.js')
      .pipe(gulp.dest(options.dist + '/app'));
  });
}
