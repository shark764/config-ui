'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');
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
      options.src + '/app/index.js',
      options.src + '/app/**/*.js',
      'test/test-env.js',
      '!' + options.src + '/app/components/flows/flowDesigner/**/*.js',
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

  function runTests(singleRun, reporters, specFiles, done, captureConsole) {
    listFiles(specFiles, function (files) {
      captureConsole === undefined ? true : false;

      karma.server.start({
        configFile: __dirname + '/../karma.conf.js',
        files: files,
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters,
        client: {
          captureConsole: captureConsole
        }
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
    var specFiles;
    if(typeof(argv.specFile) === 'object'){
      specFiles = argv.specFile;
    } else {
      specFiles = [argv.specFile];
    }

    runTests(true, ['progress'], specFiles, done, false);
  });

  gulp.task('test:errors', ['scripts'], function (done) {
    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];

    runTests(true, ['dots'], specFiles, done, false);
  });

  gulp.task('coverage', ['scripts'], function (done) {
    var specFiles = [
      options.src + '/**/*.spec.js',
      options.src + '/**/*.mock.js'
    ];
    runTests(true, ['progress', 'coverage'], specFiles, done);
  });
};
