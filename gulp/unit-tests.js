'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');
var ngConstant = require('gulp-ng-constant');
var argv = require('yargs').argv;

module.exports = function (options) {

  function listFiles(specFiles, callback) {
    var wiredepOptions = _.extend({}, options.wiredep, {
      dependencies: true,
      devDependencies: true
    });
    var bowerDeps = wiredep(wiredepOptions);

    var htmlFiles = [
      options.src + '/**/*.html'
    ];
    
    var allSpecFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];
    
    var srcFiles = [
      options.src + '/app/**/*.js',
      'test/test-env.js',
      '!' + options.src + '/app/env.js',
      '!' + options.src + '/app/translation-loader.js'
    ].concat(allSpecFiles.map(function (file) {
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

  function runTests(singleRun, reporters, specFiles, done) {
    listFiles(specFiles, function (files) {
      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters
      }, done);
    });
  }

  gulp.task('test', ['scripts'], function (done) {
    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];
    runTests(true, ['progress'], specFiles, done);
  });
  
  gulp.task('test:single', ['scripts'], function (done) {
    if(typeof(argv.specFile) === 'object'){
      var specFiles = argv.specFile;
    } else {
      var specFiles = [argv.specFile];
    }
    
    runTests(true, ['progress'], specFiles, done);
  });

  gulp.task('coverage', ['scripts'], function (done) {
    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];
    runTests(true, ['progress', 'coverage'], specFiles, done);
  });
};
