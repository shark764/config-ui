'use strict';

var gulp = require('gulp');

function serve(options) {
  gulp.src(options.tmp + '/serve/**')
    .pipe(gulp.dest(options.dist));
  
  gulp.src('bower_components/**')
    .pipe(gulp.dest(options.dist + '/bower_components'));
    
  gulp.src(options.src + '/assets/**')
    .pipe(gulp.dest(options.dist + '/assets'));
  
  gulp.src(options.src + '/app/**')
    .pipe(gulp.dest(options.dist + '/app'));
}

module.exports = function(options) {
  
  gulp.task('build:copy', ['markups', 'inject'], function () {
    serve(options);
  });
  
  gulp.task('copy', function () {
    serve(options);
  });
  
  gulp.task('watch:copy', ['build:copy'], function () {
    
    gulp.watch([options.src + '/*.html', 'bower.json'], ['copy']);
    
    gulp.watch([
      options.src + '/app/**/*.css',
      options.src + '/app/**/*.scss'
    ], [function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    }, 'copy']);

    gulp.watch(options.src + '/app/**/*.js', [function(event) {
      if(isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    }, 'copy']);
    
    gulp.watch(options.src + '/app/**/*.html', ['copy']);
  });
};
