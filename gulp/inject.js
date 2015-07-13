'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('inject', ['partials', 'scripts', 'styles'], function() {
    var injectStyles = gulp.src([
      options.tmp + '/serve/app/**/*.css',
      '!' + options.tmp + '/serve/app/vendor.css'
    ], {
      read: false
    });

    var injectScripts = gulp.src([
        options.src + '/app/**/*.js',
        options.tmp + '/serve/**/*.js',
        '!' + options.src + '/app/env.js',
        '!' + options.src + '/app/**/*.spec.js',
        '!' + options.src + '/app/**/*.mock.js'
      ])
      .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));

    var injectOptions = {
      ignorePath: [
        options.src,
        options.tmp + '/serve'
      ],
      addRootSlash: false
    };

    var partialsInjectFile = gulp.src(options.tmp + '/serve/app/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: [
        options.src,
        options.tmp + '/serve'
      ],
      addRootSlash: false
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe(wiredep(options.wiredep))
      .pipe(gulp.dest(options.tmp + '/serve'));
  });
};