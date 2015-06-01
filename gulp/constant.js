'use strict';

var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');

module.exports = function (options) {
  gulp.task('config', ['env'], function () {
    return gulp.src('constants.json')
      .pipe(ngConstant({
        name: 'liveopsConfigPanel.config'
      }))
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  });
  
  gulp.task('env', function () {
    return gulp.src(options.src + '/app/env.js')
      .pipe(gulp.dest(options.dist + '/scripts'));
  });
}