'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

module.exports = function(options) {

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
      options.src + '/app/**/*.js',
      options.tmp + '/serve/app/**/*.js'
    ].concat(specFiles.map(function(file) {
      return '!' + file;
    }));


    gulp.src(srcFiles)
      .pipe(concat(function(files) {
        callback(bowerDeps.js
          .concat(_.pluck(files, 'path'))
          .concat(htmlFiles)
          .concat(specFiles));
      }));
  }

  function runTests(singleRun, reporters, done) {
    listFiles(function(files) {
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters
      }, done);
    });
  }

  gulp.task('test-setup', [], function() {
    process.env.ENV = 'unitTest';
  });

  gulp.task('test', ['test-setup', 'config', 'scripts'], function(done) {
    runTests(true, ['progress'], done);
  });

  gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, ['progress'], done);
  });

  gulp.task('coverage', ['test-setup', 'config', 'scripts'], function(done) {
    runTests(true, ['progress', 'coverage'], done);
  });
};
