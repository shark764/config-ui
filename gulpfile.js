'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  lang: 'src/lang',
  configShared: 'bower_components/liveops-config-panel-shared',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components',
    exclude: [
      'bower_components/stackframe/stackframe.js',
      'bower_components/error-stack-parser/error-stack-parser.js',
      'bower_components/stack-generator/stack-generator.js',
      'bower_components/source-map/source-map.js',
      'bower_components/stacktrace-gps/dist/stacktrace-gps.js',
      'bower_components/stacktrace-js/stacktrace.js'
    ]
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
