'use strict';

var gulp = require('gulp');
var ngConstant = require('gulp-ng-constant');

module.exports = function(options) {
  gulp.task('config', function () {
    var myConfig = require('../config.json');
    var envConfig = myConfig[process.env.ENV || 'local'];
    return ngConstant({
        name: 'liveopsConfigPanel.config',
        constants: envConfig,
        stream: true
      })
      .pipe(gulp.dest('.tmp/serve/app'));
  });
}