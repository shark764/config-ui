'use strict';

var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');

module.exports = function(options) {
  gulp.task('config', function () {
    var envConfig = require('../environments.json');
    
    return gulp.src('./constants.json')
      .pipe(ngConstant({
        name: 'liveopsConfigPanel.config',
        constants: envConfig[process.env.ENV || 'local']
      }))
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  });
}