'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');
var ngConstant = require('gulp-ng-constant');

module.exports = function (options) {

  function listFiles(callback) {
    var wiredepOptions = _.extend({}, options.wiredep, {
      dependencies: true,
      devDependencies: true
    });
    var bowerDeps = wiredep(wiredepOptions);

    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];

    var htmlFiles = [
      options.src + '/**/*.html'
    ];

    var srcFiles = [
      options.tmp + '/serve/app/liveops.js',
      options.tmp + '/serve/app/constants.js',
      options.src + '/app/**/*.js',
      '!' + options.src + '/app/env.js',
      '!' + options.src + '/app/translation-loader.js',
    ].concat(specFiles.map(function (file) {
      return '!' + file;
    }));


    gulp.src(srcFiles)
      .pipe(concat(function (files) {
        callback(bowerDeps.js
          .concat(_.pluck(files, 'path'))
          .concat(htmlFiles)
          .concat(specFiles));
      }));
  }

  function runTests(singleRun, reporters, done) {
    listFiles(function (files) {
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters
      }, done);
    });
  }

  gulp.task('test-setup', ['env'], function () {
    return gulp.src('constants.json')
      .pipe(ngConstant({
        name: 'liveopsConfigPanel.config',
        constants: {
          apiHostname: 'fakendpoint.com'
        }
      }))
      .pipe(gulp.dest(options.tmp + '/serve/app'));
  });

  gulp.task('test', ['test-setup', 'scripts'], function (done) {
    runTests(true, ['progress'], done);
  });

  gulp.task('test:auto', ['watch'], function (done) {
    runTests(false, ['progress'], done);
  });

  gulp.task('coverage', ['test-setup', 'scripts'], function (done) {
    runTests(true, ['progress', 'coverage'], done);
  });
};