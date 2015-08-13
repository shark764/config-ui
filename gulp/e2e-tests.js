'use strict';
var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

var SauceTunnel = require('sauce-tunnel');
var tunnel;

module.exports = function(options) {
  // Downloads the selenium webdriver
  gulp.task('webdriver-update', $.protractor.webdriver_update);

  gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

  gulp.task('sauce-start', function(done) {
    tunnel = new SauceTunnel(process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY, process.env.SAUCE_TUNNEL);
    // Enhance logging
    var methods = ['write', 'writeln', 'error', 'ok', 'debug'];
    methods.forEach(function(method) {
      tunnel.on('log:' + method, function(text) {
        console.log(method + ": " + text);
      });
      tunnel.on('verbose:' + method, function(text) {
        console.log(method + ": " + text);
      });
    });
    // End enhance logging

    tunnel.start(function(isCreated) {
      if (!isCreated) {
        done('Failed to create Sauce tunnel.');
      } else {
        console.log("Connected to Sauce Labs.");
        runProtractor(done);
      }
    });
  });

  function runProtractor(done) {
    gulp.src(options.e2e + '/**/*.spec.js')
      .pipe($.protractor.protractor({
        configFile: 'protractor.conf.js'
      }))
      .on('error', function(err) {
        tunnel.stop(function(){
          // Make sure failed tests cause gulp to exit non-zero
          throw err;
        });
      }).on('end', function() {
        console.log('Stopping the server.');
        browserSync.exit();
        tunnel.stop(function() {
          done();
        });
      });
  }

  function runProtractorLocal (done) {
    gulp.src(options.e2e + '/flows/mediaCollections.spec.js')
      .pipe($.protractor.protractor({
        configFile: 'protractor.local.conf.js'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      })
      .on('end', function () {
        // Close browser sync server
        browserSync.exit();
        done();
      });
  }

  gulp.task('protractor', ['sauce-start']);
  gulp.task('protractor:local', ['serve:e2e', 'webdriver-update'], runProtractorLocal);
};
